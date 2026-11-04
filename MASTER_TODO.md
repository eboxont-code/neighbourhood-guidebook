# SEWA by Boxont — Master Plan & Living TODO

> **Single source of truth for project execution. Read this file before every SEWA/Boxont work session and update it before ending the session.**
>
> **Last reviewed:** 4 November 2026  
> **Repository:** `eboxont-code/neighbourhood-guidebook` (private)  
> **Production:** https://sewa.boxont.com  
> **Product:** SEWA  
> **Owner / commercial brand:** Boxont  
> **Primary market:** Kathmandu, Nepal  
> **Financial rule: $0 additional spend. Ask in bold before any action that could cost money.**

---

## 0. Mission and priorities

SEWA is a free, neighbourhood-first directory that helps people discover real local businesses and services. Boxont is the business behind SEWA.

The commercial objective is to turn SEWA's useful directory and genuine business-owner interest into **real paying customers for Boxont**. The directory remains free to browse. Optional Boxont services and clearly labelled sponsored placements are the monetisation channels.

The system should connect this journey:

1. A person discovers a local business on SEWA.
2. A business owner sees the value of having an accurate presence on SEWA.
3. An interested owner contacts Boxont or requests a service.
4. Boxont qualifies the enquiry and follows up.
5. Boxont prepares and sends a custom proposal.
6. The customer accepts and pays.
7. Boxont delivers the agreed work.
8. Boxont records actual cash received, refunds and outcomes.
9. SEWA/Boxont measures the results honestly and improves the offer.

**The goal is not to keep adding features. The goal is a useful product and a working, measurable business.**

### Priority order

1. Restore and verify the production release.
2. Reconcile existing Git branches and pull requests safely.
3. Complete and operate the Boxont revenue workflow.
4. Improve directory coverage, accuracy and trust.
5. Improve discovery, SEO, usability and organic growth.
6. Maintain security, privacy, reliability and $0 operating discipline.

---

## 1. Non-negotiable rules

- [ ] **$0 additional expenditure.** Use existing free allowances and open-source software. Never upgrade, subscribe, purchase an API, create billable infrastructure or accept a charge without asking for explicit approval first.
- [ ] Keep public SEWA directory discovery free.
- [ ] Never invent business details, addresses, coordinates, opening hours, reviews, ratings, prices, verification or performance results.
- [ ] Distinguish verified, source-checked, unknown and unverified information honestly.
- [ ] English and Nepali are first-class interface languages.
- [ ] Mobile usability, accessibility and performance are essential.
- [ ] Do not send unsolicited messages automatically or introduce bulk-spam outreach.
- [ ] Do not scrape private contact information.
- [ ] A lead, enquiry, quote or proposal is not revenue. Record revenue only when money is actually received; account for refunds.
- [ ] Sponsored placements must be clearly labelled and must never manipulate verification status or organic ranking.
- [ ] Keep customer contact details, payment information, internal notes and commercial records private.
- [ ] Never commit secrets, service-role keys, passwords, private deployment values or production credentials.
- [ ] Never deploy stale or unreviewed branches.
- [ ] Never apply production database migrations without checking their exact contents, dependencies and migration history.
- [ ] Never claim a task is complete without evidence.
- [ ] Do not repeat work already completed. Inspect the current repository and production state first.

---

## 2. How this checklist must be used

### Status convention

Use GitHub checkboxes with one status marker:

- `[ ] [TODO]` — not started.
- `[ ] [IN PROGRESS]` — currently being worked on; identify the active task.
- `[ ] [BLOCKED]` — cannot proceed; record the exact blocker and next condition.
- `[ ] [REVIEW]` — implementation exists but needs review, validation or release.
- `[x] [DONE]` — completed and verified, with evidence recorded where appropriate.

Never mark work [DONE] merely because code exists, a PR is merged, or a preview build passed. Completion must match the task's acceptance criteria.

### Mandatory start-of-session procedure

1. Read this entire `MASTER_TODO.md`.
2. Check the current `main` commit and working tree/repository state.
3. Check relevant branches, open PRs, recent commits and CI.
4. Check the production deployment when release work is involved.
5. Check the relevant database migration state before database work.
6. Find the highest-priority unfinished task.
7. Choose **one task only** and mark it [IN PROGRESS].
8. State the task, intended result and acceptance criteria before changing code.

### Mandatory end-of-session procedure

