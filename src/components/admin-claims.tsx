import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { claimStatuses, claimRoles, claimWants } from '@/lib/claims';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { externalUrlHost, safeExternalHttpUrl } from '@/lib/urls';

type Claim = Tables<'business_claims'>;
const card = 'rounded-2xl border border-border bg-card p-4 space-y-3';
function ClaimCard({ row, onSaved }: { row: Claim; onSaved: (row: Claim) => void }) {
  const { t, lang } = useI18n();
  const [note, setNote] = useState(row.admin_note ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  async function save(status = row.status) {
    if (state === 'saving') return;
    setState('saving');
    const { data, error } = await supabase.from('business_claims').update({ status, admin_note: note.trim() || null }).eq('id', row.id).select('*').single();
    if (error || !data) return setState('error');
    onSaved(data); setState('saved');
  }
  const role = claimRoles.find((r) => r === row.role);
  const proofUrl = safeExternalHttpUrl(row.proof_url);
  const proofHost = proofUrl ? externalUrlHost(proofUrl) : null;
  return <li className={card}>
    <div className="flex flex-wrap justify-between gap-2"><Link to="/s/$slug" params={{ slug: row.listing_slug }} className="inline-flex min-h-11 items-center break-words text-primary underline">{row.listing_slug}</Link><time className="text-sm text-muted-foreground">{new Date(row.created_at).toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', { timeZone: 'Asia/Kathmandu' })}</time></div>
    <p className="break-words font-semibold">{row.name}{role && <> · {t(`claimRole_${role}`)}</>}</p>
    <p className="break-words text-sm">{t('subContact')}: {row.contact}</p>
    {proofUrl ? (
      <div className="space-y-1">
        <a href={proofUrl} target="_blank" rel="noopener noreferrer nofollow" title={proofUrl} className="inline-flex min-h-11 max-w-full items-center break-all text-sm text-primary underline">
          {t('claimProof')}: {proofHost}
        </a>
        <p className="text-xs text-muted-foreground">{t('adExternalLinkWarning')}</p>
      </div>
    ) : <p className="text-sm text-muted-foreground">{t('adInvalidExternalLink')}</p>}
    <div className="flex flex-wrap gap-2">{claimWants.filter((w) => row.wants.includes(w)).map((w) => <span key={w} className="rounded-full bg-muted px-2.5 py-1 text-xs">{t(`claimWant_${w}`)}</span>)}</div>
    {row.note && <p className="whitespace-pre-wrap break-words text-sm">{row.note}</p>}
    <div role="group" aria-label={t('adStatus')} className="flex flex-wrap gap-2">{claimStatuses.map((s) => <Button key={s} type="button" disabled={state === 'saving'} aria-pressed={row.status === s} onClick={() => save(s)} className={`chip h-auto min-h-11 ${row.status === s ? 'chip-on' : ''}`}>{t(`claimStatus_${s}`)}</Button>)}</div>
    <label className="block text-sm font-semibold">{t('adLeadNote')}<textarea className="field mt-1 min-h-20 text-base" maxLength={2000} value={note} onChange={(e) => { setNote(e.target.value); setState('idle'); }} onBlur={() => { if (note.trim() !== (row.admin_note ?? '')) void save(); }} /></label>
    {state !== 'idle' && <p role={state === 'error' ? 'alert' : 'status'} className={state === 'error' ? 'text-sm text-error' : 'text-sm text-muted-foreground'}>{t(state === 'saving' ? 'adSaving' : state === 'saved' ? 'adLeadSaved' : 'adLeadSaveError')}</p>}
    {state === 'error' && <Button type="button" variant="outline" onClick={() => save()}>{t('adRetry')}</Button>}
  </li>;
}
export function AdminClaims({ onCount }: { onCount: (n: number) => void }) {
  const { t, lang } = useI18n();
  const [rows, setRows] = useState<Claim[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<'all' | typeof claimStatuses[number]>('all');
  async function load() {
    setFailed(false);
    const { data, error } = await supabase.from('business_claims').select('*').order('created_at', { ascending: false });
    if (error) setFailed(true); else setRows(data);
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => { if (rows) onCount(rows.filter((r) => r.status === 'new').length); }, [rows, onCount]);
  if (failed) return <div className={card}><p>{t('adLoadError')}</p><Button variant="outline" onClick={load}>{t('adRetry')}</Button></div>;
  if (!rows) return <p>{t('adLoading')}</p>;
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  return <section><h2 className="mb-3 text-lg font-semibold">{t('adClaims')}</h2><div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t('adStatus')}>{(['all', ...claimStatuses] as const).map((s) => <Button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`chip h-auto min-h-11 ${filter === s ? 'chip-on' : ''}`}>{s === 'all' ? t('adLeadsAll') : t(`claimStatus_${s}`)} <span>{new Intl.NumberFormat(lang === 'ne' ? 'ne-NP' : 'en').format(rows.filter((r) => s === 'all' || r.status === s).length)}</span></Button>)}</div>{shown.length ? <ul className="space-y-3">{shown.map((r) => <ClaimCard key={r.id} row={r} onSaved={(next) => setRows((old) => old?.map((x) => x.id === next.id ? next : x) ?? null)} />)}</ul> : <p>{t('adClaimsEmpty')}</p>}</section>;
}