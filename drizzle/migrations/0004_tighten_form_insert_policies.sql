drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message" on public.contact_messages
  for insert to anon, authenticated
  with check (
    status = 'new' and admin_note is null and status_changed_at is null
    and char_length(btrim(name)) > 0 and char_length(btrim(message)) > 0
  );
drop policy if exists "Anyone can report a correction" on public.correction_reports;
create policy "Anyone can report a correction" on public.correction_reports
  for insert to anon, authenticated
  with check (
    char_length(btrim(listing_slug)) > 0 and char_length(btrim(whats_wrong)) > 0
  );