1. Record what actually changed.
2. Run relevant quality checks and tests.
3. Record branch, commit SHA and PR URL where applicable.
4. Record CI and deployment status separately.
5. Record database migration status separately.
6. Mark [DONE] only after evidence meets the acceptance criteria.
7. Record blockers and the precise next condition.
8. Update this file in GitHub.
9. Identify the next single task.

**This file is the project memory. Do not rely on chat history as the source of truth.**

---

## 3. Verified repository snapshot — 4 November 2026

### Repository baseline

- [x] [DONE] Private GitHub repository identified: `eboxont-code/neighbourhood-guidebook`.
- [x] [DONE] Production domain recorded as `https://sewa.boxont.com`.
- [x] [DONE] README describes the SEWA product, architecture, local setup, database rules and deployment checklist.
- [x] [DONE] Project scripts exist for typecheck, lint, tests and production build.
- [x] [DONE] Project documentation requires Supabase and Drizzle migration histories to remain aligned.

Latest observed `main` commit:

`a625ff94c48b03aa268bfdf885ff0eb974f5c664`

Commit message: `Fix SEWA admin password recovery redirect (#9)`.

The latest observed commit status included a Vercel failure caused by the free daily deployment quota. This is a deployment blocker, not proof that the source code failed to build.

### Known merged work

- [x] [DONE] Bundle 3 — security and operations hardening — merge commit `5569ca8254277479fd350ab623afbb786ab31349`.
- [x] [DONE] Bundle 5 — Boxont quote-to-cash revenue engine — merge commit `d5f104affdb29e7cd4a287b4a36e34cb86c3800b`.
- [x] [DONE] Bundle 6 — sponsored placement revenue channel — merge commit `74fe507db70a45a538dfec4bd3730a45d51e4ae2`.
- [x] [DONE] PR #9 — admin password recovery production redirect — merged to main; merge commit `a625ff94c48b03aa268bfdf885ff0eb974f5c664`.

The repository README also confirms the core SEWA foundation, directory discovery, business profiles, owner submissions/claims, administration, structured metadata and local quality scripts. Recheck individual historical PR states before relying on them.

### Known open pull requests at last audit

| PR | Work | Last observed state / action |
|---|---|---|
| #4 | Call and WhatsApp contact insights | Open; inspect whether still needed and reconcile |
| #7 | Boxont prospecting and sales pipeline | Open; branch diverged from main; reconcile |
| #8 | Convert inbound enquiries into sales opportunities | Open; branch diverged from main; reconcile after #7 |
| #9 | Admin password recovery | Merged |

PR references:
- #4: https://github.com/eboxont-code/neighbourhood-guidebook/pull/4
- #7: https://github.com/eboxont-code/neighbourhood-guidebook/pull/7
- #8: https://github.com/eboxont-code/neighbourhood-guidebook/pull/8
- #9: https://github.com/eboxont-code/neighbourhood-guidebook/pull/9

### Branch audit warning

The following branches existed at the last audit. They must not be merged blindly because they are behind or have diverged from current main:

- `sewa/bundle-04-admin-audit-health` — diverged; 4 commits ahead and 128 behind at last comparison.
- `sewa/bundle-04-revenue-lead-attribution` — diverged; 10 ahead and 133 behind.
- `sewa/bundle-07-sales-pipeline` — diverged; 24 ahead and 8 behind.
- `sewa/bundle-08-inbound-conversion` — diverged; 52 ahead and 8 behind.
- `sewa/bundle-09-proposal-composer` — diverged; 57 ahead and 8 behind.
- `sewa/admin-password-recovery-production-redirect` — merged work branch; do not redeploy its old preview as a substitute for current main.

These counts are a snapshot, not permanent facts. Always compare again before acting.

---

## 4. Current blocker — production deployment and admin recovery

### Admin password recovery implementation

