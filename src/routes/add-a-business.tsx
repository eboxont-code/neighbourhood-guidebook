import { createFileRoute } from '@tanstack/react-router';
import { Page, pageMeta } from '@/components/site';
import { BusinessSubmissionForm } from '@/components/forms';
import { useI18n } from '@/lib/i18n';
export const Route = createFileRoute('/add-a-business')({
 head: () => pageMeta('Add a business', 'Suggest an everyday Kathmandu business for Sewa. Every submission is checked against a public source before listing.', '/add-a-business'),
 component: AddBusinessPage,
});
function AddBusinessPage() { const {t} = useI18n(); return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{t('addTitle')}</h1><p className="mt-3 mb-6 leading-relaxed text-muted-foreground">{t('addIntro')}</p><BusinessSubmissionForm /></Page>; }
