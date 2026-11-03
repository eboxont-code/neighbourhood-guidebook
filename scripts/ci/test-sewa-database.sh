#!/usr/bin/env bash
set -Eeuo pipefail

: "\${POSTGRES_CONTAINER_ID:?GitHub PostgreSQL service container ID is required}"

echo "Waiting for disposable PostgreSQL..."
docker exec "$POSTGRES_CONTAINER_ID" pg_isready -U postgres -d sewa_ci >/dev/null

echo "Preparing isolated auth schema and client roles..."
docker exec -i "$POSTGRES_CONTAINER_ID" psql -v ON_ERROR_STOP=1 -U postgres -d sewa_ci <<'SQL'
DO $$
BEGIN
  CREATE ROLE anon NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;
DO $$
BEGIN
  CREATE ROLE authenticated NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;
DO $$
BEGIN
  CREATE ROLE service_role NOLOGIN BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY);
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO PUBLIC;
SQL

echo "Applying all numbered database migrations..."
migration_count=0
for migration in drizzle/migrations/[0-9][0-9][0-9][0-9]_*.sql; do
  [[ -f "$migration" ]] || continue
  echo "Applying $migration"
  docker exec -i "$POSTGRES_CONTAINER_ID" psql -v ON_ERROR_STOP=1 -U postgres -d sewa_ci < "$migration"
  migration_count=$((migration_count + 1))
done

if [[ "$migration_count" -ne 11 ]]; then
  echo "Expected 11 migrations; found $migration_count." >&2
  exit 1
fi

echo "Checking RLS, function privileges, and cross-form throttling..."
docker exec -i "$POSTGRES_CONTAINER_ID" psql -v ON_ERROR_STOP=1 -U postgres -d sewa_ci < scripts/ci/verify-sewa-database.sql

echo "Testing concurrent submissions from one shared IP and client key..."
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT
concurrent_sql=$(cat <<'SQL'
SET ROLE anon;
SELECT set_config('request.headers', '{"cf-connecting-ip":"198.51.100.78"}', false);
SELECT pg_sleep(0.15);
INSERT INTO public.contact_messages (name, message, page, client_key)
VALUES ('SEWA CI Concurrent Test', 'Disposable concurrent rate-limit test', 'contact', 'sewa-concurrent-session');
SQL
)

pids=()
for attempt in $(seq 1 8); do
  (
    log="$tmpdir/$attempt.log"
    if docker exec "$POSTGRES_CONTAINER_ID" psql -v ON_ERROR_STOP=1 -q -U postgres -d sewa_ci -c "$concurrent_sql" >"$log" 2>&1; then
      printf 'accepted\n' > "$tmpdir/$attempt.result"
    elif grep -q 'rate_limited' "$log"; then
      printf 'limited\n' > "$tmpdir/$attempt.result"
    else
      cat "$log" >&2
      printf 'unexpected-error\n' > "$tmpdir/$attempt.result"
      exit 1
    fi
  ) &
  pids+=("$!")
done

failed=0
for pid in "\${pids[@]}"; do
  wait "$pid" || failed=1
done
if [[ "$failed" -ne 0 ]]; then
  echo "One or more concurrent database requests failed unexpectedly." >&2
  exit 1
fi

accepted="$(grep -l '^accepted$' "$tmpdir"/*.result | wc -l | tr -d ' ')"
limited="$(grep -l '^limited$' "$tmpdir"/*.result | wc -l | tr -d ' ')"
unexpected="$(grep -l '^unexpected-error$' "$tmpdir"/*.result | wc -l | tr -d ' ')"
if [[ "$accepted" -ne 3 || "$limited" -ne 5 || "$unexpected" -ne 0 ]]; then
  echo "Expected 3 accepted and 5 rate-limited submissions; got accepted=$accepted limited=$limited unexpected=$unexpected." >&2
  for log in "$tmpdir"/*.log; do cat "$log" >&2; done
  exit 1
fi

stored="$(docker exec "$POSTGRES_CONTAINER_ID" psql -Atq -U postgres -d sewa_ci -c "SELECT count(*) FROM public.contact_messages WHERE name = 'SEWA CI Concurrent Test' AND client_key IS NULL;")"
if [[ "$stored" -ne 3 ]]; then
  echo "Expected exactly 3 concurrent submissions stored with cleared client keys; found $stored." >&2
  exit 1
fi

echo "All 11 migrations and disposable PostgreSQL security/concurrency checks passed."