- [x] [DONE] Forgot Password flow added to admin sign-in.
- [x] [DONE] Reset emails explicitly redirect to `https://sewa.boxont.com/admin`.
- [x] [DONE] Supabase `PASSWORD_RECOVERY` event handling added.
- [x] [DONE] New-password and confirmation screen added.
- [x] [DONE] English and Nepali recovery copy added.
- [x] [DONE] Generic response avoids revealing whether an email address has an account.
- [x] [DONE] Email validation correction included in merged commit.
- [x] [DONE] Project owner confirmed Supabase Auth URL configuration was updated to include the production redirect.
- [ ] [BLOCKED] Production release has not yet been verified. Last production deployment still served the earlier application bundle.
- [ ] [TODO] Recheck current Vercel deployment status and free daily quota.
- [ ] [TODO] Deploy current approved `main` commit when the free quota permits.
- [ ] [TODO] Verify production alias `sewa.boxont.com` points to the intended deployment and commit.
- [ ] [TODO] Inspect deployed assets to confirm the recovery code is actually present.
- [ ] [TODO] Trigger a real recovery email and confirm the link opens the production domain, not localhost.
- [ ] [TODO] Complete password reset and test a normal admin sign-in.
- [ ] [TODO] Test expired/invalid recovery links and session handling safely.

**Deployment note:** A Vercel attempt on 4 November 2026 was rejected with the free daily deployment limit error (`api-deployments-free-per-day`). The reported retry window was approximately 24 hours from the rejection. Recheck live status; do not assume the quota has reset at a particular time. Do not pay to bypass the limit.

**Acceptance criteria:** The production domain serves the latest approved main commit and the admin password reset succeeds end-to-end. Until then, this feature is merged but not live.

---

# 5. Execution roadmap

## PHASE 0 — Project control and safe release process

**Priority: CRITICAL**

- [x] [DONE] Establish this master plan as the intended single source of truth.
- [ ] [IN PROGRESS] Save this file in the repository root as `MASTER_TODO.md`.
- [ ] [TODO] Audit all active branches and open PRs against current main.
- [ ] [TODO] Map each branch to its unique feature, dependencies and PR.
- [ ] [TODO] Identify obsolete branches and duplicate bundle numbering.
- [ ] [TODO] Standardise future branch and PR naming.
- [ ] [TODO] Require a clear scope and acceptance criteria for every new task.
- [ ] [TODO] Require passing quality checks before merge.
- [ ] [TODO] Require migration review before any production schema change.
- [ ] [TODO] Record exact commit/deployment evidence after each release.
- [ ] [TODO] Keep this file current after each work session.

**Acceptance criteria:** A new session can read one file and understand the verified state, next task, blockers, dependencies and cost boundaries.

## PHASE 1 — Production release recovery

**Priority: CRITICAL**

- [ ] [IN PROGRESS] Recheck Vercel deployment status, quota and current production alias.
- [ ] [TODO] Deploy the latest approved main commit using the existing free allowance.
- [ ] [TODO] Confirm production alias and deployed commit SHA.
- [ ] [TODO] Verify homepage, neighbourhood pages and business profiles.
- [ ] [TODO] Verify admin sign-in.
- [ ] [TODO] Complete admin password recovery end-to-end.
- [ ] [TODO] Verify production environment variables and Supabase project target.
- [ ] [TODO] Check browser console/network errors on key journeys.
- [ ] [TODO] Record deployment URL, commit and test evidence here.

**Acceptance criteria:** The production domain serves the intended release and affected production journeys pass. A GitHub merge or preview deployment alone does not satisfy this phase.

**Cost constraint:** Do not upgrade Vercel to bypass a quota. Investigate existing free options first.

## PHASE 2 — Branch and PR reconciliation

**Priority: HIGH**

- [ ] [TODO] Inspect PR #4 and decide whether call/WhatsApp insights are still valuable.
- [ ] [TODO] If retained, port/rebase only the required changes onto a fresh branch from current main.
- [ ] [TODO] Inspect PR #7 Sales Pipeline changes and compare them with current main.
- [ ] [TODO] Preserve unique changes but remove duplicated/outdated inherited work.
- [ ] [TODO] Create a clean current-main-based Sales Pipeline PR.
- [ ] [TODO] Run all quality and database-contract tests on the clean branch.
- [ ] [TODO] Merge Sales Pipeline only after review and checks pass.
- [ ] [TODO] Inspect PR #8 inbound conversion and confirm it depends on the released Sales Pipeline.
- [ ] [TODO] Rebuild inbound conversion on the updated main branch, preserving only its unique changes.
- [ ] [TODO] Test duplicate prevention and canonical enquiry/payment record integrity.
- [ ] [TODO] Merge inbound conversion only after review and checks pass.
- [ ] [TODO] Inspect `sewa/bundle-09-proposal-composer`.
- [ ] [TODO] Isolate Proposal Composer changes from inherited Bundle 7/8 code.
- [ ] [TODO] Create a clean Proposal Composer PR based on current main after dependencies are merged.
- [ ] [TODO] Review old admin-audit and lead-attribution branches; salvage only genuinely needed changes.
- [ ] [TODO] Archive/delete obsolete branches only after verifying no unique work remains.

