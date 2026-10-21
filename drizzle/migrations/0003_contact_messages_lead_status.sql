alter table public.contact_messages
  add column if not exists status text not null default 'new',
  add column if not exists admin_note text,
  add column if not exists status_changed_at timestamptz;
alter table public.contact_messages
  add constraint contact_messages_status_check check (status in ('new','contacted','quoted','won','lost')),
  add constraint contact_messages_admin_note_check check (admin_note is null or char_length(admin_note) <= 2000);
revoke insert on public.contact_messages from anon, authenticated;
grant insert (name, business_name, phone, message, source_listing_slug, page, client_key) on public.contact_messages to anon, authenticated;
grant update (status, admin_note) on public.contact_messages to authenticated;
create policy "Admins can update contact messages" on public.contact_messages
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create or replace function public.touch_lead_status() returns trigger
  language plpgsql set search_path = public as $$
begin
  if new.status is distinct from old.status then new.status_changed_at := now(); end if;
  return new;
end $$;
create trigger contact_messages_status_touch before update on public.contact_messages
  for each row execute function public.touch_lead_status();
create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);