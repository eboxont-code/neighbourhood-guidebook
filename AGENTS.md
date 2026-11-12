# SEWA / Boxont project instructions

## Brand and authored content

- The consumer-facing product name is **SEWA**. The owning and commercial brand is **Boxont**.
- Use SEWA for consumer discovery surfaces and SEWA / Boxont together where ownership or commercial services need to be clear.
- Project-authored interface copy, documentation, metadata, commit messages and generated project content must use SEWA or Boxont identity only.
- Do not introduce unrelated company, product, person or competitor names into authored content.
- Do not alter real business names, addresses, social handles, source URLs, technical identifiers, package names, protocols, dependency identifiers or legally required notices.
- Do not add sample businesses or invented verification evidence to public listings.

## Repository safety

- Never force-push, rebase, amend or squash commits that have already been published.
- Make changes on a dedicated branch and keep each bundle independently reviewable.
- Do not change production data or apply database migrations without explicitly reviewing the migration and target environment.
- Never commit `.env`, secrets, service-role credentials, private customer data or location coordinates from a real visitor.
- The bundled listing snapshot is a resilience fallback. Do not remove it or silently replace it with invented records.

## Data architecture

- Live business records are stored in the database `listings` table. The indexed columns include `slug`, `city`, `area`, `category`, `status` and `sort_order`; the remaining business fields are in `data` JSON.
- The root route calls `ensureListings()` before child routes. Published rows are fetched by `src/lib/listings.functions.ts` and applied through `src/lib/listings.ts`.
- If the live query fails, the bundled snapshot in `src/data/directory.ts` remains available. Keep the failure visible to operations and do not represent fallback data as freshly verified.
- Area, category and city definitions remain in `src/data/directory.ts`. Database slug redirects preserve old listing URLs.
- The admin role is held in `user_roles`. Public sign-up is disabled. Every database write must be protected by row-level policies and database constraints; a hidden interface control is not security.
- Public form submissions use insert-only access. Private reads and administrative changes require the admin role.
- Form validation in the interface must agree with database constraints. Rate limits must be enforced server-side or in the database, not only in browser code.

## Migration discipline

- `supabase/migrations` is the deployment migration history. Apply new changes as forward-only migrations.
- Keep the parallel `drizzle/migrations` history and `drizzle/migrations/meta/_journal.json` aligned with deployed database changes.
- Never edit an already-applied migration to change production behaviour. Add a new corrective migration instead.
- For every table, function, trigger or RPC, check grants, row-level security, policy predicates and allowed input columns.
- Add automated contract tests for important frontend/database agreements. Clearly distinguish static migration checks from live database security tests.

## Application rules

- Development-mode preview builds place Nitro public assets in `dist`; production keeps Nitro defaults to preserve the existing hosting output.
- Interface strings go through `src/lib/i18n.tsx`. Business names and business-supplied data are not translated.
- Kathmandu opening status uses `Asia/Kathmandu` time. Do not guess opening status when the recorded schedule is missing or cannot be parsed.
- Field provenance is derived by `src/lib/provenance.ts`. Verification and freshness rules belong in `src/lib/verification.ts`.
- Location data is stored only for the local discovery feature and must not be sent to analytics. Sanitise errors and breadcrumbs before logging.
- Analytics must remain anonymous and must not collect names, account identifiers, exact device coordinates or other personal data.
- Keep `TRACK_EVENTS`, deployed SQL constraints and parallel migration constraints in sync. Add a test whenever an event is added or removed.
- Listing metadata and JSON-LD must only use recorded facts. Never invent addresses, hours, ratings, coordinates or official websites.
- Selected public leaf routes use `social-meta` for compact brand cards or source-matched resized listing covers; keep share images out of root metadata and preserve the canonical origin independently.
- Search pages and private administration pages must not be indexed. Website previews remain noindex and must stay out of the sitemap.
- Local landing pages must meet the real-listing threshold owned by `src/lib/local-pages.ts`. Keep page links and sitemap eligibility consistent.
- City-based area/category combinations below the shared threshold remain noindex browsing pages; qualifying combinations redirect permanently to `/a/<area>/<category>`, the only combination URLs in the sitemap, to avoid thin or duplicate indexable pages.
- Lazy-load map code on the client. Do not let browser-only mapping code execute during server rendering.
- Owner claims and website previews must continue to use the shared listing record and existing eligibility rules.

## Quality gate

Before a bundle is considered complete, run:

```sh
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Also review:

- Mobile layouts at narrow widths, including 390px.
- English and Nepali interface journeys.
- Anonymous versus administrator database permissions.
- Migration ordering and rollback/recovery implications.
- Canonical URLs, robots rules, sitemap output and structured data.
- Error logs for secrets, personal information and precise location data.

Do not claim that a check passed unless it was actually executed. Record any unverified production behaviour as outstanding.

## Lovable design prompts

- For design-heavy work through the connected Lovable project, use `docs/lovable-design-prompt-standard.md` as the required prompt structure and reusable template.
- Write a self-contained, goal-led prompt that explains the user problem, intended business outcome, exact user journey and observable acceptance criteria. Do not replace this with a vague request such as “make it modern” or “improve the design”; detail should make the work unambiguous, not add filler.
- Identify the exact project and inspect its current routes, components, design tokens, translations, data flow and relevant tests before proposing changes. Never guess which project or screen is meant.
- Locate and read the existing Lovable north-star/knowledge file before design-heavy work. Preserve it verbatim: do not shorten, replace, rewrite or silently override it. If the task conflicts with it, record the conflict and stop that part for an owner decision.
- State the exact in-scope pages and states, explicit non-goals, and constraints. Reuse the existing architecture and visual system; make the smallest complete change and avoid unrelated refactors.
- Include the relevant phone and desktop layouts, English and Nepali parity, keyboard/accessibility behaviour, and loading, empty, validation, error and success states. For visual changes, follow the screenshot-review requirements and identify the route, viewport and state shown.
- Use only recorded business facts and approved assets. Never invent listings, services, hours, prices, ratings, testimonials, sources, owner consent or verification evidence.
- Keep the $0 additional-spend rule. Do not add paid APIs/services, change production data or settings, run production migrations, send outreach, publish prices, or deploy/publish without the applicable explicit authorisation and release gates.
- Make every acceptance criterion observable and testable. Report checks actually run, screenshots actually inspected, exact preview/commit evidence, limitations and blockers; never describe an unverified preview or build as live.