**Required dependency order:** Sales Pipeline → Inbound Enquiry Conversion → Proposal Composer.

**Do not merge diverged branches as-is.** Recompare against the latest main before every merge.

**Acceptance criteria:** Each retained feature has a small, understandable diff based on current main, passing CI and reviewed database changes.

## PHASE 3 — Complete and operate Boxont's revenue engine

**Priority: CRITICAL — MAIN COMMERCIAL OBJECTIVE**

### 3.1 Service enquiry and quote-to-cash

- [x] [DONE] Custom-quote enquiry foundation.
- [x] [DONE] Admin quote/payment tracking foundation.
- [x] [DONE] Separate quoted value from cash received.
- [x] [DONE] Revenue summary foundation.
- [ ] [TODO] Test full public enquiry → admin inbox → quote → payment journey.
- [ ] [TODO] Confirm visitors can submit enquiries but cannot write commercial fields.
- [ ] [TODO] Confirm only authorised admins can record quotes and payments.
- [ ] [TODO] Verify totals against source records, including partial payments/refunds where supported.
- [ ] [TODO] Ensure every qualified enquiry has a clear next action and follow-up owner.
- [ ] [TODO] Establish practical lead response and follow-up procedures.

### 3.2 Sponsored placements

- [x] [DONE] Sponsored campaign foundation.
- [x] [DONE] Neighbourhood-featured and category-featured placement types.
- [x] [DONE] Clear public Sponsored label.
- [x] [DONE] Manual quote, full-payment and refund recording safeguards.
- [x] [DONE] Campaign date-window and overlap protections.
- [ ] [TODO] Test a complete campaign from quote to paid activation.
- [ ] [TODO] Confirm quoted/unpaid/draft campaigns never appear publicly.
- [ ] [TODO] Confirm expired, cancelled and refunded campaigns are not shown.
- [ ] [TODO] Confirm organic ordering and verification status remain independent.
- [ ] [TODO] Report campaign listing opens accurately; do not mislabel them as impressions, leads or sales.
- [ ] [TODO] Prepare an owner-facing explanation of the optional promotion service.

### 3.3 Sales pipeline (Bundle 7)

- [ ] [TODO] Reconcile and release Bundle 7 on current main.
- [ ] [TODO] Verify prospect stages and allowed transitions.
- [ ] [TODO] Verify follow-up dates, due-soon and overdue queues use Kathmandu time.
- [ ] [TODO] Verify activity history and contact timestamps.
- [ ] [TODO] Verify service interest and preferred contact channel.
- [ ] [TODO] Verify English/Nepali outreach drafts.
- [ ] [TODO] Verify copy-to-clipboard and user-initiated phone/WhatsApp actions.
- [ ] [TODO] Verify do-not-contact, lost and won records cannot be casually re-contacted through drafts.
- [ ] [TODO] Verify private notes and CRM data are admin-only.
- [ ] [TODO] Verify cash/payment integrity and that quotes are not counted as received money.
- [ ] [TODO] Create a simple daily sales operating routine.

### 3.4 Incoming enquiries (Bundle 8)

- [ ] [TODO] Reconcile and release Bundle 8 after Bundle 7.
- [ ] [TODO] Verify direct service enquiries can become opportunities.
- [ ] [TODO] Verify listing-related enquiries can become opportunities.
- [ ] [TODO] Prevent duplicate conversion.
- [ ] [TODO] Preserve the original enquiry as the canonical customer/contact/payment record.
- [ ] [TODO] Verify CRM reports do not double-count linked quote or payment values.
- [ ] [TODO] Verify admin-only access and source deletion protections.

### 3.5 Proposal Composer (Bundle 9)

