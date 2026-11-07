import { useRef, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { businesses, getBusiness, searchBusinesses } from '@/data/directory';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/track';
import { useI18n } from '@/lib/i18n';
import { claimRoles, claimSchema, claimWants } from '@/lib/claims';
import { clientKey, Done, errorsFrom, Field, Honeypot, isBot, SendStatus, statusFromError } from '@/components/forms';
import { Button } from '@/components/ui/button';

export function ClaimForm({ listing }: { listing: string }) {
  const { t } = useI18n();
  const [slug, setSlug] = useState(getBusiness(listing)?.slug ?? '');
  const [query, setQuery] = useState('');
  const [v, setV] = useState({ name: '', role: '', contact: '', proof_url: '', wants: [] as string[], note: '' });
  const [hp, setHp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error' | 'limited'>('idle');
  const b = getBusiness(slug);
  const items = query.trim() ? searchBusinesses(query) : businesses;
  const claimStarted = useRef(false);
  function trackClaimStart(selectedSlug = slug) {
    if (claimStarted.current || !selectedSlug || isBot(hp)) return;
    claimStarted.current = true;
    track('claim_start', { slug: selectedSlug });
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    trackClaimStart();
    const parsed = claimSchema.safeParse({ ...v, listing_slug: b?.slug ?? '', listing_id: b?.id ?? null });
    if (!parsed.success) {
      const errs = errorsFrom(parsed.error.issues, t); setErrors(errs);
      const key = Object.keys(errs)[0]; if (key) document.getElementById(`claim-${key}`)?.focus();
      return;
    }
    setErrors({}); if (isBot(hp)) return setStatus('done');
    setStatus('sending');
    try { const { error } = await supabase.from('business_claims').insert({ ...parsed.data, client_key: clientKey() }); const st = statusFromError(error); if (st === 'done') track('claim_submit', { slug: parsed.data.listing_slug }); setStatus(st); }
    catch { setStatus('error'); }
  }
  if (status === 'done') return <Done text={t('claimThanks')} />;
  const input = (key: 'name' | 'contact' | 'proof_url', label: string, max: number, type: string, autoComplete?: string) => <Field id={`claim-${key}`} label={label} required error={errors[key]} hint={key === 'proof_url' ? t('claimProofHint') : undefined}><input id={`claim-${key}`} className="field min-h-11 text-base" type={type} autoComplete={autoComplete} maxLength={max} required enterKeyHint="next" aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `claim-${key}-error` : undefined} value={v[key]} onChange={(e) => setV({ ...v, [key]: e.target.value })} /></Field>;
  return <form onSubmit={submit} onFocusCapture={() => trackClaimStart()} noValidate className="relative space-y-5">
    {b && <h2 className="text-xl font-semibold break-words">{b.name}</h2>}
    {!getBusiness(listing) && <div className="space-y-3"><Field id="claim-search" label={t('claimSearch')}><input id="claim-search" type="search" className="field min-h-11 text-base" maxLength={100} value={query} onChange={(e) => setQuery(e.target.value)} /></Field><Field id="claim-listing_slug" label={t('fListing')} required error={errors["listing_slug"]}><select id="claim-listing_slug" className="field min-h-11 text-base" value={slug} onChange={(e) => { const value = e.target.value; setSlug(value); trackClaimStart(value); }}><option value="">{t('fChoose')}</option>{items.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select></Field>{items.length === 0 && <p className="text-sm text-muted-foreground">{t('claimEmpty')}</p>}</div>}
    {input('name', t('fName'), 100, 'text', 'name')}
    <Field id="claim-role" label={t('claimRole')} required error={errors["role"]}><select id="claim-role" className="field min-h-11 text-base" value={v.role} required aria-invalid={!!errors["role"]} onChange={(e) => setV({ ...v, role: e.target.value })}><option value="">{t('chooseOption')}</option>{claimRoles.map((r) => <option key={r} value={r}>{t(`claimRole_${r}`)}</option>)}</select></Field>
    {input('contact', t('subContact'), 150, 'text')}{input('proof_url', t('claimProof'), 500, 'url', 'url')}
    <fieldset><legend className="mb-2 font-semibold">{t('claimWants')}</legend><div className="grid grid-cols-2 gap-2">{claimWants.map((w) => <label key={w} className="flex min-h-11 min-w-0 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 shrink-0 accent-primary" checked={v.wants.includes(w)} onChange={(e) => setV({ ...v, wants: e.target.checked ? [...v.wants, w] : v.wants.filter((x) => x !== w) })} /><span>{t(`claimWant_${w}`)}</span></label>)}</div></fieldset>
    <Field id="claim-note" label={t('subNote')} error={errors["note"]}><textarea id="claim-note" className="field min-h-24 text-base" maxLength={2000} value={v.note} onChange={(e) => setV({ ...v, note: e.target.value })} /></Field>
    <Honeypot value={hp} onChange={setHp} /><SendStatus status={status} />
    <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="action-btn action-dark h-auto min-h-12 w-full whitespace-normal px-5">{status === 'sending' && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}{t(status === 'sending' ? 'sending' : 'claimSend')}</Button>
  </form>;
}