- [ ] [TODO] Inspect existing proposal-composer implementation and isolate its unique changes.
- [ ] [TODO] Create a clean PR after Sales Pipeline and inbound conversion dependencies are released.
- [ ] [TODO] Generate customer-specific English proposals.
- [ ] [TODO] Generate customer-specific Nepali proposals.
- [ ] [TODO] Include scope, deliverables, exclusions and assumptions.
- [ ] [TODO] Include quoted amount and NPR currency where appropriate.
- [ ] [TODO] Disclose domain, hosting, third-party and other external costs before acceptance.
- [ ] [TODO] Include validity period, delivery expectations and payment terms.
- [ ] [TODO] Allow admin review and editing before sending.
- [ ] [TODO] Track draft, sent, accepted, declined and expired states where implemented.
- [ ] [TODO] Link accepted proposals to the corresponding opportunity.
- [ ] [TODO] Never treat proposals or accepted quotes as cash received.

### 3.6 Real-world customer acquisition and delivery

- [ ] [TODO] Define the first clear Boxont service offer and target customer.
- [ ] [TODO] Prepare honest service descriptions for website launch, business websites and website care.
- [ ] [TODO] Prepare professional English and Nepali outreach templates.
- [ ] [TODO] Manually review a small, relevant prospect list from legitimate public business information.
- [ ] [TODO] Qualify prospects before contacting them.
- [ ] [TODO] Record contact attempts, replies and follow-up dates in the CRM.
- [ ] [TODO] Respect do-not-contact requests and applicable communication rules.
- [ ] [TODO] Prepare custom proposals based on actual customer needs.
- [ ] [TODO] Record accepted work and payments only when confirmed.
- [ ] [TODO] Track delivery, completion and customer feedback.

**Revenue measurement rules**

- Enquiries are not sales.
- Quotes and proposals are not revenue.
- Accepted proposals are not cash received.
- Record cash only when payment has actually arrived.
- Record refunds distinctly.
- Report service revenue and sponsored-placement revenue separately.
- Report net collected cash as received cash less refunds.

**Acceptance criteria:** Boxont can process a real enquiry through qualification, proposal, accepted job, payment and delivery using the existing app and free tooling.

## PHASE 4 — Directory quality and Kathmandu coverage

**Priority: HIGH**

Historical audit baseline (not a verified current count): 52 businesses, 8 categories, 7 neighbourhoods, with 21 listings mapped. Re-audit before presenting these numbers as current.

- [ ] [TODO] Recount current published businesses, categories and neighbourhoods.
- [ ] [TODO] Measure map-coordinate coverage and validate each pin.
- [ ] [TODO] Identify duplicates, closed businesses and stale records.
- [ ] [TODO] Identify missing or unverified phone numbers, websites and hours.
- [ ] [TODO] Identify unsupported claims and correct their verification status.
- [ ] [TODO] Expand genuine coverage across underrepresented Kathmandu neighbourhoods.
- [ ] [TODO] Improve category balance.
- [ ] [TODO] Use traceable, legitimate sources for new listings.
- [ ] [TODO] Preserve original business names, addresses and contact details.
- [ ] [TODO] Record source and last-checked dates for important facts.
- [ ] [TODO] Establish freshness/re-verification rules.
- [ ] [TODO] Build an admin queue for corrections and stale-data review.
- [ ] [TODO] Make owner claiming and correction simple.
- [ ] [TODO] Do not publish uncertain data as fact.

**Acceptance criteria:** Published listings have defensible sources, honest verification states and accurate location information where coordinates are available.

## PHASE 5 — Discovery, UX, SEO and organic growth

**Priority: HIGH**

### Search and discovery

- [ ] [TODO] Audit search relevance and accuracy.
- [ ] [TODO] Test English and Nepali queries and common spelling variants.
- [ ] [TODO] Improve category/neighbourhood filtering.
- [ ] [TODO] Verify nearby discovery and map interaction.
- [ ] [TODO] Verify opening-status calculations, including overnight schedules and Kathmandu local time.
- [ ] [TODO] Improve empty results and useful alternatives.
- [ ] [TODO] Verify phone, WhatsApp, website and directions actions.
- [ ] [TODO] Improve mapped-listing coverage without inventing coordinates.

### SEO and structured discovery

- [ ] [TODO] Audit indexing and canonical URLs.
- [ ] [TODO] Verify sitemap and robots rules.
- [ ] [TODO] Validate LocalBusiness structured data.
- [ ] [TODO] Improve useful neighbourhood and category landing pages.
- [ ] [TODO] Avoid thin, duplicated or fabricated SEO pages.
- [ ] [TODO] Improve social preview metadata.
- [ ] [TODO] Use free search performance tools where available.
- [ ] [TODO] Measure organic traffic and useful discovery outcomes.

### User experience

- [ ] [TODO] Audit mobile experience on common Android devices and browsers.
- [ ] [TODO] Audit desktop layouts.
- [ ] [TODO] Improve loading speed and remove unnecessary client-side code.
- [ ] [TODO] Test accessibility and keyboard navigation.
- [ ] [TODO] Test English/Nepali switching across public and admin journeys.
- [ ] [TODO] Improve profile readability and prominent contact actions.
- [ ] [TODO] Test saved listings and nearby discovery.
- [ ] [TODO] Remove broken links, dead actions and confusing copy.

**Acceptance criteria:** A new visitor can find a relevant local business, understand what is known and unknown, and take a useful next step.

## PHASE 6 — Trust, privacy, administration and security

**Priority: HIGH**

- [x] [DONE] Bundle 3 security/operations hardening merged into main.
- [x] [DONE] Atomic public-form rate-limiting foundation.
- [x] [DONE] Administrator role-check hardening in Bundle 3.
- [ ] [TODO] Re-audit every public table, insert and update operation.
- [ ] [TODO] Re-audit every admin-only table and mutation.
- [ ] [TODO] Confirm anonymous/non-admin users cannot read CRM, financial records or internal notes.
- [ ] [TODO] Confirm only admins can perform administrative actions.
- [ ] [TODO] Review admin account security and recovery.
- [ ] [TODO] Test expired sessions and invalid recovery links.
- [ ] [TODO] Review availability of MFA using existing free capabilities.
- [ ] [TODO] Review Supabase Security Advisor warnings.
- [ ] [TODO] Review leaked-password protection configuration.
- [ ] [TODO] Review RLS performance and overlapping permissive policies.
- [ ] [TODO] Review unused indexes before changing anything.
- [ ] [TODO] Establish and test a backup/recovery process using existing included capabilities.
- [ ] [TODO] Review audit logging for sensitive administrator actions.
- [ ] [TODO] Remove personal data and sensitive details from analytics/logs.
- [ ] [TODO] Review privacy disclosures and data retention.

**Acceptance criteria:** Public users see only public information; customer and business-owner records remain private; important admin changes are appropriately protected and traceable.

## PHASE 7 — Analytics and business performance

**Priority: HIGH**

- [ ] [TODO] Audit existing analytics events and their data fields.
- [ ] [TODO] Confirm no unnecessary personal information is collected.
- [ ] [TODO] Distinguish listing opens from impressions.
- [ ] [TODO] Distinguish contact button taps from completed calls/messages.
- [ ] [TODO] Measure search usage and no-result queries safely.
- [ ] [TODO] Measure enquiry submissions.
- [ ] [TODO] Measure qualified opportunities.
- [ ] [TODO] Measure follow-up completion.
- [ ] [TODO] Measure proposals sent and outcomes.
- [ ] [TODO] Measure actual cash received and refunds.
- [ ] [TODO] Measure sponsored placement listing opens accurately.
- [ ] [TODO] Build an honest admin performance dashboard.
- [ ] [TODO] Add monthly conversion and revenue summaries.
- [ ] [TODO] Identify which services create real customer value and revenue.

### Core metrics

| Metric | Definition |
|---|---|
| Directory coverage | Quality and breadth of useful listings |
| Listing engagement | Actual listing page opens |
| Contact intent | Call/WhatsApp button taps |
| Service enquiries | People asking Boxont for help |
| Qualified opportunities | Enquiries worth pursuing |
| Proposals sent | Formal offers delivered |
| Win rate | Won opportunities divided by decided opportunities |
| Cash received | Actual customer payments received |
| Refunds | Money returned to customers |
| Net collected revenue | Cash received less refunds |

**Acceptance criteria:** The dashboard clearly distinguishes discovery, intent, leads, quotes, wins and real cash.

## PHASE 8 — Reliability and sustainable maintenance

**Priority: CONTINUOUS**

- [ ] [TODO] Keep dependencies maintained without unnecessary upgrades.
- [ ] [TODO] Review security advisories.
- [ ] [TODO] Maintain automated quality gates.
- [ ] [TODO] Keep Supabase and Drizzle migrations aligned.
- [ ] [TODO] Test database changes against disposable local PostgreSQL.
- [ ] [TODO] Never rewrite migrations already applied to production.
- [ ] [TODO] Keep secrets out of Git history and logs.
- [ ] [TODO] Monitor free-tier limits before release work.
- [ ] [TODO] Maintain a recovery path if hosting becomes unavailable.
- [ ] [TODO] Evaluate alternative hosting only for a concrete need and only after checking genuinely free options.
- [ ] [TODO] Document material architectural decisions.
- [ ] [TODO] Keep README and this plan aligned with the actual implementation.

---

## 6. Engineering quality gate

Run before merging an implementation:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

For every database change:

- [ ] Confirm Supabase and Drizzle SQL migration files are byte-identical.
- [ ] Confirm migration journal consistency.
- [ ] Run disposable PostgreSQL migration and security tests.
- [ ] Inspect RLS, grants, functions, triggers and constraints.
- [ ] Test anonymous, authenticated non-admin and admin access separately.
- [ ] Check migration order against production migration history.
- [ ] State clearly whether the migration has or has not been applied in production.

For every release:

- [ ] Identify exact commit to deploy.
- [ ] Confirm required environment values exist.
- [ ] Confirm build/deployment succeeds.
- [ ] Confirm production domain points to the intended deployment.
- [ ] Test the affected real production journey.
- [ ] Record deployment URL, commit SHA and test evidence.

**GitHub merge success, CI success, Vercel preview success and production release success are four different things. Record them separately.**

---

## 7. Budget and infrastructure policy

The project must remain at **$0 additional expenditure**.

Allowed: existing free GitHub/Vercel/Supabase allowances, open-source dependencies, local development/test environments, free documentation and research tools, manual quote/payment recording.

Not allowed without explicit approval: paid hosting upgrades, paid database upgrades, paid APIs, CRM SaaS, paid analytics, paid messaging/email services, paid AI APIs, new billable storage/compute, paid subscriptions, or hosted staging resources that incur charges.

**If a task cannot be completed without spending money, stop and ask in bold before proceeding.** Do not silently accept a charge or upgrade to bypass a free-tier limitation.

---

## 8. Definition of success

SEWA and Boxont are successful when:

1. SEWA is fast, useful, trustworthy and free to browse.
2. Kathmandu coverage is materially broader, accurate and maintained.
3. People can easily discover and contact local businesses.
4. Business owners understand the value of an accurate SEWA presence.
5. Boxont receives genuine, relevant service enquiries.
6. The CRM supports disciplined qualification and follow-up.
7. Boxont can prepare professional proposals and record accepted jobs.
8. Actual payments and refunds are tracked accurately.
9. Sponsored placements are transparent and correctly reported.
10. Revenue reporting never confuses enquiries, quotes, accepted jobs and cash.
11. The system stays within the $0 additional-spend rule.
12. Progress can be resumed from this file without relying on old chat messages.

---

## 9. Immediate next-task queue

Only one task may be marked [IN PROGRESS] at a time.

| Order | Task | Status |
|---:|---|---|
| 1 | Recheck Vercel quota and production state; deploy current approved main when free quota permits | BLOCKED at last check |
| 2 | Verify production admin password recovery end-to-end | TODO |
| 3 | Reconcile open PR #4 / Bundle 4 work | TODO |
| 4 | Reconcile Bundle 7 Sales Pipeline with current main | TODO |
| 5 | Test and release Sales Pipeline | TODO |
| 6 | Reconcile and release Bundle 8 inbound conversion | TODO |
| 7 | Isolate, review and release Bundle 9 Proposal Composer | TODO |
| 8 | Operate the Boxont enquiry-to-paid-job workflow | TODO |
| 9 | Re-audit directory coverage, accuracy and map data | TODO |
| 10 | Improve discovery, SEO, UX and organic growth | TODO |

### Current active task

**Task 1 — Production deployment recovery.**

Recheck live Vercel status and the free deployment quota. Deploy the latest approved `main` commit when the free quota allows. Do not pay to bypass the limit. Then verify the actual production bundle and admin password recovery flow.

---

## 10. Instruction for every future AI session

Before doing SEWA/Boxont work:

1. Read this file from the repository.
2. Verify the current state; do not assume old notes are still accurate.
3. Continue the highest-priority unfinished task.
4. Work on one task at a time.
5. Do not ask the owner to repeat information already recorded here.
6. Do not spend money or create billable resources.
7. Do not mark work complete without evidence.
8. Update this file before ending the session.

**This file takes priority over old chat messages, old plans, stale branches and outdated checklists.**

**Start with this file. Work from it. End by updating it.**
