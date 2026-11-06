# SEWA by Boxont — Master Plan & Living TODO

> **Single source of truth for SEWA/Boxont execution. Read the whole file before each work session and update it before ending. This file combines the repository plan, revenue-first strategy and the 1,000-task register.**
>
> **Last reviewed:** 6 November 2026  
>
> **Merged inputs:** existing repository `MASTER_TODO.md`, the revenue-first strategy and 1,000-point checklist, and the matching 1,000-row CSV task register. The CSV and checklist IDs, priorities and task descriptions were reconciled. This file is now the only project execution plan.
>
> **Repository:** `eboxont-code/neighbourhood-guidebook` (private)  
> **Production:** https://sewa.boxont.com  
> **Product:** SEWA  
> **Owner / commercial brand:** Boxont  
> **Primary market:** Kathmandu, Nepal  
> **Financial rule: $0 additional spend. Ask in bold before any action that could cost money.**

---

## 0. Mission and priorities

SEWA is a free, useful, neighbourhood-first directory for discovering real local businesses. Boxont is the commercial operator.

**North star:** qualified website-design enquiries that can realistically become paid Boxont projects.

**Main funnel:** useful listing or qualified prospect → relevant free website preview → one clear CTA → attributed enquiry → manual qualification → quote/proposal → won or lost → payment and delivery.

The directory supports this funnel by earning trust and helping people find local businesses. Directory size, traffic and feature count are not success by themselves.

**Commercial decisions**

- Website design is the primary commercial focus in this plan.
- Keep public SEWA directory browsing and standard listings free.
- Paid listings/sponsored placements are a later product. Research value first. Do not publish prices, promises or payment flows, or actively sell/activate new paid placements, without explicit owner approval and a clear decision gate. Existing Bundle 6 code must be audited, not assumed ready for commercial launch.
- Bookings remain deferred until there is proven demand, participating businesses and support capacity.
- A target of 1,000 listings is conditional. Do not pursue it as a vanity target. Expand where real search demand, user value and website-sales opportunities justify it.

### Priority order

1. Protect production and validate the existing lead-capture and attribution loop.
2. Operate the website-enquiry, qualification, sales pipeline, proposal and payment workflow.
3. Revalidate high-intent prospects and improve the free-preview-to-enquiry conversion path.
4. Improve listing quality, coverage, search and SEO where they help real users or the revenue funnel.
5. Maintain security, privacy, reliability, accessibility and the $0 spend rule.
6. Validate paid placements only after evidence and owner approval; keep bookings deferred.

### Execution windows from the revenue-first plan

**First 48 hours:** test preview → quote form → database → admin pipeline; verify source/business attribution; revalidate the 20-prospect list and each website status; review outreach drafts without sending; inspect the flow at 390px; confirm private admin access; establish baseline metrics.

**Days 3–14:** fix lost leads, broken CTAs, wrong attribution and notification defects; clarify the main CTA and next steps; improve qualification; remove stale/duplicate prospects; test one conversion change at a time.

**Days 7–30:** verify priority listings and sources; fill category/neighbourhood gaps based on real searches and business opportunity; improve search actions; do not add thin SEO pages or weak records.

**Days 15–60:** complete useful SEO metadata and structured data; explain verification and preview-vs-live status; check English/Nepali parity; run stale-data checks; choose new prospects using search and sales evidence.

**Days 30–90:** interview business owners about paid visibility; decide scope, pricing, refunds and payment rules only with owner approval; pilot paid placements only after evidence and approval; research bookings only; expand beyond Kathmandu only when the first market is repeatable.

### Public-site baseline and competitive context

The supplied plan reports a homepage snapshot of 52 Kathmandu places, 8 categories and 7 neighbourhoods, with claims that hours, phone numbers and websites are checked and sources shown. The earlier master audit also reported 21 mapped places. These are historical observations, not guaranteed current figures. Recheck live pages and the database before using them in public copy or decisions.

The supplied plan reports that a shared preview template, lead pipeline, source labels, claim capture, private admin, bilingual UI and a 20-business prospect CSV already exist. Treat these as **reported implemented; regression-test**, not as proof that they work in production. Do not rebuild them until an audit identifies a real gap.

The free-preview format is also used by other website-design providers. That shows the offer is understandable, not that demand or pricing is proven. Compete on useful previews, accurate business data, clear ownership, honest scope and reliable follow-through. Do not copy competitor prices or claims without evidence.

### Weekly measures

- Qualified website enquiries (north star)
- Listing views → preview clicks → preview views → CTA clicks → submitted enquiries
- Qualified-lead rate by source and business category
- Quote/proposal sent, won/lost and reasons
- Median time to first action on a lead
- Correct business and source attribution
- Valid, high-intent prospects after recheck
- Useful listings with current sources and trustworthy map data
- Zero-result searches that show a real supply gap
- Production defects and mobile review findings

Establish a baseline before choosing numerical targets. Do not invent targets or public performance claims.

---

## 1. Non-negotiable rules

- **$0 additional expenditure.** Use existing free allowances and open-source software. Never upgrade, subscribe, purchase an API, create billable infrastructure or accept a charge without asking for explicit approval first.
- Keep public SEWA directory discovery free.
- Never invent business details, addresses, coordinates, opening hours, reviews, ratings, prices, verification or performance results.
- Distinguish verified, source-checked, unknown and unverified information honestly.
- English and Nepali are first-class interface languages.
- Mobile usability, accessibility and performance are essential.
- Do not send unsolicited messages automatically or introduce bulk-spam outreach.
- Do not scrape private contact information.
- A lead, enquiry, quote or proposal is not revenue. Record revenue only when money is actually received; account for refunds.
- Sponsored placements must be clearly labelled and must never manipulate verification status or organic ranking.
- Keep customer contact details, payment information, internal notes and commercial records private.
- Never commit secrets, service-role keys, passwords, private deployment values or production credentials.
- Never deploy stale or unreviewed branches.
- Never apply production database migrations without checking their exact contents, dependencies and migration history.
- Never claim a task is complete without evidence.
- Do not repeat work already completed. Inspect the current repository and production state first.

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

## 3. Verified repository snapshot — 6 November 2026

### Repository baseline

- [x] [DONE] Private GitHub repository: `eboxont-code/neighbourhood-guidebook`.
- [x] [DONE] Production domain: `https://sewa.boxont.com`.
- [x] [DONE] README documents SEWA principles, architecture, local setup, database rules and deployment checklist.
- [x] [DONE] Quality scripts and the Supabase/Drizzle migration-parity rule are documented.
- [x] [DONE] Current branch and open-PR inventory refreshed on 6 November 2026; clean Bundle 7 replacement is PR #10.
- [x] [DONE] GitHub issue search returned no open repository issues; this master plan remains the execution tracker.
- [x] [DONE] The source CSV contains 1,000 task rows. The Markdown register omission of SW-0299 was found and restored below.

Latest verified application-code commit: `794b959b9056a9ec147414c39db4b6da6c0b79f1` (6 November 2026 UTC), message `Fixed language buttons and hint links`.

The latest `main` commit is documentation-only:
- `ee38ca0e978f0149ca10f5b2caadb33282729148` — records Bundle 7 reconciliation and the passing quality gate.
- Earlier documentation-only updates include `56c8a3f5798c98228c1fd8c8d1e436a816728101` (single active SEWA task) and `6f89bfa487ae36ed1ff97a2a8f1795123dae8716` (funnel and attribution audit).

### GitHub and CI

- Current `main`: `ee38ca0e978f0149ca10f5b2caadb33282729148`.
- GitHub Quality Gate run #337 passed on that exact commit.
- The latest application-code Quality Gate run #310 passed on `794b959b9056a9ec147414c39db4b6da6c0b79f1`.
- `main` branch protection is disabled and no required status checks are configured. Passing CI is verified, but GitHub does not enforce it as a merge requirement.

### Latest Vercel Production deployment

- Deployment: `dpl_Gou24q64tcmGASESDmvqbxzrWpP7`.
- State / target: `READY` / `production`.
- Git source: `main` at documentation commit `ee38ca0e978f0149ca10f5b2caadb33282729148`.
- Verified aliases include `sewa.boxont.com`.
- Vercel project plan: Hobby. No upgrade, paid resource or new service was created.

This confirms the current `main` revision is deployed and READY. It does not prove that public form submission, admin sign-in or password recovery work end to end.

### Known merged work

- [x] [DONE] Bundle 1 — project foundation, repository rules and quality gate.
- [x] [DONE] Bundle 2 — data integrity and opening-hours trust.
- [x] [DONE] Bundle 3 — security and operations hardening; merge commit `5569ca8254277479fd350ab623afbb786ab31349`.
- [x] [DONE] Bundle 5 — Boxont quote-to-cash revenue engine; merge commit `d5f104affdb29e7cd4a287b4a36e34cb86c3800b`.
- [x] [DONE] Bundle 6 — sponsored placement revenue channel; merge commit `74fe507db70a45a538dfec4bd3730a45d51e4ae2`.
- [x] [DONE] PR #9 — admin password recovery production redirect; merge commit `a625ff94c48b03aa268bfdf885ff0eb974f5c664`.

### Pull requests — refreshed 6 November 2026

| PR | Work | Verified state / branch relationship |
|---|---|---|
| #4 | Call and WhatsApp contact insights | Open draft; `sewa/bundle-04-revenue-lead-attribution` → `main` |
| #7 | Older Boxont prospecting and sales pipeline | Closed without merge; historical branch retained for ancestry only; no open PR now targets it |
| #8 | Convert inbound enquiries into sales opportunities | Open draft; rebased directly on canonical Bundle 7 PR #10; review diff contains only Bundle 8 changes |
| #10 | Reconciled Bundle 7 Sales Pipeline | Open draft; `sewa/bundle-07-reconciled-main-20261106`, synchronized with current `main`; no release merge |

PR references:
- #4: https://github.com/eboxont-code/neighbourhood-guidebook/pull/4
- #7: https://github.com/eboxont-code/neighbourhood-guidebook/pull/7
- #8: https://github.com/eboxont-code/neighbourhood-guidebook/pull/8
- #9 (merged): https://github.com/eboxont-code/neighbourhood-guidebook/pull/9
- #10 (clean Bundle 7 draft): https://github.com/eboxont-code/neighbourhood-guidebook/pull/10

### Branch audit

- PR #4 still needs a fresh code review before merge.
- PR #7 is closed unmerged; do not reopen or merge it.
- PR #8 now targets the canonical PR #10 branch; its diff contains only Bundle 8 schema, admin UI, types, translations and database checks.
- PR #10 is the canonical Bundle 7 replacement; its current-main documentation sync passed Quality Gate run #42218901255. It remains a draft and is not merged or deployed.
- The admin-audit-health and revenue-engine branches have no current PR; compare their unique diffs before any salvage or archive decision.
- The Proposal Composer branch exists without a PR; keep it isolated from the unmerged Bundle 7/8 work.
- Bundle 8 was rebased as a merge commit onto PR #10, preserving its original history as a second parent. No unique feature work was discarded; the old PR #7 branch remains historical.


## 4. Last known blocker — production deployment and admin recovery

> **Status note:** The deployment and password-recovery observations below were last recorded on 4 November 2026. They were not re-tested during this document merge. Recheck before treating them as current.

### Admin password recovery implementation

- [x] [DONE] Forgot Password flow added to admin sign-in.
- [x] [DONE] Reset emails explicitly redirect to `https://sewa.boxont.com/admin`.
- [x] [DONE] Supabase `PASSWORD_RECOVERY` event handling added.
- [x] [DONE] New-password and confirmation screen added.
- [x] [DONE] English and Nepali recovery copy added.
- [x] [DONE] Generic response avoids revealing whether an email address has an account.
- [x] [DONE] Email validation correction included in merged commit.
- [x] [DONE] Project owner confirmed Supabase Auth URL configuration was updated to include the production redirect.
- [x] [DONE] Current `main` is deployed to Vercel Production in READY state at commit `c6741670caaf036df1a94935831599fd16a6a3db`; the `sewa.boxont.com` alias is attached. End-to-end password recovery is still untested.
- [x] [DONE] Rechecked Vercel deployment status and current production alias on 5 November 2026; latest `main` deployment is READY. The previous 4 November quota failure is no longer blocking this latest deployment.
- [x] [DONE] Current approved `main` commit `c6741670caaf036df1a94935831599fd16a6a3db` is deployed to Production.
- [x] [DONE] Verified `sewa.boxont.com` is an alias on the READY Production deployment for current `main` commit `c6741670caaf036df1a94935831599fd16a6a3db`.
- [ ] [TODO] Inspect deployed assets to confirm the recovery code is actually present.
- [ ] [TODO] Trigger a real recovery email and confirm the link opens the production domain, not localhost.
- [ ] [TODO] Complete password reset and test a normal admin sign-in.
- [ ] [TODO] Test expired/invalid recovery links and session handling safely.

**Deployment note (5 November 2026):** The latest `main` deployment is READY in Production and carries the `sewa.boxont.com` alias. A 4 November attempt had failed because of Vercel's free daily deployment quota, but that old failure is superseded by the successful 5 November deployment. Do not upgrade or pay to bypass future limits.

**Acceptance criteria:** The production domain serves the latest approved main commit and the admin password reset succeeds end-to-end. Until then, this feature is merged but not live.

---

# 5. Execution roadmap

## PHASE 0 — Project control and safe release process

**Priority: CRITICAL**

- [x] [DONE] Establish this master plan as the intended single source of truth.
- [x] [DONE] Save this file in the repository root as `MASTER_TODO.md`; confirmed present on `main`.
- [ ] [REVIEW] Inventory of all 13 branches and 9 PR records is complete (5 Nov 2026); exact branch diff/ancestry review remains open.
- [ ] [REVIEW] PR-to-branch relationships for all open PRs are recorded above; identify and compare unique changes on branches without PRs.
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

- [x] [DONE] Recheck Vercel deployment status, quota and current production alias (5 Nov 2026); current `main` is READY in Production and `sewa.boxont.com` is attached.
- [x] [DONE] Deploy the latest approved `main` commit `c6741670caaf036df1a94935831599fd16a6a3db` using the existing Vercel allowance.
- [x] [DONE] Confirm production alias `sewa.boxont.com` and deployed commit SHA `c6741670caaf036df1a94935831599fd16a6a3db`.
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
- [x] [DONE] Inspect PR #7 Sales Pipeline changes and compare them with current `main`; found 24 commits ahead / 28 behind, with stale helper/type/UI integrations.
- [x] [DONE] Preserve unique changes and remove duplicated/outdated inherited work; retain newer inbound/proposal helpers already on `main`.
- [x] [DONE] Create clean current-main-based Sales Pipeline PR #10: https://github.com/eboxont-code/neighbourhood-guidebook/pull/10.
- [x] [DONE] Run all quality and database-contract tests on the clean branch; TypeScript, lint, unit/component tests, production build and disposable PostgreSQL security/migration checks all passed on code head `3fa170958aec02925718588b7322df36e31fc120` (run #323).
- [ ] [TODO] Merge Sales Pipeline only after owner review/approval; keep PR #10 draft and do not migrate production or deploy beforehand.
- [x] [DONE] Rebase PR #8 directly on PR #10 and verify its review diff contains only nine Bundle 8 files.
- [x] [DONE] Port Bundle 8's unique schema, UI, bilingual copy and database checks onto canonical Bundle 7; reuse mapping helpers/tests already present in the newer base.
- [ ] [IN PROGRESS] PostgreSQL migration/security CI passed; final unit/component CI is being rerun after correcting an over-escaped test regex.
- [ ] [TODO] Merge inbound conversion only after review and checks pass.
- [ ] [TODO] Inspect `sewa/bundle-09-proposal-composer`.
- [ ] [TODO] Isolate Proposal Composer changes from inherited Bundle 7/8 code.
- [ ] [TODO] Create a clean Proposal Composer PR based on current main after dependencies are merged.
- [ ] [TODO] Review old admin-audit and lead-attribution branches; salvage only genuinely needed changes.
- [ ] [TODO] Archive/delete obsolete branches only after verifying no unique work remains.

**Required dependency order:** Sales Pipeline → Inbound Enquiry Conversion → Proposal Composer.

**Do not merge diverged branches as-is.** Recompare against the latest main before every merge.

**Acceptance criteria:** Each retained feature has a small, understandable diff based on current main, passing CI and reviewed database changes.

## PHASE 3 — Run the Boxont website-sales funnel

**Priority: CRITICAL — MAIN COMMERCIAL OBJECTIVE**

The primary funnel is Sewa discovery/prospect → free preview → attributed enquiry → qualification → quote/proposal → accepted job → actual payment → delivery. The 1,000-point register below is the detailed task plan. Audit existing features before building replacements.

### 3.1 Service enquiry and quote-to-cash

- [x] [DONE] Custom-quote enquiry foundation.
- [x] [DONE] Admin quote/payment tracking foundation.
- [x] [DONE] Separate quoted value from cash received.
- [x] [DONE] Revenue summary foundation.
- [ ] [IN PROGRESS] Test full public enquiry → admin inbox → quote → payment journey using safe test data; verify persistence, source/business attribution, admin-only commercial fields and cleanup.
- [ ] [TODO] Confirm visitors can submit enquiries but cannot write commercial fields.
- [ ] [TODO] Confirm only authorised admins can record quotes and payments.
- [ ] [TODO] Verify totals against source records, including partial payments/refunds where supported.
- [ ] [TODO] Ensure every qualified enquiry has a clear next action and follow-up owner.
- [ ] [TODO] Establish practical lead response and follow-up procedures.
- [ ] [BLOCKED] Lead alert emails to the admin for new enquiries. Needs a free mail provider chosen and approved first.

### 3.2 Sponsored placements — conditional, not the current north star

- [x] [DONE] Sponsored campaign foundation.
- [x] [DONE] Neighbourhood-featured and category-featured placement types.
- [x] [DONE] Clear public Sponsored label.
- [x] [DONE] Manual quote, full-payment and refund recording safeguards.
- [x] [DONE] Campaign date-window and overlap protections.
- [ ] [TODO] Audit the existing Bundle 6 implementation and test its safeguards before considering a pilot.
- [ ] [BLOCKED] Do not publish pricing, actively sell, or activate new paid placements until the owner approves the offer, value, price, terms and launch gate. Waiting on Boxont for prices for the featured spot, the verified badge and packages; paid listings stay blocked until then.
- [ ] [TODO] Test a complete campaign from quote to paid activation only after approval.
- [ ] [TODO] Confirm quoted/unpaid/draft campaigns never appear publicly.
- [ ] [TODO] Confirm expired, cancelled and refunded campaigns are not shown.
- [ ] [TODO] Confirm organic ordering and verification status remain independent.
- [ ] [TODO] Report campaign listing opens accurately; do not mislabel them as impressions, leads or sales.
- [ ] [TODO] Prepare an owner-facing explanation of the optional promotion service.

### 3.3 Sales pipeline (Bundle 7)

- [x] [DONE] Reconcile Bundle 7 into a clean current-main-based draft PR #10; code and disposable-database CI passed. It is not merged, migrated to production or deployed.
- [ ] [TODO] Verify prospect stages and allowed transitions.
- [ ] [TODO] Verify follow-up dates, due-soon and overdue queues use Kathmandu time.
- [ ] [TODO] Verify activity history and contact timestamps.
- [ ] [TODO] Verify service interest and preferred contact channel.
- [x] [DONE] Unit-test English and Nepali outreach drafts; CI passed on PR #10.
- [ ] [TODO] Verify copy-to-clipboard and user-initiated phone/WhatsApp actions.
- [x] [DONE] Unit-test that won, lost and do-not-contact stages suppress outreach drafts; CI passed on PR #10.
- [x] [DONE] Verify the new prospect/activity tables enforce admin-only RLS in disposable PostgreSQL CI; CI passed on PR #10.
- [x] [DONE] Verify quote/cash bounds and the no-decrease cash trigger in disposable PostgreSQL CI; CI passed on PR #10. Production is unchanged.
- [ ] [TODO] Create a simple daily sales operating routine.

### 3.4 Incoming enquiries (Bundle 8)

- [ ] [REVIEW] Bundle 8 is reconciled on PR #8 with PR #10 as its base; final CI and owner review remain before release.
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
- [ ] [BLOCKED] 3 outreach drafts are prepared. Waiting on Boxont to send or bin each one; nothing is sent without his approval.
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

**Acceptance criteria:** Boxont can process a real website enquiry through qualification, proposal, accepted job, actual payment and delivery using the existing app and free tooling. Paid placements remain off the active sales path until separately approved.

## PHASE 4 — Directory quality and Kathmandu coverage

**Priority: HIGH**

Historical audit baseline (not a verified current count): 52 businesses, 8 categories, 7 neighbourhoods, with 21 listings mapped. Re-audit before presenting these numbers as current.

- [x] [DONE] Recount current published businesses, categories and neighbourhoods. 52 verified businesses as of 31 Oct 2026.
- [ ] [TODO] Re-measure map-coordinate coverage and validate each pin. The 21-of-52 figure is a historical baseline from 31 Oct 2026, not a verified current count. Target 95%+ mapped. Previously unmatched names must be rechecked against authoritative sources before any coordinate is added.
- [ ] [TODO] Identify duplicates, closed businesses and stale records.
- [ ] [TODO] Identify missing or unverified phone numbers, websites and hours.
- [ ] [TODO] Identify unsupported claims and correct their verification status.
- [ ] [TODO] Expand genuine coverage across underrepresented Kathmandu neighbourhoods.
- [ ] [TODO] Grow to 1,000 verified businesses (52 as of 31 Oct 2026) without lowering verification standards.
- [ ] [TODO] Improve category balance.
- [ ] [TODO] Use traceable, legitimate sources for new listings.
- [ ] [TODO] Preserve original business names, addresses and contact details.
- [x] [DONE] Record source and last-checked dates for important facts. Per-field sources for phone, hours, address and location, each with a last-checked date. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] Add missing last-checked dates for Annapurna and Hair n Shanti.
- [ ] [TODO] Establish freshness/re-verification rules. Admin freshness colours are live (Shipped by GuideBook bot, 26-31 Oct 2026); written re-verification rules still needed.
- [ ] [TODO] Build an admin queue for corrections and stale-data review.
- [x] [DONE] Make owner claiming and correction simple. Free Claim this listing flow with a claims table and admin Claims tab; Report outdated with correction types; /add-a-business with a business_submissions table and admin Submissions tab. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] Add category-specific fields to listings.
- [ ] [TODO] Add photos for the 15 no-website previews.
- [ ] [TODO] Do not publish uncertain data as fact.
- [x] [DONE] Verification badge on verified listings. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] New Barber branch linking. Shipped by GuideBook bot, 26-31 Oct 2026.

**Acceptance criteria:** Published listings have defensible sources, honest verification states and accurate location information where coordinates are available.

## PHASE 5 — Discovery, UX, SEO and organic growth

**Priority: HIGH**

### Search and discovery

- [ ] [TODO] Audit search relevance and accuracy.
- [x] [DONE] Test English and Nepali queries and common spelling variants. EN/NE synonym and typo-tolerant search shipped. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Improve category/neighbourhood filtering. Area search such as 'cafe thamel' plus Open Sat and Open Sun filters. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] Verify nearby discovery and map interaction. Near-me distances still to build.
- [ ] [TODO] Verify opening-status calculations, including overnight schedules and Kathmandu local time. Structured day-by-day hours with Open now and Closes soon shipped (Shipped by GuideBook bot, 26-31 Oct 2026); overnight and timezone checks still open.
- [ ] [TODO] Improve empty results and useful alternatives.
- [ ] [TODO] Verify phone, WhatsApp, website and directions actions.
- [x] [DONE] One-tap Call, Directions and Instagram buttons on listings. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] Improve mapped-listing coverage without inventing coordinates.

### SEO and structured discovery

- [ ] [TODO] Audit indexing and canonical URLs.
- [ ] [TODO] Verify sitemap and robots rules.
- [ ] [BLOCKED] Submit the sitemap in Google Search Console. Waiting on Boxont.
- [x] [DONE] Validate LocalBusiness structured data. LocalBusiness schema added. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Improve useful neighbourhood and category landing pages. Local pages /a/durbar-marg/salons and /a/lazimpat/spas added and listed in the sitemap. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] Add more area x category pages only where real listing data exists.
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
- [x] [DONE] Improve profile readability and prominent contact actions. Already implemented: readable profile sections and data-supported Call, Directions and Website actions near the profile heading. Verified at 390px in EN/NE on 5 Nov 2026: contact targets 94px wide and 57px high, no horizontal overflow.
- [ ] [TODO] Test saved listings and nearby discovery.
- [x] [DONE] Add helpful links on the empty Saved page. Already shipped: "Browse places" button plus links to the three most-used categories, EN/NE, 44px tap targets. Verified 5 Nov 2026.
- [ ] [TODO] Write a fuller About page.
- [ ] [TODO] Remove broken links, dead actions and confusing copy.
- [x] [DONE] Boxont logo favicon. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Homepage line showing the real business count. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Footer links added. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Contact page topic picker. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] /new renamed Recently verified. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Preview card shown once, under the call buttons, with the line 'Free to look. No payment or sign up needed.' Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [BLOCKED] Bookings. Deferred until later; see Workstream 24 launch gate.

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
- [ ] [TODO] Review audit logging for sensitive administrator actions. Admin audit history view still to build.
- [ ] [TODO] Remove personal data and sensitive details from analytics/logs.
- [ ] [TODO] Review privacy disclosures and data retention.
- [x] [DONE] Privacy line stating that location stays on the phone. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Public /how-we-verify page. Shipped by GuideBook bot, 26-31 Oct 2026.

**Acceptance criteria:** Public users see only public information; customer and business-owner records remain private; important admin changes are appropriately protected and traceable.

## PHASE 7 — Analytics and business performance

**Priority: HIGH**

- [ ] [TODO] Audit existing analytics events and their data fields.
- [ ] [TODO] Confirm no unnecessary personal information is collected.
- [ ] [TODO] Distinguish listing opens from impressions.
- [ ] [TODO] Distinguish contact button taps from completed calls/messages.
- [x] [DONE] Measure search usage and no-result queries safely. Admin Insights tab shows searches, including zero-result ones, and action taps, backed by an analytics table. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] Measure enquiry submissions. Funnel tracking from listing to preview to enquiry. Shipped by GuideBook bot, 26-31 Oct 2026.
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
| Qualified website enquiries | Enquiries meeting observable fit and contactability criteria; the north star |
| Preview funnel | Listing → preview → CTA → submitted enquiry, with source attribution |
| Directory coverage | Quality and breadth of useful listings that serve real users |
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
- [ ] [BLOCKED] Daily GuideBook bot runs failing since 1 Nov 2026 because the account has no Grok Bot usage left. Waiting on Boxont.
- [ ] [BLOCKED] Move to new GitHub, Vercel, Supabase and Sentry accounts. Waiting on Boxont's own yes or no.
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

- [ ] [TODO] Confirm Supabase and Drizzle SQL migration files are byte-identical.
- [ ] [TODO] Confirm migration journal consistency.
- [ ] [TODO] Run disposable PostgreSQL migration and security tests.
- [ ] [TODO] Inspect RLS, grants, functions, triggers and constraints.
- [ ] [TODO] Test anonymous, authenticated non-admin and admin access separately.
- [ ] [TODO] Check migration order against production migration history.
- [ ] [TODO] State clearly whether the migration has or has not been applied in production.

For every release:

- [ ] [TODO] Identify exact commit to deploy.
- [ ] [TODO] Confirm required environment values exist.
- [ ] [TODO] Confirm build/deployment succeeds.
- [ ] [TODO] Confirm production domain points to the intended deployment.
- [ ] [TODO] Test the affected real production journey.
- [ ] [TODO] Record deployment URL, commit SHA and test evidence.

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

1. SEWA is useful, accurate, trustworthy and free to browse.
2. The free-preview funnel produces qualified website enquiries for Boxont.
3. Every lead retains correct business and source attribution.
4. The CRM supports reliable qualification and follow-up.
5. Boxont can prepare clear proposals, win suitable work and deliver it.
6. Payments received and refunds are recorded accurately.
7. Directory quality, coverage and search improve where they serve real users or the funnel.
8. Paid placements are only piloted after evidence and explicit owner approval.
9. Bookings remain deferred until their launch gate is met.
10. Reporting never confuses traffic, clicks, leads, quotes, accepted jobs and cash.
11. The system stays within the $0 additional-spend rule.
12. Work can resume from this file without relying on old chat messages.

---

## 9. Immediate next-task queue

Only one task may be marked [IN PROGRESS] at a time. Validate existing work before building anything new. If an item is blocked, record the missing dependency and continue to the next independent task.

| Order | Task | Status |
|---:|---|---|
| 1 | Test the production preview → quote form → database → admin lead path end to end | REVIEW — previous safe checks verified the route, prefill, attribution and rollback-only database permissions; browser-driven JavaScript submission and signed-in admin UI remain unverified |
| 2 | Verify lead source, business, preview URL and campaign attribution across each form | DONE — source and listing attribution audited; UTM/referrer/campaign ID are not retained on lead records |
| 3 | Revalidate the existing 20-business prospect CSV and each website status | BLOCKED — original 20-business source CSV not found in the repository or Library; the separate 1,000-task CSV is not a substitute |
| 4 | Confirm production deployment and complete admin password recovery verification | BLOCKED — current deployment is READY, but the real recovery-email and signed-in admin journey require account/email access that is not available in this run |
| 5 | Review the 390px preview and quote form; capture real screenshots | DONE 6 Nov 2026 — EN/NE at 390×844 and 1280×1800 reviewed; screenshots captured; no horizontal overflow; 44px+ effective targets; labeled 16px inputs; 179 tests and preview build/typecheck passed. Presentation-only changes; no enquiries, schema changes, outreach, publishing or deployment. |
| 6 | Reconcile Bundle 7 Sales Pipeline against current `main` | REVIEW — clean draft PR #10 is synchronized with current `main`; prior exact code head passed CI; current sync CI must finish; owner review/approval is required before merge or release |
| 7 | Reconcile Bundle 8 after Bundle 7; preserve original enquiry/payment records | REVIEW — PR #8 is now based directly on canonical PR #10; nine-file Bundle 8 diff; PostgreSQL checks passed, final CI and owner review remain. |
| 8 | Isolate and review Proposal Composer after its dependencies | BLOCKED — depends on approved/released Bundle 7 and reconciled Bundle 8; do not merge or release the dependent feature chain |
| 9 | Use the funnel baseline to fix the largest conversion leak | BLOCKED — production currently has only 5 analytics events and 0 contact messages; there is not enough evidence to identify a reliable largest leak |
| 10 | Improve directory quality and coverage based on real user demand and lead value | BLOCKED — current demand/lead evidence is insufficient; do not expand or alter listing data without verified sources and a demonstrated gap |

### Task 1 verification notes — 6 November 2026

- Application-code baseline: `794b959b9056a9ec147414c39db4b6da6c0b79f1`. Current `main` is documentation-only commit `ee38ca0e978f0149ca10f5b2caadb33282729148`; the latest Vercel Production deployment is READY on that current `main` commit, with `sewa.boxont.com` attached.
- GitHub Quality Gate run #310 passed on the application-code baseline; run #337 passed on current `main`.
- Earlier checks confirmed the production homepage, `/for-businesses`, the `aavaran-durbar-marg` website preview and its preview-origin contact URL returned HTTP 200. The preview CTA carried the listing slug and business name; the contact page rendered both prefilled.
- A rollback-only SQL test exercised an anonymous insert and admin quote/payment updates, then rolled back. No test lead was retained. Anonymous users cannot read leads or update private quote/payment fields.
- Boundary: this was not a browser-driven JavaScript form submission and did not authenticate to the visible `/admin` UI. Keep Task 1 at REVIEW.

### Task 2 attribution audit — 6 November 2026

- Preview and For Businesses contact leads retain `page` and `source_listing_slug`; the admin can rebuild listing and preview links from the slug. Claim requests retain `listing_slug` in `business_claims`; corrections retain `listing_slug` in `correction_reports`.
- `contact_messages` has no UTM, campaign ID, landing/referrer route or explicit preview URL fields. `analytics_events` records event, listing slug, query, language and path, but no UTM/campaign fields. Sponsored clicks are counted by listing and placement/target key, not joined to a campaign or later enquiry.
- Keep UTM/referrer/campaign capture blocked pending an approved privacy-safe approach. No schema or application changes were made during this audit.

### Task 6 reconciliation review — 6 November 2026

**Status: REVIEW — code reconciliation is complete; release approval remains outstanding.**

- Draft PR #10: https://github.com/eboxont-code/neighbourhood-guidebook/pull/10.
- Branch: `sewa/bundle-07-reconciled-main-20261106`. It now includes current `main` at `ee38ca0e978f0149ca10f5b2caadb33282729148` as a merge parent; no rebase or force-push was used.
- The Bundle 7 code delta preserves `main`'s newer inbound-lead mapping and proposal-draft helpers. Supabase and Drizzle migration files are byte-identical; the disposable CI suite covers all 14 migrations, RLS, admin/non-admin access, activity history and cash integrity.
- GitHub Quality Gate run #332 passed on the previous exact code head `a6deac36ba512f61604a09bbb41b2fed5c5efa86`: TypeScript, lint, unit/component tests, production build and disposable PostgreSQL checks. The current-main sync adds documentation only; wait for its new CI run before treating the updated branch as revalidated.
- No merge to `main`, production migration, production-data change, production setting change or production deployment was performed. Keep PR #10 draft until owner review/approval.


### Task 7 reconciliation — 6 November 2026

**Status: REVIEW — Bundle 8 is now stacked directly on the canonical Bundle 7 PR #10 branch.**

- PR #8 remains a draft and targets `sewa/bundle-07-reconciled-main-20261106`.
- Reconciliation is based on latest PR #10 head `49367a038f2ae53a727fdc18cb07a040d98e8a44`; the original Bundle 8 history is preserved as a second parent.
- The Bundle 8 review diff is limited to its own migration, migration journal, database verification, admin UI, generated types, translations and contract test. Bundle 7 files are not duplicated in the PR diff.
- The original Bundle 8 history is retained as a second parent. The original contact message remains the canonical customer, quote and payment record; the new prospect stores a unique relationship only.
- Disposable PostgreSQL migration/security checks passed. TypeScript and lint passed; the corrected unit/component suite is being rerun.
- No merge, production migration, production-data change, settings change, outreach or deployment was made. Keep PRs #8 and #10 draft pending owner review.

### Production database and project verification — 6 November 2026

- Vercel Production `VITE_SUPABASE_URL` and `SUPABASE_URL` both point to `https://zvbavpcsyvibvpkxjzkn.supabase.co`. This matches the active, healthy Supabase project `zvbavpcsyvibvpkxjzkn`.
- Local `supabase/config.toml` still names project `hbsszybjdyrdbgbvvmht`. This is a local CLI project-ref mismatch. Do not run Supabase CLI migration commands using the local default until the file is reconciled.
- Production has 8 recorded migrations. Names match the repository's current migration purposes, but the last three remote versions (`20261104111910`, `20261104111922`, `20261104111936`) differ from the corresponding local filenames (`20261102130000`, `20261103114000`, `20261104100000`). This is migration-history drift. Do not run `db push`, repair history or apply the Bundle 7 migration until a reviewed repair plan is approved.
- Public table counts: `listings` 52; `analytics_events` 5; `form_rate_log` 3; `user_roles` 1; `contact_messages`, `correction_reports`, `slug_redirects`, `business_submissions`, `business_claims` and `listing_promotions` 0. All returned public tables have RLS enabled.
- Bundle 7 tables `business_sales_prospects` and `business_sales_activities` are absent from Production. PR #10's migration has not been applied.
- This audit read project metadata, migration metadata and aggregate table counts only. No customer rows were read or changed; no production write or migration was executed.

### P0 register progress — 6 November 2026

- SW-0001 DONE: the north star is one sentence — qualified website-design enquiries that can realistically become paid Boxont projects.
- SW-0002 DONE: qualify only after manual review confirms an identifiable active business (business name or source listing), a valid reply route, and an explicit website need that fits the service. A missing website alone is not enough. Budget band and assumed willingness to pay are not qualification gates.
- SW-0003 DONE: the primary conversion is a successfully saved website enquiry with identifiable business context retained in `business_name` or `source_listing_slug`; a CTA click alone is not a conversion.
- SW-0004 DONE: secondary conversions are preview views, preview CTA clicks, claim starts/submissions and successful website-enquiry submissions. Repeat visits are a future aggregate measure only; do not add persistent visitor IDs or cookies.
- SW-0005 DONE: report website-design revenue separately from any future listing-subscription revenue and any future booking revenue.
- SW-0006 DONE: directory traffic alone is not success unless it produces useful consumer or business-owner outcomes.
- SW-0007 DONE: 1,000 listings remains a conditional supply milestone, not the north-star KPI.
- SW-0008 DONE: use a 14-day initial funnel observation window only after the production journey and tracking are verified; review evidence before another redesign and do not invent numerical targets.

### Analytics register audit — 6 November 2026

- SW-0041 DONE: first-party analytics are already installed. `src/lib/track.ts` writes anonymous event counts to the existing Supabase `analytics_events` table; `src/components/admin-insights.tsx` reads them. No additional analytics product is needed.
- SW-0042 REVIEW: preview views are tracked by a slug-keyed effect; form submissions are tracked only after successful database inserts and submit buttons are disabled while sending. A browser-driven duplicate-submit and route-transition test has not been run, so this remains REVIEW.
- SW-0043 BLOCKED: unique visitors and landing-page pageviews are not measured. The current tracker deliberately uses no visitor ID or cookie; a privacy-approved measurement approach is missing.
- SW-0044 BLOCKED: referrer, UTM and campaign fields are not retained. Adding them needs an approved privacy-safe data-collection decision.
- SW-0045 IN PROGRESS: listing pages have click tracking but no separate listing-view event; preview pages already have `preview_view`. Add a first-party anonymous `listing_view` event using only the listing slug, with tests and CI. No new provider, personal identifiers, paid service or production write.

### Current task

**Task SW-0045 — Record visits to listing pages separately from website-preview pages.**  
**Status: IN PROGRESS — one task only.**

Audit is complete: `src/lib/track.ts` already provides first-party anonymous event insertion, and `src/routes/s.$slug_.website-preview.tsx` tracks `preview_view`. The listing route `src/routes/s.$slug.tsx` tracks clicks but not listing views.

Acceptance criteria:
1. Add `listing_view` to the existing event allowlist and track one listing-page entry with the listing slug only.
2. Do not collect names, contact details, precise location, cookies or persistent visitor IDs.
3. Add or update focused tests for the event name and payload.
4. Run the relevant test suite, TypeScript, lint and production build through CI.
5. Keep the change on a separate feature branch; do not merge or deploy Production without owner approval.

---

## 10. Instruction for every future AI session

Before doing SEWA/Boxont work:

1. Read this entire file, including the 1,000-task register.
2. Verify current GitHub, production, database and feature state; old notes are snapshots only.
3. Continue the highest-priority unfinished task and mark only one task [IN PROGRESS].
4. Audit the existing implementation before creating replacement features.
5. Follow the revenue-first funnel; do not chase listing counts or features without evidence.
6. Do not send outreach, publish pricing or launch paid placements without explicit owner approval.
7. Do not spend money or create billable resources.
8. Do not mark work complete without evidence.
9. Update this file before ending the session.

**This file takes priority over old chat messages, old plans, stale branches and separate task copies.**

**Start with this file. Work from it. End by updating it.**

---

### Register reconciliation

The source CSV contains 1,000 data rows. The Markdown register initially contained 999 task entries and omitted `SW-0299`. Restored `SW-0299` verbatim from source CSV row 298; the Markdown register now contains exactly one entry for every ID from `SW-0001` through `SW-1000`. The CSV's dependency and evidence/notes columns are blank, so no missing values have been invented. The owner field is `Boxont/Sewa operator` for all rows.

The CSV is retained as the source for the original task descriptions. This Markdown checklist is the single execution register; task status is tracked here. Keep task IDs stable when updating progress.

## 11. The 1,000-point checklist

**Use:** Work top-down by phase and priority. Validate the current implementation before making changes. The shared “definition of done” for each workstream is shown below its heading; task status is tracked in the CSV.

### Workstream 01: Commercial strategy and operating rules (items 0001-0040)

**Phase:** 1 - Revenue foundation  
**Definition of done:** One page defines the revenue goal, what the site sells, what is deliberately deferred, and the rules that prevent trust or outreach mistakes.

- [x] [DONE] **SW-0001 · P0 · Audit current state** — Write a one-sentence north-star goal: generate qualified website-design opportunities for Boxont from Sewa.
- [x] [DONE] **SW-0002 · P0 · Audit current state** — Define a qualified website lead using observable criteria, not assumptions about willingness to pay.
- [x] [DONE] **SW-0003 · P0 · Audit current state** — Define the primary conversion as a completed website enquiry with identifiable business context.
- [x] [DONE] **SW-0004 · P0 · Audit current state** — Define secondary conversions for preview views, preview CTA clicks, claim requests, contact-form sends, and repeat visits.
- [x] [DONE] **SW-0005 · P0 · Audit current state** — Separate website-design revenue metrics from future listing-subscription and booking revenue metrics.
- [x] [DONE] **SW-0006 · P0 · Audit current state** — Record that directory traffic alone is not success unless it creates useful customer or business-owner outcomes.
- [x] [DONE] **SW-0007 · P0 · Audit current state** — Record that 1,000 listings is a conditional supply milestone, not the north-star KPI.
- [x] [DONE] **SW-0008 · P0 · Audit current state** — Set an initial decision window for evaluating the current funnel before redesigning it again.
- [ ] [TODO] **SW-0009 · P1 · Audit current state** — Create a decision log for changes that affect the business model or brand position.
- [ ] [TODO] **SW-0010 · P1 · Audit current state** — Record the original three phases: trust foundation, lead-generation funnel, then bookings after traction.
- [ ] [TODO] **SW-0011 · P1 · Audit current state** — Keep the current money-first strategy while using data quality as a conversion enabler.
- [ ] [TODO] **SW-0012 · P1 · Audit current state** — Define what qualifies as a high-value listing for the sales funnel: no site, broken site, or clearly weak site.
- [ ] [TODO] **SW-0013 · P1 · Audit current state** — Keep existing free directory inclusion separate from any future paid placement offer.
- [ ] [TODO] **SW-0014 · P1 · Audit current state** — Keep bookings explicitly deferred until the booking launch gate is met.
- [ ] [TODO] **SW-0015 · P1 · Audit current state** — Record that no price may be published without the owner's approval.
- [ ] [TODO] **SW-0016 · P1 · Audit current state** — Record that no outreach message may be sent without the owner's explicit approval.
- [ ] [TODO] **SW-0017 · P1 · Audit current state** — Record that the owner's personal phone number must not be published on Sewa.
- [ ] [TODO] **SW-0018 · P1 · Audit current state** — Record that the public contact form is the only public route for contacting the operator unless the owner changes that rule.
- [ ] [TODO] **SW-0019 · P1 · Audit current state** — Set the language standard: natural human English and Nepali, with no em dashes.
- [ ] [TODO] **SW-0020 · P1 · Audit current state** — Set the interface rule that a button or repeated CTA appears once per context unless testing proves otherwise.
- [ ] [TODO] **SW-0021 · P1 · Audit current state** — Set the mobile-first review width to approximately 390 CSS pixels.
- [ ] [TODO] **SW-0022 · P1 · Audit current state** — Require the reviewer to inspect actual phone-width screenshots before calling a design change complete.
- [ ] [TODO] **SW-0023 · P1 · Audit current state** — Keep Lovable prompts long, goal-led, and acceptance-criteria-driven when the connector is used for design-heavy work.
- [ ] [TODO] **SW-0024 · P1 · Audit current state** — Use the connected Lovable project only when the correct project can be positively identified; do not guess or edit a different project.
- [ ] [TODO] **SW-0025 · P1 · Audit current state** — Use GitHub/Vercel workflow for code changes when that is the established production path; confirm repository and deployment target first.
- [ ] [TODO] **SW-0026 · P2 · Audit current state** — Keep Supabase ownership and access independent from a builder-specific database where already configured.
- [ ] [TODO] **SW-0027 · P2 · Audit current state** — Use Picsart only when ordinary CSS, SVG, or existing assets cannot meet the need.
- [ ] [TODO] **SW-0028 · P2 · Audit current state** — Use the connected Lovable tools instead of logging in through a browser for Lovable work.
- [ ] [TODO] **SW-0029 · P2 · Audit current state** — Spend same-day Lovable credits on a deliberate, reviewed batch rather than low-value cosmetic edits.
- [ ] [TODO] **SW-0030 · P2 · Audit current state** — Report meaningful changes directly to the owner, not through an unrelated intermediary.
- [ ] [TODO] **SW-0031 · P2 · Audit current state** — Keep status reports concise and mention only verified changes, blockers, and decisions needed.
- [ ] [TODO] **SW-0032 · P2 · Audit current state** — Never invent businesses, prices, performance statistics, customer quotes, or verification results.
- [ ] [TODO] **SW-0033 · P2 · Audit current state** — Label user-supplied claims separately from independently checked production facts.
- [ ] [TODO] **SW-0034 · P2 · Audit current state** — Create a glossary for directory listing, website preview, claim request, website lead, paid listing, and booking.
- [ ] [TODO] **SW-0035 · P2 · Audit current state** — Choose a canonical public naming hierarchy for Boxont and Sewa and apply it consistently.
- [ ] [TODO] **SW-0036 · P2 · Audit current state** — Keep Boxont as the commercial operator/service brand and Sewa as the discovery experience if that remains the owner's intended brand structure.
- [ ] [TODO] **SW-0037 · P2 · Audit current state** — Write a brief explanation of why the site exists: useful local data that also creates a respectful route to website work.
- [ ] [TODO] **SW-0038 · P2 · Audit current state** — Define the line between helping a business owner and implying that a generated preview is their live official website.
- [ ] [TODO] **SW-0039 · P2 · Audit current state** — Set a rule that preview pages must clearly say they are previews until the owner approves launch.
- [ ] [TODO] **SW-0040 · P2 · Audit current state** — Review the strategy whenever evidence contradicts the funnel assumptions rather than expanding features by habit.

### Workstream 02: Measurement, analytics, and decision dashboard (items 0041-0080)

**Phase:** 1 - Revenue foundation  
**Definition of done:** The owner can answer where qualified leads came from, which page generated them, and which funnel step leaks.

- [x] [DONE] **SW-0041 · P0 · Audit current state** — Check whether production analytics are already installed before adding another analytics product.
- [ ] [REVIEW] **SW-0042 · P0 · Audit current state** — Verify that analytics events are not double-fired during route changes or form submissions.
- [ ] [BLOCKED] **SW-0043 · P0 · Audit current state** — Record weekly unique visitors and pageviews by landing page.
- [ ] [BLOCKED] **SW-0044 · P0 · Audit current state** — Record organic-search visits separately from direct, referral, and campaign visits where data supports it.
- [ ] [IN PROGRESS] **SW-0045 · P0 · Audit current state** — Record visits to listing pages separately from website-preview pages.
- [ ] [TODO] **SW-0046 · P0 · Audit current state** — Track clicks on each listing's website-preview link with a stable event name.
- [ ] [TODO] **SW-0047 · P0 · Audit current state** — Track preview-page views with the business slug as a non-personal content identifier.
- [ ] [TODO] **SW-0048 · P0 · Audit current state** — Track the primary preview CTA click without sending personal form data to analytics.
- [ ] [TODO] **SW-0049 · P0 · Audit current state** — Track website-enquiry form starts and successful submissions as separate events.
- [ ] [TODO] **SW-0050 · P0 · Audit current state** — Track claim-flow starts and completed claim submissions separately.
- [ ] [TODO] **SW-0051 · P1 · Audit current state** — Track For Businesses page views and CTA clicks.
- [ ] [TODO] **SW-0052 · P1 · Audit current state** — Track contact-form starts and successful submissions.
- [ ] [TODO] **SW-0053 · P1 · Audit current state** — Track click-to-call events only where the user clicks a listed business's public number.
- [ ] [TODO] **SW-0054 · P1 · Audit current state** — Track outbound website clicks from business listings.
- [ ] [TODO] **SW-0055 · P1 · Audit current state** — Track map/directions clicks from listing pages.
- [ ] [TODO] **SW-0056 · P1 · Audit current state** — Track save-place actions and whether a saved-place feature is used again in the same session.
- [ ] [TODO] **SW-0057 · P1 · Audit current state** — Track search submissions and search result counts without storing precise personal location.
- [ ] [TODO] **SW-0058 · P1 · Audit current state** — Track zero-result searches with a privacy-reviewed event schema.
- [ ] [TODO] **SW-0059 · P1 · Audit current state** — Track language-switch usage to see whether Nepali content is being used.
- [ ] [TODO] **SW-0060 · P1 · Audit current state** — Track visits from each unique campaign link using UTMs.
- [ ] [TODO] **SW-0061 · P1 · Audit current state** — Track each lead's landing route and referring page in the lead record.
- [ ] [REVIEW] **SW-0062 · P1 · Audit current state** — Preserve the preview-to-lead source mapping through redirects and form validation errors. Current code retains `page=preview` and the listing slug from the preview CTA; browser submission and validation-error continuity still need an end-to-end check.
- [ ] [TODO] **SW-0063 · P2 · Audit current state** — Create a funnel report from preview viewed to CTA clicked to enquiry submitted.
- [ ] [TODO] **SW-0064 · P2 · Audit current state** — Create a separate report from listing viewed to preview clicked to enquiry submitted.
- [ ] [TODO] **SW-0065 · P2 · Audit current state** — Report lead counts by source: preview, claim, For Businesses, listing, and contact.
- [ ] [TODO] **SW-0066 · P2 · Audit current state** — Report lead stage counts and age in stage from the admin pipeline.
- [ ] [TODO] **SW-0067 · P2 · Audit current state** — Calculate enquiry conversion rate per preview, not only total form submissions.
- [ ] [TODO] **SW-0068 · P2 · Audit current state** — Calculate the share of leads that include a usable business name and valid reply method.
- [ ] [TODO] **SW-0069 · P2 · Audit current state** — Calculate qualified-lead rate after manual qualification rather than treating every form as sales-ready.
- [ ] [TODO] **SW-0070 · P2 · Audit current state** — Calculate quote-sent, won, and lost rates once actual outcomes exist.
- [ ] [TODO] **SW-0071 · P2 · Audit current state** — Track median time from lead creation to first owner action.
- [ ] [TODO] **SW-0072 · P2 · Audit current state** — Set a weekly dashboard review that results in one written decision, not just observations.
- [ ] [TODO] **SW-0073 · P2 · Audit current state** — Keep a baseline snapshot before changing headline, CTA, form, or preview layout.
- [ ] [TODO] **SW-0074 · P2 · Audit current state** — Compare changes using the same event definitions and comparable date windows.
- [ ] [TODO] **SW-0075 · P2 · Audit current state** — Do not publish analytics figures as public marketing claims unless verified and approved.
- [ ] [TODO] **SW-0076 · P2 · Audit current state** — Check whether the current admin has metrics useful for sales before adding another dashboard.
- [ ] [TODO] **SW-0077 · P2 · Audit current state** — Create a short list of the top three funnel bottlenecks each week based on observed data.
- [ ] [TODO] **SW-0078 · P2 · Audit current state** — Add data-retention limits and consent/privacy review to analytics configuration.
- [ ] [TODO] **SW-0079 · P2 · Audit current state** — Export an owner-readable monthly funnel summary without exposing unnecessary contact details.
- [ ] [TODO] **SW-0080 · P2 · Audit current state** — Document how to disable or replace analytics if it creates privacy, performance, or cost problems.

### Workstream 03: Lead capture, forms, and attribution (items 0081-0120)

**Phase:** 1 - Revenue foundation  
**Definition of done:** Every enquiry reaches the database, retains its business/source context, and has a usable next action.

- [ ] [REVIEW] **SW-0081 · P0 · Forms reported saving to database; regression-test** — Submit a production test lead through the website-preview quote form.
- [ ] [REVIEW] **SW-0082 · P0 · Forms reported saving to database; regression-test** — Submit a production test lead through the For Businesses route.
- [ ] [REVIEW] **SW-0083 · P0 · Forms reported saving to database; regression-test** — Submit a production test lead through a listing claim action.
- [ ] [REVIEW] **SW-0084 · P0 · Forms reported saving to database; regression-test** — Submit a production test lead through the general contact form.
- [ ] [TODO] **SW-0085 · P0 · Audit current state** — Verify each form creates exactly one database lead for one successful submission.
- [ ] [TODO] **SW-0086 · P0 · Audit current state** — Verify the user receives a clear success state after a saved submission.
- [ ] [TODO] **SW-0087 · P0 · Audit current state** — Verify a failed submission shows a useful retry message without losing typed values.
- [ ] [TODO] **SW-0088 · P0 · Audit current state** — Verify form validation explains which required field needs attention.
- [ ] [TODO] **SW-0089 · P0 · Audit current state** — Verify the form works with keyboard-only interaction on desktop and mobile.
- [ ] [TODO] **SW-0090 · P0 · Audit current state** — Verify the form does not publish the owner's private phone number.
- [ ] [TODO] **SW-0091 · P0 · Audit current state** — Retain the source route and business slug when a lead comes from a preview.
- [ ] [TODO] **SW-0092 · P0 · Audit current state** — Retain the originating listing when a lead comes from a claim button.
- [ ] [TODO] **SW-0093 · P0 · Audit current state** — Retain the form intent when a lead comes from the For Businesses page.
- [ ] [TODO] **SW-0094 · P0 · Audit current state** — Set a default source only when the source genuinely cannot be identified.
- [ ] [TODO] **SW-0095 · P0 · Audit current state** — Store source metadata in structured columns rather than embedding it only in a message string.
- [ ] [TODO] **SW-0096 · P0 · Audit current state** — Capture business name as a separate field from the person's name.
- [ ] [TODO] **SW-0097 · P1 · Audit current state** — Capture a reply method that the user can reasonably respond to, without demanding excessive data.
- [ ] [TODO] **SW-0098 · P1 · Audit current state** — Make phone optional when email or another agreed reply method is sufficient.
- [ ] [TODO] **SW-0099 · P1 · Audit current state** — Avoid collecting home address, precise location, or unrelated personal information in sales forms.
- [ ] [TODO] **SW-0100 · P1 · Audit current state** — Add a human-readable privacy note beside form submission.
- [ ] [TODO] **SW-0101 · P1 · Audit current state** — Make the quote form explain what happens after submission.
- [ ] [TODO] **SW-0102 · P1 · Audit current state** — Set an honest response expectation only after the owner has approved a service standard.
- [ ] [TODO] **SW-0103 · P1 · Audit current state** — Check whether spam controls block real submissions on mobile networks.
- [ ] [TODO] **SW-0104 · P1 · Audit current state** — Check that the honeypot field is not exposed to screen readers as a normal requested field.
- [ ] [TODO] **SW-0105 · P1 · Audit current state** — Test duplicate-submit protection by tapping submit twice quickly.
- [ ] [TODO] **SW-0106 · P2 · Audit current state** — Rate-limit abusive form traffic without blocking ordinary users behind shared networks.
- [ ] [TODO] **SW-0107 · P2 · Audit current state** — Confirm anti-spam logs do not retain unnecessary identifying data.
- [ ] [TODO] **SW-0108 · P2 · Audit current state** — Check whether form notifications reach the intended private inbox or admin queue.
- [ ] [TODO] **SW-0109 · P2 · Audit current state** — Record notification failures in a way the operator can diagnose.
- [ ] [TODO] **SW-0110 · P2 · Audit current state** — Add a safe retry or reconciliation path for a saved lead whose notification failed.
- [ ] [TODO] **SW-0111 · P2 · Audit current state** — Verify that form submissions are not silently discarded when a third-party email service fails.
- [ ] [TODO] **SW-0112 · P2 · Audit current state** — Test Nepali characters and mixed-language business names end to end.
- [ ] [TODO] **SW-0113 · P2 · Audit current state** — Test punctuation, apostrophes, slashes, and long URLs in free-text fields.
- [ ] [TODO] **SW-0114 · P2 · Audit current state** — Protect against HTML/script injection in stored messages and rendered admin views.
- [ ] [TODO] **SW-0115 · P2 · Audit current state** — Ensure invalid external URLs are not blindly converted into clickable links in the admin.
- [ ] [TODO] **SW-0116 · P2 · Audit current state** — Add a clear route to return to the originating listing after a successful form submission.
- [ ] [TODO] **SW-0117 · P2 · Audit current state** — Keep form labels and buttons consistent across preview, claim, and contact flows.
- [ ] [TODO] **SW-0118 · P2 · Audit current state** — Confirm all forms use the intended production database, not a preview environment.
- [ ] [TODO] **SW-0119 · P2 · Audit current state** — Document a manual lead-recovery procedure for any reported missing enquiry.
- [ ] [TODO] **SW-0120 · P2 · Audit current state** — Verify each stored lead can be matched to its originating route in admin without relying on browser-local state.

### Workstream 04: Admin sales pipeline and follow-up operations (items 0121-0160)

**Phase:** 1 - Revenue foundation  
**Definition of done:** The existing lead pipeline is reliable enough to run daily sales without losing, duplicating, or forgetting opportunities.

- [ ] [REVIEW] **SW-0121 · P0 · Reported implemented; regression-test** — Verify the existing admin Leads tab is still accessible only to authorised users.
- [ ] [REVIEW] **SW-0122 · P0 · Reported implemented; regression-test** — Verify New, Contacted, Quote sent, Won, and Lost stages load and save correctly.
- [ ] [REVIEW] **SW-0123 · P0 · Reported implemented; regression-test** — Verify each stage count updates immediately after a lead changes stage.
- [ ] [REVIEW] **SW-0124 · P0 · Reported implemented; regression-test** — Verify a lead can be moved backward if an accidental stage change occurs.
- [ ] [REVIEW] **SW-0125 · P0 · Reported implemented; regression-test** — Verify the current business and preview links attached to a lead open the correct record.
- [ ] [REVIEW] **SW-0126 · P0 · Reported implemented; regression-test** — Verify Call and WhatsApp actions use only the submitted public/business contact details where appropriate.
- [ ] [REVIEW] **SW-0127 · P0 · Reported implemented; regression-test** — Verify private sales notes remain private and never appear on public routes.
- [ ] [TODO] **SW-0128 · P1 · Audit current state** — Add a lead-created timestamp visible in the admin.
- [ ] [TODO] **SW-0129 · P1 · Audit current state** — Add a last-updated timestamp to each lead.
- [ ] [TODO] **SW-0130 · P1 · Audit current state** — Show how long each lead has remained in its current stage.
- [ ] [TODO] **SW-0131 · P1 · Audit current state** — Add a filter for leads created today, this week, and this month.
- [ ] [TODO] **SW-0132 · P1 · Audit current state** — Add a filter for lead source.
- [ ] [TODO] **SW-0133 · P1 · Audit current state** — Add a filter for lead status.
- [ ] [TODO] **SW-0134 · P1 · Audit current state** — Add a filter for leads that have not had a first action.
- [ ] [TODO] **SW-0135 · P1 · Audit current state** — Add a filter for missing or invalid contact details.
- [ ] [TODO] **SW-0136 · P1 · Audit current state** — Add a filter for leads tied to a business with no website or a broken website.
- [ ] [TODO] **SW-0137 · P1 · Audit current state** — Allow a lead to be assigned to the owner or a future authorised team member.
- [ ] [TODO] **SW-0138 · P1 · Audit current state** — Keep assignment optional while the operation has one operator.
- [ ] [TODO] **SW-0139 · P1 · Audit current state** — Add a concise next-action field to each lead.
- [ ] [TODO] **SW-0140 · P1 · Audit current state** — Add a next-follow-up date only after the operator chooses one.
- [ ] [TODO] **SW-0141 · P2 · Audit current state** — Provide a way to mark that an owner explicitly decided not to pursue a lead.
- [ ] [TODO] **SW-0142 · P2 · Audit current state** — Capture a reason for Lost using a short controlled list plus optional notes.
- [ ] [TODO] **SW-0143 · P2 · Audit current state** — Distinguish no reply from not interested and from outside service scope.
- [ ] [TODO] **SW-0144 · P2 · Audit current state** — Distinguish a quote requested from a quote actually sent.
- [ ] [TODO] **SW-0145 · P2 · Audit current state** — Avoid auto-marking leads as Contacted based only on opening a record.
- [ ] [TODO] **SW-0146 · P2 · Audit current state** — Avoid sending automated emails or WhatsApp messages without an approved workflow.
- [ ] [TODO] **SW-0147 · P2 · Audit current state** — Add a duplicate-lead warning based on business, contact, and recent submission time.
- [ ] [TODO] **SW-0148 · P2 · Audit current state** — Allow merging duplicate leads without deleting the history of the surviving lead.
- [ ] [TODO] **SW-0149 · P2 · Audit current state** — Keep the original source attribution when duplicate records are merged.
- [ ] [TODO] **SW-0150 · P2 · Audit current state** — Make lead notes searchable without making private contact fields globally searchable.
- [ ] [TODO] **SW-0151 · P2 · Audit current state** — Add a one-click copy of the business name and preview URL for manual outreach preparation.
- [ ] [TODO] **SW-0152 · P2 · Audit current state** — Add a printable or exportable daily call list without unnecessary personal data.
- [ ] [TODO] **SW-0153 · P2 · Audit current state** — Ensure CSV exports escape formulas and spreadsheet-injection payloads.
- [ ] [TODO] **SW-0154 · P2 · Audit current state** — Test admin filters when a lead contains Nepali characters.
- [ ] [TODO] **SW-0155 · P2 · Audit current state** — Test the lead pipeline at phone width before adding more columns.
- [ ] [TODO] **SW-0156 · P2 · Audit current state** — Document the exact daily sales workflow in no more than one page.
- [ ] [TODO] **SW-0157 · P2 · Audit current state** — Create a backup/export path for lead data with restricted access.
- [ ] [TODO] **SW-0158 · P2 · Audit current state** — Set a retention rule for leads that are old, lost, or no longer needed.
- [ ] [TODO] **SW-0159 · P2 · Audit current state** — Use a regression checklist before modifying the pipeline UI.
- [ ] [TODO] **SW-0160 · P2 · Audit current state** — Do not rebuild existing pipeline functions unless the production audit finds a defect.

### Workstream 05: Shared website-preview product and conversion path (items 0161-0200)

**Phase:** 1 - Revenue foundation  
**Definition of done:** The current shared preview template gives each suitable business a credible concept, remains clearly a preview, and produces attributable enquiries.

- [ ] [REVIEW] **SW-0161 · P0 · Reported preview template exists; regression-test** — Regression-test the existing shared preview template against a business with no website.
- [ ] [REVIEW] **SW-0162 · P0 · Reported preview template exists; regression-test** — Regression-test the template against a business whose listed website is broken.
- [ ] [REVIEW] **SW-0163 · P0 · Reported preview template exists; regression-test** — Regression-test the template against a business with a working website to ensure it is not mislabelled.
- [ ] [TODO] **SW-0164 · P0 · Audit current state** — Verify preview routes use the expected business slug and fail safely for an unknown slug.
- [ ] [TODO] **SW-0165 · P0 · Audit current state** — Verify the preview displays the correct business name from the listing record.
- [ ] [TODO] **SW-0166 · P0 · Audit current state** — Verify the preview displays only hours that exist and are sufficiently trustworthy.
- [ ] [TODO] **SW-0167 · P0 · Audit current state** — Verify the preview never invents opening hours when the listing lacks them.
- [ ] [TODO] **SW-0168 · P0 · Audit current state** — Verify the preview uses the correct area and address fields without upgrading a vague area into an exact address.
- [ ] [TODO] **SW-0169 · P0 · Audit current state** — Verify the map/directions action appears only when a reliable location exists.
- [ ] [TODO] **SW-0170 · P0 · Audit current state** — Verify the phone action appears only when a verified public phone exists.
- [ ] [TODO] **SW-0171 · P0 · Audit current state** — Verify the website action is omitted or clearly unavailable when no working official website exists.
- [ ] [TODO] **SW-0172 · P0 · Audit current state** — Verify social links come from the correct business record and open safely.
- [ ] [TODO] **SW-0173 · P0 · Audit current state** — Verify service details appear only when provided or separately verified.
- [ ] [TODO] **SW-0174 · P0 · Audit current state** — Verify the shared template does not leak data between two business slugs.
- [ ] [TODO] **SW-0175 · P1 · Audit current state** — Verify category colour choices remain readable for every current category.
- [ ] [TODO] **SW-0176 · P1 · Audit current state** — Verify English and Nepali preview variants use the same underlying business facts.
- [ ] [TODO] **SW-0177 · P1 · Audit current state** — Check the template at 390px wide before checking larger breakpoints.
- [ ] [TODO] **SW-0178 · P1 · Audit current state** — Check a long business name and a long location name for wrapping or overflow.
- [ ] [TODO] **SW-0179 · P1 · Audit current state** — Check missing-logo and missing-photo states without placeholder claims that look real.
- [ ] [TODO] **SW-0180 · P1 · Audit current state** — Use only properly licensed, owner-provided, or clearly non-misleading imagery.
- [ ] [TODO] **SW-0181 · P1 · Audit current state** — Clarify above the fold that the page is a private website concept, not the owner's live site.
- [ ] [TODO] **SW-0182 · P1 · Audit current state** — Clarify that the owner has not yet approved or claimed the preview.
- [ ] [TODO] **SW-0183 · P1 · Audit current state** — Keep the existing preview route out of the sitemap and search indexing.
- [ ] [TODO] **SW-0184 · P1 · Audit current state** — Verify noindex controls work in the rendered HTML response, not only in client-side metadata.
- [ ] [TODO] **SW-0185 · P1 · Audit current state** — Verify preview URLs do not masquerade as the business's official domain.
- [ ] [TODO] **SW-0186 · P2 · Audit current state** — Make the main CTA label clear about requesting the preview to become a real website.
- [ ] [TODO] **SW-0187 · P2 · Audit current state** — Keep the primary conversion button visually distinct without duplicating it in every section.
- [ ] [TODO] **SW-0188 · P2 · Audit current state** — Place one concise explanation of what happens after the primary CTA.
- [ ] [TODO] **SW-0189 · P2 · Audit current state** — Pass the originating business slug into the quote form.
- [ ] [TODO] **SW-0190 · P2 · Audit current state** — Pass attribution through form validation and back-button navigation.
- [ ] [TODO] **SW-0191 · P2 · Audit current state** — Provide a safe state for a business that has been deleted or merged.
- [ ] [TODO] **SW-0192 · P2 · Audit current state** — Ensure preview metadata does not expose private operator or sales notes.
- [ ] [TODO] **SW-0193 · P2 · Audit current state** — Ensure preview content does not imply owner endorsement before consent.
- [ ] [TODO] **SW-0194 · P2 · Audit current state** — Test that a preview link shared by the operator works when opened on a different device.
- [ ] [TODO] **SW-0195 · P2 · Audit current state** — Add a preview version marker internally so significant template edits can be traced.
- [ ] [TODO] **SW-0196 · P2 · Audit current state** — Record a screenshot baseline for representative salon, restaurant, clinic, hotel, and gym previews.
- [ ] [TODO] **SW-0197 · P2 · Audit current state** — Compare preview engagement by category before changing the shared template.
- [ ] [TODO] **SW-0198 · P2 · Audit current state** — Use a controlled copy/design test rather than changing several conversion elements at once.
- [ ] [TODO] **SW-0199 · P2 · Audit current state** — Define when a preview should be retired after an owner declines or asks for removal.
- [ ] [TODO] **SW-0200 · P2 · Audit current state** — Keep the shared-template principle; do not manually build a separate preview for each listing.

### Workstream 06: Website-design offer, scope, pricing decisions, and fulfilment (items 0201-0240)

**Phase:** 1 - Revenue foundation  
**Definition of done:** The offer is understandable and deliverable, with prices and promises published only after the owner approves them.

- [ ] [TODO] **SW-0201 · P0 · Audit current state** — Write the single clearest sentence describing the website-design service for Kathmandu businesses.
- [ ] [TODO] **SW-0202 · P0 · Audit current state** — Define the ideal first customer segment based on need and deliverability rather than assumed budget.
- [ ] [TODO] **SW-0203 · P0 · Audit current state** — Explain the difference between the free directory listing and a paid website project.
- [ ] [TODO] **SW-0204 · P0 · Audit current state** — Explain the difference between a preview concept and a launched website.
- [ ] [TODO] **SW-0205 · P1 · Audit current state** — List the website deliverables that can reliably be provided today.
- [ ] [TODO] **SW-0206 · P1 · Audit current state** — List optional deliverables that require a separate quote.
- [ ] [TODO] **SW-0207 · P1 · Audit current state** — Define what a basic one-page website includes before taking payment.
- [ ] [TODO] **SW-0208 · P1 · Audit current state** — Define what is explicitly outside a one-page website scope.
- [ ] [TODO] **SW-0209 · P1 · Audit current state** — Document whether domain purchase is included, excluded, or passed through at cost after owner approval.
- [ ] [TODO] **SW-0210 · P1 · Audit current state** — Document the hosting approach and who controls the hosting account.
- [ ] [TODO] **SW-0211 · P1 · Audit current state** — Document how the customer owns or controls the domain after delivery.
- [ ] [TODO] **SW-0212 · P1 · Audit current state** — Document the process for transferring the site if the customer leaves.
- [ ] [TODO] **SW-0213 · P1 · Audit current state** — Document the number and type of revisions the service can sustainably include.
- [ ] [TODO] **SW-0214 · P1 · Audit current state** — Document what counts as a minor content edit versus a new build request.
- [ ] [TODO] **SW-0215 · P1 · Audit current state** — Document the process for receiving logos, photographs, service descriptions, and hours from an owner.
- [ ] [TODO] **SW-0216 · P1 · Audit current state** — Create an intake checklist that avoids asking owners to write all website copy themselves.
- [ ] [TODO] **SW-0217 · P1 · Audit current state** — Create a simple handover checklist for a delivered website.
- [ ] [TODO] **SW-0218 · P1 · Audit current state** — Define a realistic delivery-time promise only after measuring actual capacity.
- [ ] [TODO] **SW-0219 · P1 · Audit current state** — Define what support is included after launch and what is not.
- [ ] [TODO] **SW-0220 · P1 · Audit current state** — Create a plain-language scope-of-work template for an approved quote.
- [ ] [TODO] **SW-0221 · P2 · Audit current state** — Create a quote template with line items rather than invented default prices.
- [ ] [TODO] **SW-0222 · P2 · Audit current state** — Keep unpublished price placeholders out of all public pages and structured metadata.
- [ ] [TODO] **SW-0223 · P2 · Audit current state** — Create an owner decision card for price, recurring support, domain, and hosting terms.
- [ ] [TODO] **SW-0224 · P2 · Audit current state** — Compare one-time build fees with recurring care fees before recommending a model.
- [ ] [TODO] **SW-0225 · P2 · Audit current state** — Calculate internal delivery time for a one-page site using the current stack.
- [ ] [TODO] **SW-0226 · P2 · Audit current state** — Calculate estimated operating costs for hosting, domains, email, and third-party services.
- [ ] [TODO] **SW-0227 · P2 · Audit current state** — Set a minimum viable margin target with the owner's input before pricing goes live.
- [ ] [TODO] **SW-0228 · P2 · Audit current state** — Define when to decline a project that is out of scope or operationally risky.
- [ ] [TODO] **SW-0229 · P2 · Audit current state** — Create an honest explanation of what a website can and cannot guarantee for Google rankings.
- [ ] [TODO] **SW-0230 · P2 · Audit current state** — Create an honest explanation of how the directory listing relates to a customer's independent website.
- [ ] [TODO] **SW-0231 · P2 · Audit current state** — Define who approves the customer's final text, contact information, and branding before launch.
- [ ] [TODO] **SW-0232 · P2 · Audit current state** — Define an approval checkpoint before a preview is published as a live customer site.
- [ ] [TODO] **SW-0233 · P2 · Audit current state** — Record consent for any client logo, review, testimonial, or case study used in sales materials.
- [ ] [TODO] **SW-0234 · P2 · Audit current state** — Make customer account ownership and portability explicit in the eventual terms.
- [ ] [TODO] **SW-0235 · P2 · Audit current state** — Document the exact payment trigger and refund/cancellation policy before accepting payments.
- [ ] [TODO] **SW-0236 · P2 · Audit current state** — Decide whether future support is monthly, pay-as-needed, or a limited combination before publishing terms.
- [ ] [TODO] **SW-0237 · P2 · Audit current state** — Test the fulfilment workflow with one consenting pilot business before broad promotion.
- [ ] [TODO] **SW-0238 · P2 · Audit current state** — Record actual time-to-build and support burden from the pilot.
- [ ] [TODO] **SW-0239 · P2 · Audit current state** — Update the offer based on the pilot rather than assumptions about market demand.
- [ ] [TODO] **SW-0240 · P2 · Audit current state** — Publish prices only after the owner explicitly approves final figures and terms.

### Workstream 07: Prospect qualification and high-intent business list (items 0241-0280)

**Phase:** 1 - Revenue foundation  
**Definition of done:** Prospects are prioritised for website need, fit, contactability, and realistic value rather than collected as a vanity list.

- [ ] [REVIEW] **SW-0241 · P0 · Existing CSV reported; revalidate** — Revalidate the existing CSV of 20 businesses before using it as a current prospect list.
- [ ] [REVIEW] **SW-0242 · P0 · Existing CSV reported; revalidate** — Check each existing prospect still exists under the same business name.
- [ ] [TODO] **SW-0243 · P0 · Audit current state** — Recheck every prospect's website status before describing it as missing or broken.
- [ ] [TODO] **SW-0244 · P0 · Audit current state** — Record the exact evidence that a site is missing, broken, outdated, or unusable.
- [ ] [TODO] **SW-0245 · P0 · Audit current state** — Separate businesses with no website from businesses with a working site that merely looks dated.
- [ ] [TODO] **SW-0246 · P0 · Audit current state** — Prioritise technically broken sites over subjective claims that a design is ugly.
- [ ] [TODO] **SW-0247 · P0 · Audit current state** — Record a public contact route for each prospect only when it is visible on an appropriate public source.
- [ ] [TODO] **SW-0248 · P1 · Audit current state** — Keep the prospect's official website and social source URLs in separate columns.
- [ ] [TODO] **SW-0249 · P1 · Audit current state** — Record the date each prospect was reviewed.
- [ ] [TODO] **SW-0250 · P1 · Audit current state** — Record the reviewer or automated process that made the assessment.
- [ ] [TODO] **SW-0251 · P1 · Audit current state** — Check that two rows do not refer to the same business branch.
- [ ] [TODO] **SW-0252 · P1 · Audit current state** — Separate brand-level prospects from individual branch-level prospects.
- [ ] [TODO] **SW-0253 · P1 · Audit current state** — Create a deduplication key using normalized business name, area, website domain, and public phone.
- [ ] [TODO] **SW-0254 · P1 · Audit current state** — Assign each prospect a transparent qualification label with clear rules.
- [ ] [TODO] **SW-0255 · P1 · Audit current state** — Create a score based on website need, verifiable business identity, and service fit.
- [ ] [TODO] **SW-0256 · P1 · Audit current state** — Do not use demographic assumptions or sensitive personal characteristics in prospect scoring.
- [ ] [TODO] **SW-0257 · P1 · Audit current state** — Do not score a business as high value merely because it has no website.
- [ ] [TODO] **SW-0258 · P1 · Audit current state** — Flag a prospect when the correct owner/contact person is unknown.
- [ ] [TODO] **SW-0259 · P1 · Audit current state** — Flag businesses whose only available source is an unverified third-party directory.
- [ ] [TODO] **SW-0260 · P1 · Audit current state** — Exclude closed or apparently inactive businesses until their status is confirmed.
- [ ] [TODO] **SW-0261 · P1 · Audit current state** — Exclude businesses whose online presence is already strong unless a concrete problem is identified.
- [ ] [TODO] **SW-0262 · P1 · Audit current state** — Exclude businesses requiring regulated claims the service cannot safely substantiate.
- [ ] [TODO] **SW-0263 · P2 · Audit current state** — Record a practical reason why each business might benefit from a new site.
- [ ] [TODO] **SW-0264 · P2 · Audit current state** — Record the one website improvement the free preview should demonstrate for each prospect.
- [ ] [TODO] **SW-0265 · P2 · Audit current state** — Track whether a preview already exists to prevent duplicate work.
- [ ] [TODO] **SW-0266 · P2 · Audit current state** — Track whether the owner has claimed the listing or asked not to be contacted.
- [ ] [TODO] **SW-0267 · P2 · Audit current state** — Add a do-not-contact flag that is respected by all export and workflow views.
- [ ] [TODO] **SW-0268 · P2 · Audit current state** — Maintain a separate list of businesses who have opted out of future outreach.
- [ ] [TODO] **SW-0269 · P2 · Audit current state** — Create a small batch-review workflow before adding prospects to the active queue.
- [ ] [TODO] **SW-0270 · P2 · Audit current state** — Prioritise category and neighbourhood gaps where website prospects are also likely to be useful directory additions.
- [ ] [TODO] **SW-0271 · P2 · Audit current state** — Compare lead-list composition across categories to avoid collecting only salons by habit.
- [ ] [TODO] **SW-0272 · P2 · Audit current state** — Test a prospect batch for factual accuracy before scaling data collection.
- [ ] [TODO] **SW-0273 · P2 · Audit current state** — Track how many reviewed prospects become qualified leads, not just how many are collected.
- [ ] [TODO] **SW-0274 · P2 · Audit current state** — Track how many prospects have a preview prepared and how many leads come from it.
- [ ] [TODO] **SW-0275 · P2 · Audit current state** — Archive stale prospects rather than repeatedly recycling them as new opportunities.
- [ ] [TODO] **SW-0276 · P2 · Audit current state** — Define a recheck interval based on how quickly website status is likely to change.
- [ ] [TODO] **SW-0277 · P2 · Audit current state** — Keep only the public business data necessary to evaluate and manage the opportunity.
- [ ] [TODO] **SW-0278 · P2 · Audit current state** — Never send messages, emails, or WhatsApp outreach from this list without explicit owner approval.
- [ ] [TODO] **SW-0279 · P2 · Audit current state** — Set the next prospect target from observed conversion and capacity, not an arbitrary 1,000-business goal.
- [ ] [TODO] **SW-0280 · P2 · Audit current state** — Check source URLs still load and correspond to the specific branch before activating the prospect.

### Workstream 08: Outreach assets and owner-approved contact workflow (items 0281-0320)

**Phase:** 1 - Revenue foundation  
**Definition of done:** The owner can make informed, respectful outreach decisions from prepared assets without any message being sent automatically.

- [ ] [REVIEW] **SW-0281 · P1 · Prepared drafts reported; owner approval required** — Review the three outreach email drafts already prepared and mark each keep, edit, or discard.
- [ ] [TODO] **SW-0282 · P1 · Audit current state** — Prepare a short outreach message for a business with no official website.
- [ ] [TODO] **SW-0283 · P1 · Audit current state** — Prepare a separate message for a site that is demonstrably broken.
- [ ] [TODO] **SW-0284 · P1 · Audit current state** — Prepare a separate message for a site that works but has a specific, factual usability problem.
- [ ] [TODO] **SW-0285 · P1 · Audit current state** — Avoid claiming the existing website is bad without describing an observable issue.
- [ ] [TODO] **SW-0286 · P1 · Audit current state** — Introduce Sewa and Boxont clearly without implying a business has already agreed to anything.
- [ ] [TODO] **SW-0287 · P1 · Audit current state** — Explain that the preview is free and optional only if that offer remains approved.
- [ ] [TODO] **SW-0288 · P1 · Audit current state** — Make the opt-in next step explicit and low pressure.
- [ ] [TODO] **SW-0289 · P1 · Audit current state** — Keep every outreach draft editable before sending.
- [ ] [TODO] **SW-0290 · P1 · Audit current state** — Use the business's correct name and branch in each prepared message.
- [ ] [TODO] **SW-0291 · P1 · Audit current state** — Include the correct preview URL and test it before adding it to an email.
- [ ] [TODO] **SW-0292 · P1 · Audit current state** — Include a clear way to decline further messages when outreach is permitted.
- [ ] [TODO] **SW-0293 · P1 · Audit current state** — Do not send to a personal address when only a generic public business route is appropriate.
- [ ] [TODO] **SW-0294 · P1 · Audit current state** — Check local rules and platform terms before scaling unsolicited commercial messages in Nepal or Australia.
- [ ] [TODO] **SW-0295 · P1 · Audit current state** — Prefer permission-based contact routes where available.
- [ ] [TODO] **SW-0296 · P1 · Audit current state** — Do not scrape private contact details or bypass access controls.
- [ ] [TODO] **SW-0297 · P1 · Audit current state** — Do not automate WhatsApp messages to businesses without explicit approval and a compliant method.
- [ ] [TODO] **SW-0298 · P1 · Audit current state** — Do not create fake urgency, fake scarcity, or false claims about customers lost.- [ ] [TODO] **SW-0299 · P1 · Audit current state** — Do not promise search rankings, guaranteed leads, or a specific sales result.
- [ ] [TODO] **SW-0299 · P1 · Audit current state** — Do not promise search rankings, guaranteed leads, or a specific sales result.
- [ ] [TODO] **SW-0300 · P1 · Audit current state** — Prepare a short explanation of why this business was selected, tied to verified evidence.
- [ ] [TODO] **SW-0301 · P2 · Audit current state** — Prepare a preview-sharing message that separates concept from production website.
- [ ] [TODO] **SW-0302 · P2 · Audit current state** — Prepare a follow-up draft only for use after the owner approves a follow-up schedule.
- [ ] [TODO] **SW-0303 · P2 · Audit current state** — Set a cap on manual follow-ups per business and document the rule.
- [ ] [TODO] **SW-0304 · P2 · Audit current state** — Record the send date only after the owner actually sends a message.
- [ ] [TODO] **SW-0305 · P2 · Audit current state** — Record replies based on facts, not guesses about sentiment.
- [ ] [TODO] **SW-0306 · P2 · Audit current state** — Record objections such as price, timing, trust, or no current need using a consistent list.
- [ ] [TODO] **SW-0307 · P2 · Audit current state** — Use a do-not-contact flag immediately when asked to stop.
- [ ] [TODO] **SW-0308 · P2 · Audit current state** — Remove opted-out businesses from future outreach exports.
- [ ] [TODO] **SW-0309 · P2 · Audit current state** — Provide a manual review screen before exporting any prepared contact batch.
- [ ] [TODO] **SW-0310 · P2 · Audit current state** — Show each recipient, source, message body, and preview URL on that review screen.
- [ ] [TODO] **SW-0311 · P2 · Audit current state** — Make export files private and avoid publishing them to the public website repository.
- [ ] [TODO] **SW-0312 · P2 · Audit current state** — Do not include unnecessary owner/operator personal contact details in the CSV.
- [ ] [TODO] **SW-0313 · P2 · Audit current state** — Avoid exposing prospect contact details through public preview URLs or query parameters.
- [ ] [TODO] **SW-0314 · P2 · Audit current state** — Create a sales follow-up checklist for positive replies.
- [ ] [TODO] **SW-0315 · P2 · Audit current state** — Create a polite close-out response for businesses that decline.
- [ ] [TODO] **SW-0316 · P2 · Audit current state** — Create a workflow for a business that wants only a free directory correction.
- [ ] [TODO] **SW-0317 · P2 · Audit current state** — Create a workflow for a business that wants to claim the listing but not buy a site.
- [ ] [TODO] **SW-0318 · P2 · Audit current state** — Create a workflow for a business that wants a different quote or scope.
- [ ] [TODO] **SW-0319 · P2 · Audit current state** — Require explicit confirmation from the owner before any prepared outreach is sent.
- [ ] [TODO] **SW-0320 · P2 · Audit current state** — Proofread prepared messages for local tone and correct business names before requesting owner approval.

### Workstream 09: Directory inventory and supply expansion strategy (items 0321-0360)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** New listings are added to fill useful coverage gaps or improve qualified website prospects, not simply to inflate counts.

- [ ] [TODO] **SW-0321 · P1 · Audit current state** — Export the current business dataset and establish a dated baseline of records by category and neighbourhood.
- [ ] [TODO] **SW-0322 · P1 · Audit current state** — Verify the current 52-place count against the underlying database before repeating it publicly.
- [ ] [TODO] **SW-0323 · P1 · Audit current state** — Verify the eight-category count against the current production navigation.
- [ ] [TODO] **SW-0324 · P1 · Audit current state** — Verify the seven-neighbourhood count against the current area pages.
- [ ] [TODO] **SW-0325 · P1 · Audit current state** — Set an initial coverage target for priority categories based on actual user demand and sales goals.
- [ ] [TODO] **SW-0326 · P1 · Audit current state** — Avoid making 1,000 businesses a deadline until acquisition and verification capacity is understood.
- [ ] [TODO] **SW-0327 · P1 · Audit current state** — Build a gap table of category by neighbourhood using current listing counts.
- [ ] [TODO] **SW-0328 · P1 · Audit current state** — Overlay search demand or observed zero-result searches on the category-neighbourhood gap table.
- [ ] [TODO] **SW-0329 · P1 · Audit current state** — Prioritise categories that help both local users and the website-sales funnel.
- [ ] [TODO] **SW-0330 · P1 · Audit current state** — Keep consumer usefulness as a requirement for every newly added business.
- [ ] [TODO] **SW-0331 · P1 · Audit current state** — Create a category-specific source research checklist before collecting new businesses.
- [ ] [TODO] **SW-0332 · P1 · Audit current state** — Collect official-source links alongside each proposed new listing.
- [ ] [TODO] **SW-0333 · P1 · Audit current state** — Check business identity before creating a new record.
- [ ] [TODO] **SW-0334 · P1 · Audit current state** — Check for an existing record before inserting a business.
- [ ] [TODO] **SW-0335 · P1 · Audit current state** — Check whether the proposed record is a branch of an existing brand.
- [ ] [TODO] **SW-0336 · P1 · Audit current state** — Record why a new listing is worth adding beyond raw count.
- [ ] [TODO] **SW-0337 · P1 · Audit current state** — Prioritise businesses with clear public data and genuine local relevance.
- [ ] [TODO] **SW-0338 · P1 · Audit current state** — Avoid padding categories with duplicate branches unless branch-level utility is clear.
- [ ] [TODO] **SW-0339 · P2 · Audit current state** — Do not manufacture descriptions to fill empty fields.
- [ ] [TODO] **SW-0340 · P2 · Audit current state** — Mark missing fields as unknown instead of guessing.
- [ ] [TODO] **SW-0341 · P2 · Audit current state** — Separate candidate listings from published listings.
- [ ] [TODO] **SW-0342 · P2 · Audit current state** — Use a review queue for candidate records rather than publishing every harvested record.
- [ ] [TODO] **SW-0343 · P2 · Audit current state** — Define the minimum evidence required before a candidate becomes public.
- [ ] [TODO] **SW-0344 · P2 · Audit current state** — Define the minimum fields needed for a useful free listing.
- [ ] [TODO] **SW-0345 · P2 · Audit current state** — Publish only the fields for which there is a defensible source or clear submission provenance.
- [ ] [TODO] **SW-0346 · P2 · Audit current state** — Set a per-category minimum completeness target before promoting it heavily.
- [ ] [TODO] **SW-0347 · P2 · Audit current state** — Set a target for map coverage by useful mapped listings, not just count of pins.
- [ ] [TODO] **SW-0348 · P2 · Audit current state** — Set a priority for fixing old records before creating a large number of new records.
- [ ] [TODO] **SW-0349 · P2 · Audit current state** — Review areas outside the current seven neighbourhoods only when data supports expansion.
- [ ] [TODO] **SW-0350 · P2 · Audit current state** — Plan later coverage for Lalitpur and Bhaktapur without implying those locations are currently covered.
- [ ] [TODO] **SW-0351 · P2 · Audit current state** — Keep Kathmandu as the first proving ground until its coverage and update workflow are reliable.
- [ ] [TODO] **SW-0352 · P2 · Audit current state** — Research whether travellers, residents, and business owners produce different category priorities.
- [ ] [TODO] **SW-0353 · P2 · Audit current state** — Identify top requested missing categories from user searches and correction submissions.
- [ ] [TODO] **SW-0354 · P2 · Audit current state** — Identify top business-owner categories with weak web presence from verified prospect research.
- [ ] [TODO] **SW-0355 · P2 · Audit current state** — Use those two signals together when deciding which category to expand.
- [ ] [TODO] **SW-0356 · P3 · Audit current state** — Measure the share of new records that meet the published completeness standard.
- [ ] [TODO] **SW-0357 · P3 · Audit current state** — Measure the share of new records that become qualified website leads.
- [ ] [TODO] **SW-0358 · P3 · Audit current state** — Pause expansion if quality reviews reveal growing error rates.
- [ ] [TODO] **SW-0359 · P3 · Audit current state** — Publish a clear directory-scope statement so a small curated directory is not mistaken for a complete census.
- [ ] [TODO] **SW-0360 · P3 · Audit current state** — Keep a source log for candidate listings rejected as duplicates to avoid re-researching them.

### Workstream 10: Website-status audit and lead qualification signals (items 0361-0400)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** Website opportunities are labelled with evidence and freshness, with no misleading “broken website” claims.

- [ ] [TODO] **SW-0361 · P1 · Audit current implementation** — Define website status values: no official site found, working, broken, redirecting, uncertain, and owner-supplied.
- [ ] [TODO] **SW-0362 · P1 · Audit current implementation** — Define the exact criteria that make a site “broken.”
- [ ] [TODO] **SW-0363 · P1 · Audit current implementation** — Define the exact criteria that make a site “outdated” without relying solely on taste.
- [ ] [TODO] **SW-0364 · P1 · Audit current implementation** — Check HTTP response codes for candidate websites where technically and legally appropriate.
- [ ] [TODO] **SW-0365 · P1 · Audit current implementation** — Check whether a failed request is temporary before declaring a website broken.
- [ ] [TODO] **SW-0366 · P1 · Audit current implementation** — Check whether HTTPS certificate errors persist in a second verification attempt.
- [ ] [TODO] **SW-0367 · P1 · Audit current implementation** — Check whether the root domain redirects to a working canonical domain.
- [ ] [TODO] **SW-0368 · P1 · Audit current implementation** — Check common www and non-www variants before classifying a site as unavailable.
- [ ] [TODO] **SW-0369 · P1 · Audit current implementation** — Check whether an official social profile is used as the business's primary web presence.
- [ ] [TODO] **SW-0370 · P1 · Audit current implementation** — Avoid labelling a business “no website” when an official domain has not been searched thoroughly.
- [ ] [TODO] **SW-0371 · P1 · Audit current implementation** — Store the website status separately from the source used to determine it.
- [ ] [TODO] **SW-0372 · P1 · Audit current implementation** — Store the date and time of each website-status check.
- [ ] [TODO] **SW-0373 · P1 · Audit current implementation** — Store a short evidence note for broken and missing-site labels.
- [ ] [TODO] **SW-0374 · P1 · Audit current implementation** — Store the resolved final URL separately from the originally supplied URL.
- [ ] [TODO] **SW-0375 · P1 · Audit current implementation** — Detect and flag redirect loops.
- [ ] [TODO] **SW-0376 · P1 · Audit current implementation** — Detect likely expired domains without assuming ownership or intent.
- [ ] [TODO] **SW-0377 · P1 · Audit current implementation** — Flag sites that require login or block automated checks as uncertain rather than broken.
- [ ] [TODO] **SW-0378 · P1 · Audit current implementation** — Flag site checks that time out so they can be manually retried.
- [ ] [TODO] **SW-0379 · P2 · Audit current implementation** — Avoid aggressive repeat requests that could burden small-business websites.
- [ ] [TODO] **SW-0380 · P2 · Audit current implementation** — Use conservative request timeouts and cache recent checks.
- [ ] [TODO] **SW-0381 · P2 · Audit current implementation** — Record the last successful check, not just the most recent failed attempt.
- [ ] [TODO] **SW-0382 · P2 · Audit current implementation** — Provide a manual override for a human-reviewed website status.
- [ ] [TODO] **SW-0383 · P2 · Audit current implementation** — Record who made a manual override and why.
- [ ] [TODO] **SW-0384 · P2 · Audit current implementation** — Keep the prospect score separate from website status to avoid conflating need and quality.
- [ ] [TODO] **SW-0385 · P2 · Audit current implementation** — Do not equate an absent website with lack of business legitimacy.
- [ ] [TODO] **SW-0386 · P2 · Audit current implementation** — Do not display internal website-diagnostic notes on public listing pages.
- [ ] [TODO] **SW-0387 · P2 · Audit current implementation** — Display a public “website not listed” state only when that state is useful and accurate.
- [ ] [TODO] **SW-0388 · P2 · Audit current implementation** — Recheck a website immediately before preparing a preview for outreach.
- [ ] [TODO] **SW-0389 · P2 · Audit current implementation** — Recheck the website again before sending an approved message.
- [ ] [TODO] **SW-0390 · P2 · Audit current implementation** — Remove a “broken website” prospect label when the business fixes its site.
- [ ] [TODO] **SW-0391 · P2 · Audit current implementation** — Allow owners to submit a corrected official URL for review.
- [ ] [TODO] **SW-0392 · P2 · Audit current implementation** — Check the corrected URL before replacing the public source.
- [ ] [TODO] **SW-0393 · P2 · Audit current implementation** — Compare the entered domain with social profile links to catch likely impersonation.
- [ ] [TODO] **SW-0394 · P2 · Audit current implementation** — Do not accept arbitrary redirect destinations as safe official links without review.
- [ ] [TODO] **SW-0395 · P2 · Audit current implementation** — Create a weekly report of no-site, broken, uncertain, and working-site counts.
- [ ] [TODO] **SW-0396 · P2 · Audit current implementation** — Measure how often automated site checks disagree with human review.
- [ ] [TODO] **SW-0397 · P3 · Audit current implementation** — Review false positives and tune the classification rules.
- [ ] [TODO] **SW-0398 · P3 · Audit current implementation** — Keep the checking process transparent and avoid claiming continuous monitoring if checks are periodic.
- [ ] [TODO] **SW-0399 · P3 · Audit current implementation** — Test website status logic against all currently listed businesses before using it in sales copy.
- [ ] [TODO] **SW-0400 · P3 · Audit current implementation** — Check parked-domain pages before classifying a business website as expired or broken.

### Workstream 11: Verification model, field-level sources, and freshness (items 0401-0440)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** Every material public fact has clear provenance, and “verified” means a defined check rather than an unexplained badge.

- [ ] [TODO] **SW-0401 · P1 · Audit current state** — Define a single public vocabulary for source checked, partially checked, needs checking, and owner-confirmed.
- [ ] [TODO] **SW-0402 · P1 · Audit current state** — Separate business existence verification from individual data-field verification.
- [ ] [TODO] **SW-0403 · P1 · Audit current state** — Create a field-level source model for phone, address, hours, website, services, and social links.
- [ ] [TODO] **SW-0404 · P1 · Audit current state** — Record the source URL for every field that was checked.
- [ ] [TODO] **SW-0405 · P1 · Audit current state** — Record the date each field was checked.
- [ ] [TODO] **SW-0406 · P1 · Audit current state** — Record whether the source is official, owner-submitted, government, or third-party.
- [ ] [TODO] **SW-0407 · P1 · Audit current state** — Define which source classes are acceptable for each field type.
- [ ] [TODO] **SW-0408 · P1 · Audit current state** — Prefer official business websites for facts they explicitly publish.
- [ ] [TODO] **SW-0409 · P1 · Audit current state** — Use an official social profile only when there is reasonable evidence it belongs to the business.
- [ ] [TODO] **SW-0410 · P1 · Audit current state** — Treat third-party directory data as a lead for research rather than conclusive proof when possible.
- [ ] [TODO] **SW-0411 · P1 · Audit current state** — Treat a user correction as a report that needs review, not automatic fact.
- [ ] [TODO] **SW-0412 · P1 · Audit current state** — Treat owner-supplied updates as pending until the chosen verification rule is satisfied.
- [ ] [TODO] **SW-0413 · P1 · Audit current state** — Define the minimum provenance required for a phone number to be labelled checked.
- [ ] [TODO] **SW-0414 · P1 · Audit current state** — Define the minimum provenance required for opening hours to be labelled confirmed.
- [ ] [TODO] **SW-0415 · P1 · Audit current state** — Define the minimum provenance required for an exact address to be labelled verified.
- [ ] [TODO] **SW-0416 · P1 · Audit current state** — Define the minimum provenance required for a website to be labelled official.
- [ ] [TODO] **SW-0417 · P1 · Audit current state** — Define when a source is too old to support a current-hours claim.
- [ ] [TODO] **SW-0418 · P1 · Audit current state** — Choose freshness windows by field volatility rather than one blanket interval.
- [ ] [TODO] **SW-0419 · P2 · Audit current state** — Flag phone numbers for recheck after repeated failed reports.
- [ ] [TODO] **SW-0420 · P2 · Audit current state** — Flag hours for recheck before major public holidays or when users report a conflict.
- [ ] [TODO] **SW-0421 · P2 · Audit current state** — Flag a website for recheck after it fails a recent health check.
- [ ] [TODO] **SW-0422 · P2 · Audit current state** — Flag address/location for recheck after a branch relocation report.
- [ ] [TODO] **SW-0423 · P2 · Audit current state** — Add a record history for source changes to material fields.
- [ ] [TODO] **SW-0424 · P2 · Audit current state** — Preserve prior source values in the audit trail where appropriate.
- [ ] [REVIEW] **SW-0425 · P2 · Reported public source/check line; verify field coverage** — Make a public listing show concise “checked against” details without overwhelming the user.
- [ ] [TODO] **SW-0426 · P2 · Audit current state** — Link to the source when doing so is useful and permitted.
- [ ] [TODO] **SW-0427 · P2 · Audit current state** — Do not expose private internal notes or operator reasoning in public provenance text.
- [ ] [TODO] **SW-0428 · P2 · Audit current state** — Replace vague “verified” copy with a field-specific claim where only one field was checked.
- [ ] [TODO] **SW-0429 · P2 · Audit current state** — Avoid creating a numeric trust score until its formula is explainable and tested.
- [ ] [TODO] **SW-0430 · P2 · Audit current state** — If a score is later used, show the criteria and do not let paid placement improve it.
- [ ] [TODO] **SW-0431 · P2 · Audit current state** — Create a freshness status of current, due soon, stale, or unknown.
- [ ] [TODO] **SW-0432 · P2 · Audit current state** — Run a report for records whose most important fields are stale.
- [ ] [TODO] **SW-0433 · P2 · Audit current state** — Create a queue for listings where source and displayed value disagree.
- [ ] [TODO] **SW-0434 · P2 · Audit current state** — Keep a log of corrections made after a public error report.
- [ ] [TODO] **SW-0435 · P2 · Audit current state** — Require a source note whenever a moderator changes an important factual field.
- [ ] [TODO] **SW-0436 · P3 · Audit current state** — Provide a way to withdraw a source that is broken, impersonating, or no longer authoritative.
- [ ] [TODO] **SW-0437 · P3 · Audit current state** — Revalidate the visible source labels on a sample of current listings.
- [ ] [TODO] **SW-0438 · P3 · Audit current state** — Train future contributors with examples of good and insufficient evidence.
- [ ] [TODO] **SW-0439 · P3 · Audit current state** — Publish a simple public explanation of what “checked” does and does not guarantee.
- [ ] [TODO] **SW-0440 · P3 · Audit current state** — Do not imply that any source check guarantees a business is open at this moment.

### Workstream 12: Addresses, coordinates, maps, and proximity (items 0441-0480)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** Map pins and distances represent confirmed locations; unknown locations remain explicitly unknown.

- [ ] [REVIEW] **SW-0441 · P1 · Reported 21 pins; verify live count and accuracy** — Confirm the current total of businesses with reliable coordinates in the live database.
- [ ] [REVIEW] **SW-0442 · P1 · Reported 21 pins; verify live count and accuracy** — Compare the current coordinate count with the reported 21 mapped pins before publishing a percentage.
- [ ] [REVIEW] **SW-0443 · P1 · Reported 21 pins; verify live count and accuracy** — Set a denominator rule for map coverage that excludes inactive or duplicate records where justified.
- [ ] [TODO] **SW-0444 · P1 · Audit current state** — Store latitude and longitude as numeric fields with validated ranges.
- [ ] [TODO] **SW-0445 · P1 · Audit current state** — Validate coordinates fall within the claimed country and plausible neighbourhood.
- [ ] [TODO] **SW-0446 · P1 · Audit current state** — Check that a coordinate is not accidentally a city-centre default shared by unrelated businesses.
- [ ] [TODO] **SW-0447 · P1 · Audit current state** — Flag suspiciously identical coordinates across different businesses for review.
- [ ] [TODO] **SW-0448 · P1 · Audit current state** — Store address text separately from coordinates.
- [ ] [TODO] **SW-0449 · P1 · Audit current state** — Store neighbourhood separately from street address.
- [ ] [TODO] **SW-0450 · P1 · Audit current state** — Store a nearby landmark separately from the official address.
- [ ] [TODO] **SW-0451 · P1 · Audit current state** — Record the source used for each exact location.
- [ ] [TODO] **SW-0452 · P1 · Audit current state** — Use geocoding only as a candidate coordinate source until a human or trusted source confirms the result.
- [ ] [TODO] **SW-0453 · P1 · Audit current state** — Review map pins on a map before publishing coordinates from uncertain geocoding.
- [ ] [TODO] **SW-0454 · P1 · Audit current state** — Do not convert “Thamel” or “Boudha” into a fake street address.
- [ ] [TODO] **SW-0455 · P1 · Audit current state** — Do not display a location accuracy claim stronger than the underlying evidence supports.
- [ ] [TODO] **SW-0456 · P1 · Audit current state** — Use a location-status field such as exact, approximate, neighbourhood-only, or unknown.
- [ ] [TODO] **SW-0457 · P1 · Audit current state** — Make directions available only for locations at the supported accuracy level.
- [ ] [TODO] **SW-0458 · P1 · Audit current state** — Label approximate area information as an area, not an exact pin.
- [ ] [TODO] **SW-0459 · P2 · Audit current state** — Check Google Maps links open the intended business or a useful directions route.
- [ ] [TODO] **SW-0460 · P2 · Audit current state** — Check directions links do not route to the wrong branch of a multi-branch brand.
- [ ] [TODO] **SW-0461 · P2 · Audit current state** — Use branch-specific destination data when the business has multiple locations.
- [ ] [TODO] **SW-0462 · P2 · Audit current state** — Test all current pins against the listed neighbourhood.
- [ ] [TODO] **SW-0463 · P2 · Audit current state** — Add an admin queue for records whose location is missing.
- [ ] [TODO] **SW-0464 · P2 · Audit current state** — Add an admin queue for records with an approximate location only.
- [ ] [TODO] **SW-0465 · P2 · Audit current state** — Prioritise missing coordinates on high-demand listings and high-intent website prospects.
- [ ] [TODO] **SW-0466 · P2 · Audit current state** — Provide a public correction path for incorrect pins.
- [ ] [TODO] **SW-0467 · P2 · Audit current state** — Provide an admin review path for user-submitted coordinates.
- [ ] [TODO] **SW-0468 · P2 · Audit current state** — Ensure the “near me” feature processes device location only as described by the privacy policy.
- [ ] [TODO] **SW-0469 · P2 · Audit current state** — Verify precise location is not stored in analytics or server logs unexpectedly.
- [ ] [TODO] **SW-0470 · P2 · Audit current state** — Calculate distances from coordinates only when both origin and destination have adequate precision.
- [ ] [TODO] **SW-0471 · P2 · Audit current state** — Round displayed distances sensibly and avoid false precision.
- [ ] [TODO] **SW-0472 · P2 · Audit current state** — Sort by distance only when the location permission is granted and the candidate locations are reliable.
- [ ] [TODO] **SW-0473 · P2 · Audit current state** — Provide a graceful no-location-permission state without repeated pressure.
- [ ] [TODO] **SW-0474 · P2 · Audit current state** — Check the location feature when the user is outside Kathmandu.
- [ ] [TODO] **SW-0475 · P2 · Audit current state** — Keep the existing “nothing here yet” message useful for areas not covered.
- [ ] [TODO] **SW-0476 · P3 · Audit current state** — Check that location sorting does not break ordinary category or text search.
- [ ] [TODO] **SW-0477 · P3 · Audit current state** — Define a map-coverage target for priority inventory before setting a city-wide percentage goal.
- [ ] [TODO] **SW-0478 · P3 · Audit current state** — Prioritise map fixes that improve user usefulness rather than blindly aiming at 95 percent.
- [ ] [TODO] **SW-0479 · P3 · Audit current state** — Maintain a monthly report of confirmed, approximate, and missing locations.
- [ ] [TODO] **SW-0480 · P3 · Audit current state** — Do not state that a location is exact unless the location source supports that claim.

### Workstream 13: Listing page content, actions, and conversion UX (items 0481-0520)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** A listing helps a consumer act and gives a relevant business owner a clear, non-repetitive path to the preview or claim flow.

- [ ] [TODO] **SW-0481 · P1 · Audit current state** — Inspect the current listing-page hierarchy before changing its layout.
- [ ] [TODO] **SW-0482 · P1 · Audit current state** — Keep the business name, category, and branch/location clear near the top.
- [ ] [TODO] **SW-0483 · P1 · Audit current state** — Show the most useful verified facts before secondary editorial content.
- [ ] [TODO] **SW-0484 · P1 · Audit current state** — Use one primary consumer action based on the data available for that business.
- [ ] [TODO] **SW-0485 · P1 · Audit current state** — Show a call action only when a public phone number has an adequate source.
- [ ] [TODO] **SW-0486 · P1 · Audit current state** — Show a directions action only when the location is sufficiently reliable.
- [ ] [TODO] **SW-0487 · P1 · Audit current state** — Show an official website action only for a working, checked destination.
- [ ] [TODO] **SW-0488 · P1 · Audit current state** — Show social actions only for links that reasonably belong to the business.
- [ ] [TODO] **SW-0489 · P1 · Audit current state** — Keep save-place action visually available without competing with the main task.
- [ ] [TODO] **SW-0490 · P1 · Audit current state** — Keep the business-owner card visually separate from consumer actions.
- [ ] [TODO] **SW-0491 · P1 · Audit current state** — Avoid duplicating claim buttons in the same viewport and again in every section.
- [ ] [TODO] **SW-0492 · P1 · Audit current state** — Choose one concise owner CTA according to the business's current website status.
- [ ] [TODO] **SW-0493 · P1 · Audit current state** — For missing or broken websites, route the owner to the existing relevant preview where available.
- [ ] [TODO] **SW-0494 · P1 · Audit current state** — For businesses with a working website, avoid an irrelevant “no website” pitch.
- [ ] [TODO] **SW-0495 · P1 · Audit current state** — Keep owner CTA copy respectful and avoid implying that a generated preview is authorised by the owner.
- [ ] [TODO] **SW-0496 · P1 · Audit current state** — Show opening hours in a scannable format when data is structured and reliable.
- [ ] [TODO] **SW-0497 · P2 · Audit current state** — Show a clear unknown-hours state when information is missing.
- [ ] [TODO] **SW-0498 · P2 · Audit current state** — Show the source and last-checked date close enough to the claim to be understood.
- [ ] [TODO] **SW-0499 · P2 · Audit current state** — Avoid showing an empty label such as “Website not checked” without stating what was not checked.
- [ ] [TODO] **SW-0500 · P2 · Audit current state** — Separate business description from internal verification notes.
- [ ] [TODO] **SW-0501 · P2 · Audit current state** — Add a concise “Good to know” area only when sourced facts justify it.
- [ ] [TODO] **SW-0502 · P2 · Audit current state** — Use service tags only when services are supplied or verified.
- [ ] [TODO] **SW-0503 · P2 · Audit current state** — Show branch relationships without making sibling locations look like duplicate records.
- [ ] [TODO] **SW-0504 · P2 · Audit current state** — Keep breadcrumbs consistent with the live route hierarchy.
- [ ] [TODO] **SW-0505 · P2 · Audit current state** — Make nearby-business cards useful by showing category and location context.
- [ ] [TODO] **SW-0506 · P2 · Audit current state** — Show distance on nearby cards only when the calculation is defensible.
- [ ] [TODO] **SW-0507 · P2 · Audit current state** — Do not invent star ratings, reviews, price levels, or popularity claims.
- [ ] [TODO] **SW-0508 · P2 · Audit current state** — Provide an obvious report-correction link that preserves the listing identity.
- [ ] [TODO] **SW-0509 · P2 · Audit current state** — Ensure the correction form opens with the correct business already selected.
- [ ] [TODO] **SW-0510 · P2 · Audit current state** — Handle missing photos with a neutral branded layout rather than fake imagery.
- [ ] [TODO] **SW-0511 · P2 · Audit current state** — Check long names, long Nepali text, and absent optional fields for layout failures.
- [ ] [TODO] **SW-0512 · P2 · Audit current state** — Keep listing metadata and visible copy aligned.
- [ ] [TODO] **SW-0513 · P2 · Audit current state** — Test the exact page on a phone before promoting a new listing design.
- [ ] [TODO] **SW-0514 · P2 · Audit current state** — Check external links for safe target behaviour and clear link affordance.
- [ ] [TODO] **SW-0515 · P2 · Audit current state** — Make the page shareable with a sensible title, snippet, and canonical URL.
- [ ] [TODO] **SW-0516 · P2 · Audit current state** — Confirm the preview owner CTA is not present on private, removed, or invalid listings.
- [ ] [TODO] **SW-0517 · P3 · Audit current state** — Test a full consumer path from search result to call or directions action.
- [ ] [TODO] **SW-0518 · P3 · Audit current state** — Test a full business-owner path from listing to preview to saved lead.
- [ ] [TODO] **SW-0519 · P3 · Audit current state** — Document the intended action hierarchy for each listing state.
- [ ] [TODO] **SW-0520 · P3 · Audit current state** — Check that the owner-facing preview CTA changes appropriately when a verified website-status field changes.

### Workstream 14: Search, filters, and local discovery (items 0521-0560)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** Search works for real local intents and honestly reports gaps instead of pretending unavailable inventory exists.

- [ ] [TODO] **SW-0521 · P1 · Audit current state** — Audit the current search implementation and write down supported query types before rebuilding it.
- [ ] [TODO] **SW-0522 · P1 · Audit current state** — Test search by exact business name.
- [ ] [TODO] **SW-0523 · P1 · Audit current state** — Test search by partial business name.
- [ ] [TODO] **SW-0524 · P1 · Audit current state** — Test search by category.
- [ ] [TODO] **SW-0525 · P1 · Audit current state** — Test search by neighbourhood.
- [ ] [TODO] **SW-0526 · P1 · Audit current state** — Test search by service keyword.
- [ ] [TODO] **SW-0527 · P1 · Audit current state** — Test search with mixed category and neighbourhood terms.
- [ ] [TODO] **SW-0528 · P1 · Audit current state** — Test search with “near me” when permission is granted.
- [ ] [TODO] **SW-0529 · P1 · Audit current state** — Test search with “near me” when permission is denied.
- [ ] [TODO] **SW-0530 · P1 · Audit current state** — Test “open now” against a business with complete structured hours.
- [ ] [TODO] **SW-0531 · P1 · Audit current state** — Test “open now” against a business with missing hours and ensure it is not falsely shown as open.
- [ ] [TODO] **SW-0532 · P1 · Audit current state** — Test “open now” across a midnight boundary in Nepal local time.
- [ ] [TODO] **SW-0533 · P1 · Audit current state** — Normalize case and common whitespace in query matching.
- [ ] [TODO] **SW-0534 · P1 · Audit current state** — Normalize accents so café and cafe find equivalent relevant results.
- [x] [DONE] **SW-0535 · P1 · Audit current state** — Add safe synonym mapping for salon, beauty parlour, and hair salon. Shipped by GuideBook bot, 26-31 Oct 2026.
- [x] [DONE] **SW-0536 · P1 · Audit current state** — Add safe synonym mapping for cafe, coffee shop, and café. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] **SW-0537 · P1 · Audit current state** — Add safe synonym mapping for dentist, dental clinic, and dental care where appropriate.
- [ ] [TODO] **SW-0538 · P1 · Audit current state** — Add service synonyms such as massage to relevant spa services when sourced.
- [x] [DONE] **SW-0539 · P2 · Audit current state** — Add typo tolerance for common misspellings only after a clear exact-match result is not found. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] **SW-0540 · P2 · Audit current state** — Support partial prefixes without requiring the full business name.
- [ ] [TODO] **SW-0541 · P2 · Audit current state** — Tokenize category and area terms so query word order does not have to be exact.
- [ ] [TODO] **SW-0542 · P2 · Audit current state** — Avoid treating every word in a business description as equal to an exact category match.
- [ ] [TODO] **SW-0543 · P2 · Audit current state** — Rank exact business-name matches above broad text matches when appropriate.
- [ ] [TODO] **SW-0544 · P2 · Audit current state** — Rank location relevance without hiding more exact business-name matches.
- [ ] [TODO] **SW-0545 · P2 · Audit current state** — Keep filters in URL state only where stable URLs and privacy allow it.
- [ ] [TODO] **SW-0546 · P2 · Audit current state** — Ensure filter changes do not create infinite or broken navigation history.
- [ ] [TODO] **SW-0547 · P2 · Audit current state** — Offer a useful empty state with suggested queries and an add-business path.
- [ ] [TODO] **SW-0548 · P2 · Audit current state** — Track zero-result queries without collecting precise user location.
- [ ] [TODO] **SW-0549 · P2 · Audit current state** — Review zero-result queries weekly to discover demand gaps.
- [ ] [TODO] **SW-0550 · P2 · Audit current state** — Avoid creating a public landing page for every arbitrary search phrase.
- [ ] [TODO] **SW-0551 · P2 · Audit current state** — Show the number of results only when it reflects the actual filtered result set.
- [ ] [TODO] **SW-0552 · P2 · Audit current state** — Make the no-result state distinguish “nothing listed” from “search failed.”
- [ ] [TODO] **SW-0553 · P2 · Audit current state** — Preserve the user query when they open a result and return.
- [ ] [TODO] **SW-0554 · P2 · Audit current state** — Check pagination or load-more behaviour for larger future datasets.
- [ ] [TODO] **SW-0555 · P2 · Audit current state** — Check search response times as the database grows.
- [ ] [TODO] **SW-0556 · P2 · Audit current state** — Test search in both English and Nepali.
- [ ] [TODO] **SW-0557 · P3 · Audit current state** — Test romanized Nepali terms if they appear in actual query data.
- [ ] [TODO] **SW-0558 · P3 · Audit current state** — Test category filters against the actual current category taxonomy.
- [ ] [TODO] **SW-0559 · P3 · Audit current state** — Review relevance using a representative set of real local queries.
- [ ] [TODO] **SW-0560 · P3 · Audit current state** — Write regression tests for the top 25 queries once a reliable baseline is established.

### Workstream 15: SEO, crawlability, snippets, and structured data (items 0561-0600)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** Search engines can understand useful real pages, while private previews, query spam, and thin pages stay out of the index.

- [ ] [TODO] **SW-0561 · P1 · Audit current state** — Crawl the current production site and save a list of indexable public routes.
- [ ] [TODO] **SW-0562 · P1 · Audit current state** — Check the current robots.txt from the production domain.
- [ ] [TODO] **SW-0563 · P1 · Audit current state** — Check the current sitemap URL and validate its XML response.
- [ ] [TODO] **SW-0564 · P1 · Audit current state** — Compare sitemap URLs with canonical public pages.
- [ ] [TODO] **SW-0565 · P1 · Audit current state** — Keep private website previews out of the sitemap.
- [ ] [TODO] **SW-0566 · P1 · Audit current state** — Verify preview pages emit an effective noindex directive in the rendered response.
- [ ] [TODO] **SW-0567 · P1 · Audit current state** — Verify noindex pages are not accidentally submitted as indexable via structured data feeds.
- [ ] [TODO] **SW-0568 · P1 · Audit current state** — Check the canonical tag on the homepage.
- [ ] [TODO] **SW-0569 · P1 · Audit current state** — Check the canonical tag on each current category page.
- [ ] [TODO] **SW-0570 · P1 · Audit current state** — Check the canonical tag on each neighbourhood page.
- [ ] [TODO] **SW-0571 · P1 · Audit current state** — Check the canonical tag on a representative listing page.
- [ ] [TODO] **SW-0572 · P1 · Audit current state** — Check the canonical tag on pages with query parameters.
- [ ] [TODO] **SW-0573 · P1 · Audit current state** — Prevent arbitrary search queries from creating crawlable indexable URL variants.
- [ ] [TODO] **SW-0574 · P1 · Audit current state** — Preserve redirects from old city or category routes to their current equivalents.
- [ ] [TODO] **SW-0575 · P1 · Audit current state** — Test every known legacy redirect for one-hop destination and relevant content.
- [ ] [TODO] **SW-0576 · P1 · Audit current state** — Avoid redirect chains where old paths redirect through multiple intermediate paths.
- [ ] [TODO] **SW-0577 · P1 · Audit current state** — Check for 404s among important links in the sitemap and footer.
- [ ] [TODO] **SW-0578 · P2 · Audit current state** — Check for soft-404 pages that have little useful content but return success status.
- [ ] [TODO] **SW-0579 · P2 · Audit current state** — Ensure page titles distinguish the business, location, and Boxont brand where useful.
- [ ] [TODO] **SW-0580 · P2 · Audit current state** — Ensure meta descriptions are unique enough to reflect each genuine listing.
- [ ] [TODO] **SW-0581 · P2 · Audit current state** — Avoid promising “verified” in a snippet when the relevant field has not been checked.
- [ ] [TODO] **SW-0582 · P2 · Audit current state** — Keep the homepage and Kathmandu page from sharing an ambiguous title if they are distinct pages.
- [ ] [TODO] **SW-0583 · P2 · Audit current state** — Check title and description output in the final HTML rather than only client-side state.
- [x] [DONE] **SW-0584 · P2 · Audit current state** — Implement LocalBusiness or a more specific supported schema type only where visible facts support it. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] **SW-0585 · P2 · Audit current state** — Use PostalAddress only when the address fields are actually known.
- [ ] [TODO] **SW-0586 · P2 · Audit current state** — Use GeoCoordinates only for sufficiently reliable coordinates.
- [ ] [TODO] **SW-0587 · P2 · Audit current state** — Use OpeningHoursSpecification only when hours are structured and confirmed enough to display.
- [ ] [TODO] **SW-0588 · P2 · Audit current state** — Use telephone schema only for a public number shown on the page.
- [ ] [TODO] **SW-0589 · P2 · Audit current state** — Use sameAs links only for official social profiles with reasonable identity confidence.
- [ ] [TODO] **SW-0590 · P2 · Audit current state** — Do not invent reviews, aggregate ratings, or price ranges in structured data.
- [ ] [TODO] **SW-0591 · P2 · Audit current state** — Validate structured data with a suitable validator before release.
- [ ] [TODO] **SW-0592 · P2 · Audit current state** — Ensure breadcrumb structured data matches the displayed breadcrumb hierarchy.
- [ ] [TODO] **SW-0593 · P2 · Audit current state** — Ensure English and Nepali alternate-page signals are added only if truly separate language URLs exist.
- [ ] [TODO] **SW-0594 · P2 · Audit current state** — Create unique indexable area-category pages only when there is useful inventory and distinct user value.
- [ ] [TODO] **SW-0595 · P2 · Audit current state** — Write factual introductory content for category pages based on real coverage.
- [ ] [TODO] **SW-0596 · P3 · Audit current state** — Do not auto-generate hundreds of thin SEO pages from empty category-area combinations.
- [ ] [TODO] **SW-0597 · P3 · Audit current state** — Add internal links from relevant category, neighbourhood, and listing pages.
- [ ] [TODO] **SW-0598 · P3 · Audit current state** — Monitor search-console indexing issues after each major URL or sitemap change.
- [ ] [TODO] **SW-0599 · P3 · Audit current state** — Keep a dated snapshot of search performance before significant SEO edits.
- [ ] [TODO] **SW-0600 · P3 · Audit current state** — Check Open Graph title, description, and image so shared links show the correct business context.

### Workstream 16: Trust messaging, About content, and verification methodology (items 0601-0640)

**Phase:** 2 - Trustworthy acquisition  
**Definition of done:** The website explains its scope and verification method accurately, without overpromising completeness or guaranteeing facts.

- [ ] [TODO] **SW-0601 · P1 · Audit current state** — Keep the current clear, trust-led homepage position unless measured tests support a change.
- [ ] [TODO] **SW-0602 · P1 · Audit current state** — Test a concrete headline variant that explains checked local business details.
- [ ] [TODO] **SW-0603 · P1 · Audit current state** — Keep the supporting line explicit about which facts are checked and where the source appears.
- [ ] [TODO] **SW-0604 · P1 · Audit current state** — Avoid claiming every listing is fully verified when only selected fields were checked.
- [ ] [TODO] **SW-0605 · P1 · Audit current state** — Avoid implying the directory is complete for Kathmandu when it is a curated subset.
- [ ] [TODO] **SW-0606 · P1 · Audit current state** — Use a factual current listing count only after checking the database.
- [ ] [TODO] **SW-0607 · P1 · Audit current state** — Use a factual mapped count only after confirming the counting method.
- [ ] [TODO] **SW-0608 · P1 · Audit current state** — Use “last checked” dates only when a timestamp exists for the relevant check.
- [x] [DONE] **SW-0609 · P1 · Audit current state** — Write a public “How we verify” page with the exact current method. Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] **SW-0610 · P1 · Audit current state** — Explain the difference between business existence and individual data-field verification.
- [ ] [TODO] **SW-0611 · P1 · Audit current state** — Explain which source types are used and how source quality is evaluated.
- [ ] [TODO] **SW-0612 · P1 · Audit current state** — Explain that opening hours can change after a check.
- [ ] [TODO] **SW-0613 · P1 · Audit current state** — Explain how owners can claim a listing.
- [ ] [TODO] **SW-0614 · P1 · Audit current state** — Explain how consumers can submit a correction.
- [ ] [TODO] **SW-0615 · P1 · Audit current state** — Explain how a business can request removal or correction of its information.
- [ ] [TODO] **SW-0616 · P1 · Audit current state** — Explain what the site does not guarantee.
- [ ] [TODO] **SW-0617 · P1 · Audit current state** — Describe the operator and service brand in a way that matches the actual business arrangement.
- [ ] [TODO] **SW-0618 · P2 · Audit current state** — Expand the About page with a clear purpose and practical methodology. Still open: write a fuller About page.
- [ ] [TODO] **SW-0619 · P2 · Audit current state** — Keep About copy factual and avoid unsupported claims about being Nepal's largest or best.
- [ ] [TODO] **SW-0620 · P2 · Audit current state** — Keep the statement about sitting beside a map app if it still matches the product.
- [ ] [TODO] **SW-0621 · P2 · Audit current state** — Make the free-listing promise clear and consistent across the site.
- [ ] [TODO] **SW-0622 · P2 · Audit current state** — Explain separately what is free in the directory and what website work may cost.
- [ ] [TODO] **SW-0623 · P2 · Audit current state** — Do not put a public “free website” claim on every business without a relevant preview or approved process.
- [ ] [TODO] **SW-0624 · P2 · Audit current state** — Clarify that preview concepts are not official business websites until the owner approves them.
- [ ] [TODO] **SW-0625 · P2 · Audit current state** — Avoid implying endorsement by a business because it is listed or has a preview.
- [ ] [TODO] **SW-0626 · P2 · Audit current state** — Make the contact route clear without exposing a private phone number.
- [ ] [TODO] **SW-0627 · P2 · Audit current state** — Make policy links easy to find without crowding the mobile footer.
- [ ] [TODO] **SW-0628 · P2 · Audit current state** — Check footer labels for consistent names between “Website design” and “For businesses.”
- [ ] [TODO] **SW-0629 · P2 · Audit current state** — Clarify Boxont versus Sewa brand hierarchy in the header, footer, and page titles.
- [ ] [TODO] **SW-0630 · P2 · Audit current state** — Investigate the rendered header label “BBoxontsewa” and correct only if it is genuinely an accidental visual or accessible-name defect.
- [ ] [TODO] **SW-0631 · P2 · Audit current state** — Keep brand marks and accessible names separate when appropriate.
- [ ] [TODO] **SW-0632 · P2 · Audit current state** — Remove stale prototype language only after verifying no other page still depends on it.
- [ ] [TODO] **SW-0633 · P2 · Audit current state** — Review all public trust claims against the actual database and workflow.
- [ ] [TODO] **SW-0634 · P2 · Audit current state** — Create a proof record for claims such as “hours confirmed by the business.”
- [ ] [TODO] **SW-0635 · P2 · Audit current state** — Use examples of real sourced data only when the source remains valid.
- [ ] [TODO] **SW-0636 · P3 · Audit current state** — Avoid publishing internal sales status or owner-contact history as public content.
- [ ] [TODO] **SW-0637 · P3 · Audit current state** — Test the trust page on mobile and in Nepali.
- [ ] [TODO] **SW-0638 · P3 · Audit current state** — Ask a few users whether they understand what “checked” means after reading the copy.
- [ ] [TODO] **SW-0639 · P3 · Audit current state** — Update messaging if users interpret a check as a guarantee of current availability.
- [ ] [TODO] **SW-0640 · P3 · Audit current state** — Show source-freshness claims only when a relevant field-level timestamp is stored.

### Workstream 17: Mobile-first design and interaction consistency (items 0641-0680)

**Phase:** 3 - Product reliability  
**Definition of done:** Core consumer and lead flows pass real mobile review, with clear hierarchy, no overflow, and no repeated CTAs.

- [ ] [TODO] **SW-0641 · P1 · Audit current state** — Capture a fresh 390px screenshot of the homepage before layout edits.
- [ ] [TODO] **SW-0642 · P1 · Audit current state** — Capture a fresh 390px screenshot of a category page before layout edits.
- [ ] [TODO] **SW-0643 · P1 · Audit current state** — Capture a fresh 390px screenshot of a neighbourhood page before layout edits.
- [ ] [TODO] **SW-0644 · P1 · Audit current state** — Capture a fresh 390px screenshot of a business listing before layout edits.
- [ ] [TODO] **SW-0645 · P1 · Audit current state** — Capture a fresh 390px screenshot of a preview page before layout edits.
- [ ] [TODO] **SW-0646 · P1 · Audit current state** — Capture a fresh 390px screenshot of the For Businesses page before layout edits.
- [ ] [TODO] **SW-0647 · P1 · Audit current state** — Capture a fresh 390px screenshot of each form state before layout edits.
- [ ] [TODO] **SW-0648 · P1 · Audit current state** — Check the bottom navigation alignment on a real production route.
- [ ] [TODO] **SW-0649 · P1 · Audit current state** — Check the bottom navigation does not bunch on one side at narrow widths.
- [ ] [TODO] **SW-0650 · P1 · Audit current state** — Check the active tab style is consistent across all main routes.
- [ ] [TODO] **SW-0651 · P1 · Audit current state** — Check header branding is readable without taking excessive vertical space.
- [ ] [TODO] **SW-0652 · P1 · Audit current state** — Check search controls fit without horizontal scrolling.
- [ ] [TODO] **SW-0653 · P1 · Audit current state** — Check category chips wrap cleanly on narrow devices.
- [ ] [TODO] **SW-0654 · P1 · Audit current state** — Check the map/list toggle is usable with one thumb.
- [ ] [TODO] **SW-0655 · P1 · Audit current state** — Check map pins remain selectable without overlapping every neighbouring pin.
- [ ] [TODO] **SW-0656 · P1 · Audit current state** — Check business cards use a consistent hierarchy for title, area, category, and trust status.
- [ ] [TODO] **SW-0657 · P1 · Audit current state** — Check long business names for line wrapping and stable card heights.
- [ ] [TODO] **SW-0658 · P2 · Audit current state** — Check Nepali glyphs do not clip in headings, controls, or badges.
- [ ] [TODO] **SW-0659 · P2 · Audit current state** — Check forms keep their submit button visible and tappable when the keyboard opens.
- [ ] [TODO] **SW-0660 · P2 · Audit current state** — Check iOS and Android keyboard behaviour where a device/browser is available.
- [ ] [TODO] **SW-0661 · P2 · Audit current state** — Check safe-area padding around bottom navigation and sticky controls.
- [ ] [TODO] **SW-0662 · P2 · Audit current state** — Check sticky controls do not cover content or legal links.
- [ ] [TODO] **SW-0663 · P2 · Audit current state** — Check the primary CTA appears once in each relevant mobile conversion context.
- [ ] [TODO] **SW-0664 · P2 · Audit current state** — Remove duplicate messages that repeat the same promise within one viewport.
- [ ] [TODO] **SW-0665 · P2 · Audit current state** — Check that a page doesn't use multiple competing primary-colour buttons.
- [ ] [TODO] **SW-0666 · P2 · Audit current state** — Keep confirmation states visually distinct from errors.
- [ ] [TODO] **SW-0667 · P2 · Audit current state** — Keep loading indicators from shifting the entire layout unexpectedly.
- [ ] [TODO] **SW-0668 · P2 · Audit current state** — Check long error messages do not push the submit action off screen.
- [ ] [TODO] **SW-0669 · P2 · Audit current state** — Check text contrast on all current category colour treatments.
- [ ] [TODO] **SW-0670 · P2 · Audit current state** — Check buttons meet comfortable touch target sizes.
- [ ] [TODO] **SW-0671 · P2 · Audit current state** — Check external links are distinguishable from internal navigation where helpful.
- [ ] [TODO] **SW-0672 · P2 · Audit current state** — Check back-navigation returns a user to the right search/filter state.
- [ ] [TODO] **SW-0673 · P2 · Audit current state** — Check orientation changes do not break the desktop map/list layout.
- [ ] [TODO] **SW-0674 · P2 · Audit current state** — Use a page-specific layout where it improves comprehension rather than forcing every page into one template.
- [ ] [TODO] **SW-0675 · P2 · Audit current state** — Retain the quieter premium design direction unless evidence demonstrates a conversion problem.
- [ ] [TODO] **SW-0676 · P3 · Audit current state** — Avoid animation or imagery that increases load time without improving task completion.
- [ ] [TODO] **SW-0677 · P3 · Audit current state** — Review screenshots manually before declaring a mobile change finished.
- [ ] [TODO] **SW-0678 · P3 · Audit current state** — Store before/after screenshots for any change to a conversion-critical page.
- [ ] [TODO] **SW-0679 · P3 · Audit current state** — Do not ship a visual change based on desktop-only review.
- [ ] [TODO] **SW-0680 · P3 · Audit current state** — Record design regressions with route, viewport, reproduction steps, and expected result.

### Workstream 18: Performance, accessibility, compatibility, and regression testing (items 0681-0720)

**Phase:** 3 - Product reliability  
**Definition of done:** Critical user journeys remain fast, accessible, and stable across supported devices and release changes.

- [ ] [TODO] **SW-0681 · P1 · Audit current state** — Run a production performance baseline on the homepage using a representative mobile profile.
- [ ] [TODO] **SW-0682 · P1 · Audit current state** — Run a performance baseline on a listing page.
- [ ] [TODO] **SW-0683 · P1 · Audit current state** — Run a performance baseline on the preview page.
- [ ] [TODO] **SW-0684 · P1 · Audit current state** — Measure image payload sizes on the homepage and listing cards.
- [ ] [TODO] **SW-0685 · P1 · Audit current state** — Serve appropriately sized images for mobile and desktop.
- [ ] [TODO] **SW-0686 · P1 · Audit current state** — Lazy-load below-the-fold imagery where it improves performance without hiding critical content.
- [ ] [TODO] **SW-0687 · P1 · Audit current state** — Reserve image dimensions to prevent layout shift.
- [ ] [TODO] **SW-0688 · P1 · Audit current state** — Remove unused assets only after confirming they are not referenced by dynamic routes.
- [ ] [TODO] **SW-0689 · P1 · Audit current state** — Check client bundles for unnecessary duplicate libraries.
- [ ] [TODO] **SW-0690 · P1 · Audit current state** — Check route transitions for avoidable full-page reloading.
- [ ] [TODO] **SW-0691 · P1 · Audit current state** — Verify failed network calls do not leave permanent loading states.
- [ ] [TODO] **SW-0692 · P1 · Audit current state** — Verify the homepage remains useful if a non-critical image fails.
- [ ] [TODO] **SW-0693 · P1 · Audit current state** — Verify the listing page remains useful when optional social links are absent.
- [ ] [TODO] **SW-0694 · P1 · Audit current state** — Run a keyboard-only navigation check across all public routes.
- [ ] [TODO] **SW-0695 · P1 · Audit current state** — Run a screen-reader label check for form inputs and icon-only controls.
- [ ] [TODO] **SW-0696 · P2 · Audit current state** — Check headings use a logical hierarchy.
- [ ] [TODO] **SW-0697 · P2 · Audit current state** — Check focus is visible on buttons, links, tabs, and form controls.
- [ ] [TODO] **SW-0698 · P2 · Audit current state** — Check error messages are associated with the relevant input.
- [ ] [TODO] **SW-0699 · P2 · Audit current state** — Check success messages are announced accessibly where practical.
- [ ] [TODO] **SW-0700 · P2 · Audit current state** — Check colour is not the only signal for verification or errors.
- [ ] [TODO] **SW-0701 · P2 · Audit current state** — Check text zoom at 200 percent for horizontal overflow.
- [ ] [TODO] **SW-0702 · P2 · Audit current state** — Check reduced-motion preferences for non-essential transitions.
- [ ] [TODO] **SW-0703 · P2 · Audit current state** — Check external links do not trap keyboard focus.
- [ ] [TODO] **SW-0704 · P2 · Audit current state** — Check dialogs and menus return focus appropriately when closed.
- [ ] [TODO] **SW-0705 · P2 · Audit current state** — Test the core flow in Firefox and Chromium-based browsers.
- [ ] [TODO] **SW-0706 · P2 · Audit current state** — Test at least one real mobile browser in addition to a simulated viewport when available.
- [ ] [TODO] **SW-0707 · P2 · Audit current state** — Test a low-bandwidth scenario for the preview and listing routes.
- [ ] [TODO] **SW-0708 · P2 · Audit current state** — Check fallback states if the map provider fails.
- [ ] [TODO] **SW-0709 · P2 · Audit current state** — Check date and opening-hours formatting against Nepal local time.
- [ ] [TODO] **SW-0710 · P2 · Audit current state** — Run a broken-link test for public navigation and important internal links.
- [ ] [TODO] **SW-0711 · P2 · Audit current state** — Run a route smoke test after deployment for all core paths.
- [ ] [TODO] **SW-0712 · P2 · Audit current state** — Run a form smoke test after deployment without creating fake public leads that are indistinguishable from real leads.
- [ ] [TODO] **SW-0713 · P2 · Audit current state** — Use a labelled test lead or safe test environment for form testing.
- [ ] [TODO] **SW-0714 · P2 · Audit current state** — Capture console errors and network failures in regression checks.
- [ ] [TODO] **SW-0715 · P2 · Audit current state** — Review Sentry or equivalent error monitoring after meaningful releases.
- [ ] [TODO] **SW-0716 · P3 · Audit current state** — Treat “no errors observed” as limited evidence, not proof of complete correctness.
- [ ] [TODO] **SW-0717 · P3 · Audit current state** — Document a rollback path for a failed production release.
- [ ] [TODO] **SW-0718 · P3 · Audit current state** — Keep a release checklist that covers functionality, content, and phone-width screenshots.
- [ ] [TODO] **SW-0719 · P3 · Audit current state** — Fix production defects before starting another cosmetic redesign.
- [ ] [TODO] **SW-0720 · P3 · Audit current state** — Check caching rules never serve private admin responses to a different user session.

### Workstream 19: English and Nepali localization (items 0721-0760)

**Phase:** 3 - Product reliability  
**Definition of done:** Language switching changes the user-facing experience consistently while preserving the same underlying business facts.

- [ ] [TODO] **SW-0721 · P1 · Audit current state** — Audit the EN/ने language toggle on every public route.
- [ ] [TODO] **SW-0722 · P1 · Audit current state** — Confirm the selected language changes the intended UI labels rather than only changing a button state.
- [ ] [TODO] **SW-0723 · P1 · Audit current state** — List all remaining English-only labels in the Nepali interface.
- [ ] [TODO] **SW-0724 · P1 · Audit current state** — Translate navigation and footer labels into natural Nepali.
- [ ] [TODO] **SW-0725 · P1 · Audit current state** — Translate category names consistently across cards, filters, and page titles.
- [ ] [TODO] **SW-0726 · P1 · Audit current state** — Translate search placeholders and empty states naturally.
- [ ] [TODO] **SW-0727 · P1 · Audit current state** — Translate validation errors and submission success messages.
- [ ] [TODO] **SW-0728 · P1 · Audit current state** — Translate claim and owner-preview messaging without implying owner approval.
- [ ] [TODO] **SW-0729 · P1 · Audit current state** — Translate privacy notes and contact-form instructions accurately.
- [ ] [TODO] **SW-0730 · P1 · Audit current state** — Translate verification labels without overstating the meaning of “checked.”
- [ ] [TODO] **SW-0731 · P1 · Audit current state** — Translate opening-hours notes while preserving exact factual times.
- [ ] [TODO] **SW-0732 · P1 · Audit current state** — Keep business names in their official form unless the business provides a verified alternative.
- [ ] [TODO] **SW-0733 · P1 · Audit current state** — Keep addresses and place names recognisable in both language modes.
- [ ] [TODO] **SW-0734 · P1 · Audit current state** — Choose one standard for Nepali numerals in times and statistics.
- [ ] [TODO] **SW-0735 · P1 · Audit current state** — Choose one standard for date display across English and Nepali.
- [ ] [TODO] **SW-0736 · P2 · Audit current state** — Handle bilingual content when a business only supplies English details.
- [ ] [TODO] **SW-0737 · P2 · Audit current state** — Indicate when a description is unavailable in the selected language rather than generating unsupported facts.
- [ ] [TODO] **SW-0738 · P2 · Audit current state** — Avoid machine-translated wording that sounds unnatural or changes the business claim.
- [ ] [TODO] **SW-0739 · P2 · Audit current state** — Check Nepali search queries against the current category taxonomy.
- [ ] [TODO] **SW-0740 · P2 · Audit current state** — Add transliteration mappings for common Nepali search terms only when useful and tested.
- [ ] [TODO] **SW-0741 · P2 · Audit current state** — Check romanized Nepali searches from real query patterns before prioritising large synonym lists.
- [ ] [TODO] **SW-0742 · P2 · Audit current state** — Ensure toggling the language keeps the current business slug and filters.
- [ ] [TODO] **SW-0743 · P2 · Audit current state** — Ensure language choice persists only as described in the privacy policy.
- [ ] [TODO] **SW-0744 · P2 · Audit current state** — Verify language preference does not unexpectedly leak into server-side lead metadata.
- [ ] [TODO] **SW-0745 · P2 · Audit current state** — Check the language switch with keyboard and screen reader.
- [ ] [TODO] **SW-0746 · P2 · Audit current state** — Check text wrapping for Nepali labels at 320px, 390px, and 430px widths.
- [ ] [TODO] **SW-0747 · P2 · Audit current state** — Check preview pages stay consistent between English and Nepali.
- [ ] [TODO] **SW-0748 · P2 · Audit current state** — Check date, time, and currency format conventions before adding any paid product.
- [ ] [TODO] **SW-0749 · P2 · Audit current state** — Ask a fluent reviewer to proofread high-visibility Nepali copy.
- [ ] [TODO] **SW-0750 · P2 · Audit current state** — Keep terminology for claim, listing, verified, source, and preview consistent.
- [ ] [TODO] **SW-0751 · P2 · Audit current state** — Avoid mixing English headings into Nepali screens without a product reason.
- [ ] [TODO] **SW-0752 · P2 · Audit current state** — Verify page titles and descriptions for each language version if separate URLs are implemented.
- [ ] [TODO] **SW-0753 · P2 · Audit current state** — Do not create hreflang declarations for language variants that share the same URL incorrectly.
- [ ] [TODO] **SW-0754 · P2 · Audit current state** — Check the Nepali version of the About and verification methodology pages.
- [ ] [TODO] **SW-0755 · P2 · Audit current state** — Check the Nepali version of the lead form and privacy text.
- [ ] [TODO] **SW-0756 · P3 · Audit current state** — Check the Nepali version of the business owner pitch with a local business reader.
- [ ] [TODO] **SW-0757 · P3 · Audit current state** — Record an approved glossary so future design prompts do not invent new translations.
- [ ] [TODO] **SW-0758 · P3 · Audit current state** — Use screenshots to review text clipping after every material localization change.
- [ ] [TODO] **SW-0759 · P3 · Audit current state** — Track user-visible language defects as specific tasks rather than vague “translation improvements.”
- [ ] [TODO] **SW-0760 · P3 · Audit current state** — Keep language parity as a release criterion for core conversion routes.

### Workstream 20: Security, privacy, and safe public data handling (items 0761-0800)

**Phase:** 3 - Product reliability  
**Definition of done:** Public pages, forms, admin, location handling, and exports respect the stated privacy and security model.

- [ ] [REVIEW] **SW-0761 · P0 · Admin area reported; regression-test access boundary** — Verify the /admin area redirects unauthorised visitors to a safe authentication state.
- [ ] [TODO] **SW-0762 · P0 · Audit current state** — Verify an unauthenticated request cannot access lead data through a direct API call.
- [ ] [TODO] **SW-0763 · P0 · Audit current state** — Verify an authenticated but unauthorised user cannot change admin data.
- [ ] [TODO] **SW-0764 · P0 · Audit current state** — Check database row-level security policies for every table that holds leads or private notes.
- [ ] [TODO] **SW-0765 · P0 · Audit current state** — Check public read access exposes only fields intended for listing pages.
- [ ] [TODO] **SW-0766 · P0 · Audit current state** — Check public write access is limited to validated form actions.
- [ ] [TODO] **SW-0767 · P0 · Audit current state** — Review Supabase keys and ensure a service-role key is never shipped to the browser.
- [ ] [TODO] **SW-0768 · P0 · Audit current state** — Review environment variables used in the production build.
- [ ] [TODO] **SW-0769 · P0 · Audit current state** — Remove secrets, credentials, private tokens, and internal admin URLs from logs and public assets.
- [ ] [TODO] **SW-0770 · P0 · Audit current state** — Ensure password reset and admin session flows behave safely.
- [ ] [TODO] **SW-0771 · P1 · Audit current state** — Review session expiry and logout behaviour.
- [ ] [TODO] **SW-0772 · P1 · Audit current state** — Verify admin pages are not indexable by search engines.
- [ ] [TODO] **SW-0773 · P1 · Audit current state** — Keep noindex separate from access control; never rely on robots.txt to protect private data.
- [ ] [TODO] **SW-0774 · P1 · Audit current state** — Check direct URLs to lead details require authorisation.
- [ ] [TODO] **SW-0775 · P1 · Audit current state** — Review API rate limits for form endpoints.
- [ ] [TODO] **SW-0776 · P1 · Audit current state** — Sanitise and validate user-supplied text before rendering it in the admin.
- [ ] [TODO] **SW-0777 · P1 · Audit current state** — Validate URLs to reduce XSS, phishing, and unsafe redirect risks.
- [ ] [TODO] **SW-0778 · P1 · Audit current state** — Escape exported CSV fields that could be interpreted as spreadsheet formulas.
- [ ] [TODO] **SW-0779 · P1 · Audit current state** — Check third-party analytics do not receive raw form messages or contact data.
- [ ] [TODO] **SW-0780 · P1 · Audit current state** — Check precise browser geolocation is not sent to the server contrary to the privacy statement.
- [ ] [TODO] **SW-0781 · P1 · Audit current state** — Check location permission is requested only after a clear user action.
- [ ] [TODO] **SW-0782 · P1 · Audit current state** — Check “location stays on this device” matches actual network and analytics behaviour.
- [ ] [TODO] **SW-0783 · P2 · Audit current state** — Document the types of data saved by each form.
- [ ] [TODO] **SW-0784 · P2 · Audit current state** — Document which provider receives each form field and for what purpose.
- [ ] [TODO] **SW-0785 · P2 · Audit current state** — Set retention periods for rejected, stale, and won/lost leads.
- [ ] [TODO] **SW-0786 · P2 · Audit current state** — Implement a deletion procedure for contact data no longer needed.
- [ ] [TODO] **SW-0787 · P2 · Audit current state** — Provide a practical path for privacy requests using the public contact channel.
- [ ] [TODO] **SW-0788 · P2 · Audit current state** — Review third-party map, hosting, analytics, email, and error-monitoring dependencies.
- [ ] [TODO] **SW-0789 · P2 · Audit current state** — Update the privacy policy if any data flow changes materially.
- [ ] [TODO] **SW-0790 · P2 · Audit current state** — Check that public business contact data has a legitimate public source.
- [ ] [TODO] **SW-0791 · P2 · Audit current state** — Avoid publishing private individual's personal details as business contact information without a clear basis.
- [ ] [TODO] **SW-0792 · P2 · Audit current state** — Review preview pages for data copied from the wrong listing or from internal notes.
- [ ] [TODO] **SW-0793 · P2 · Audit current state** — Make backup access restricted and test a restore procedure.
- [ ] [TODO] **SW-0794 · P2 · Audit current state** — Review dependency alerts and patch material security vulnerabilities.
- [ ] [TODO] **SW-0795 · P2 · Audit current state** — Create a security incident checklist for leaked lead data or unauthorised admin access.
- [ ] [TODO] **SW-0796 · P2 · Audit current state** — Verify anti-spam logs are minimal and have a defined retention period.
- [ ] [TODO] **SW-0797 · P2 · Audit current state** — Check contact forms do not reveal whether a specific private email address exists.
- [ ] [TODO] **SW-0798 · P3 · Audit current state** — Document who has access to admin and how access is revoked.
- [ ] [TODO] **SW-0799 · P3 · Audit current state** — Perform a release security review before adding payments or customer accounts.
- [ ] [TODO] **SW-0800 · P3 · Audit current state** — Test whether admin logout or session expiry blocks subsequent protected requests as intended.

### Workstream 21: Admin verification tooling and operational queue (items 0801-0840)

**Phase:** 3 - Product reliability  
**Definition of done:** The operator can keep listings and sales prospects accurate without manual spreadsheet chaos or unsafe direct edits.

- [ ] [TODO] **SW-0801 · P1 · Audit current state** — Audit whether a listing-review queue already exists before building another admin screen.
- [ ] [TODO] **SW-0802 · P1 · Audit current state** — Create a combined queue for missing critical fields and stale source checks if no equivalent exists.
- [ ] [TODO] **SW-0803 · P1 · Audit current state** — Show priority reasons for each queued record.
- [ ] [TODO] **SW-0804 · P1 · Audit current state** — Sort the queue by risk to user trust and conversion impact.
- [ ] [TODO] **SW-0805 · P1 · Audit current state** — Separate data corrections from website-sales prospect review.
- [ ] [TODO] **SW-0806 · P1 · Audit current state** — Show each listing's source URL beside the field being reviewed.
- [ ] [TODO] **SW-0807 · P1 · Audit current state** — Show the last checked date beside each relevant field.
- [ ] [TODO] **SW-0808 · P1 · Audit current state** — Allow a reviewer to mark a field as verified only after recording evidence.
- [ ] [TODO] **SW-0809 · P1 · Audit current state** — Allow a reviewer to mark a field unknown without forcing a guess.
- [ ] [TODO] **SW-0810 · P1 · Audit current state** — Allow a reviewer to defer an item and record a reason.
- [ ] [TODO] **SW-0811 · P1 · Audit current state** — Allow assignment of a review item if more operators join.
- [ ] [TODO] **SW-0812 · P1 · Audit current state** — Prevent one review queue item from being silently completed twice.
- [ ] [TODO] **SW-0813 · P1 · Audit current state** — Keep an audit record when a verified value changes.
- [ ] [TODO] **SW-0814 · P1 · Audit current state** — Provide a comparison view for old value, candidate value, and source evidence.
- [ ] [TODO] **SW-0815 · P1 · Audit current state** — Flag listing records with no usable public contact action.
- [ ] [TODO] **SW-0816 · P2 · Audit current state** — Flag listing records with a conflicting phone or address across sources.
- [ ] [TODO] **SW-0817 · P2 · Audit current state** — Flag duplicate candidates based on normalized name, location, and domain.
- [ ] [TODO] **SW-0818 · P2 · Audit current state** — Flag suspected branch relationships separately from duplicates.
- [ ] [TODO] **SW-0819 · P2 · Audit current state** — Flag broken source URLs for review.
- [ ] [TODO] **SW-0820 · P2 · Audit current state** — Flag stale hours ahead of holiday periods.
- [ ] [TODO] **SW-0821 · P2 · Audit current state** — Flag website prospect labels that are older than the configured check window.
- [ ] [TODO] **SW-0822 · P2 · Audit current state** — Provide a bulk-review screen for low-risk fields without bypassing validation.
- [ ] [TODO] **SW-0823 · P2 · Audit current state** — Require individual review for changes to canonical URLs or branch identity.
- [ ] [TODO] **SW-0824 · P2 · Audit current state** — Keep publication status separate from verification status.
- [ ] [TODO] **SW-0825 · P2 · Audit current state** — Support unpublishing a record while retaining its audit history.
- [ ] [TODO] **SW-0826 · P2 · Audit current state** — Support reinstating a record after a successful recheck.
- [ ] [TODO] **SW-0827 · P2 · Audit current state** — Record the reason a business was removed or merged.
- [ ] [TODO] **SW-0828 · P2 · Audit current state** — Export review tasks with IDs and evidence links for offline review when necessary.
- [ ] [TODO] **SW-0829 · P2 · Audit current state** — Import reviewed changes through a validated process rather than blind database overwrites.
- [ ] [TODO] **SW-0830 · P2 · Audit current state** — Test admin filtering and pagination with a much larger dataset than the current one.
- [ ] [TODO] **SW-0831 · P2 · Audit current state** — Keep private sales notes out of the listing-review export.
- [ ] [TODO] **SW-0832 · P2 · Audit current state** — Show duplicate counts and unresolved conflict counts on the admin dashboard.
- [ ] [TODO] **SW-0833 · P2 · Audit current state** — Track review throughput and rework rate to measure operational quality.
- [ ] [TODO] **SW-0834 · P2 · Audit current state** — Keep an emergency view for records reported closed or dangerously wrong.
- [ ] [TODO] **SW-0835 · P2 · Audit current state** — Make admin error messages actionable without exposing secrets.
- [ ] [TODO] **SW-0836 · P3 · Audit current state** — Test the admin on a phone for quick corrections, but optimise for safe review not visual novelty.
- [ ] [TODO] **SW-0837 · P3 · Audit current state** — Document the workflow for publishing a new candidate listing.
- [ ] [TODO] **SW-0838 · P3 · Audit current state** — Document the workflow for correcting a currently public listing.
- [ ] [TODO] **SW-0839 · P3 · Audit current state** — Document the workflow for marking a business inactive or closed.
- [ ] [TODO] **SW-0840 · P3 · Audit current state** — Only create additional admin tools when the current process shows a measurable bottleneck.

### Workstream 22: Claim flow and business-owner self-service (items 0841-0880)

**Phase:** 4 - Conditional business products  
**Definition of done:** A legitimate owner can ask to claim a listing without confusing that request with a website purchase or changing public data unchecked.

- [ ] [REVIEW] **SW-0841 · P1 · Claim capture reported; regression-test** — Audit the existing claim buttons and database writes before changing the claim experience.
- [ ] [REVIEW] **SW-0842 · P1 · Claim capture reported; regression-test** — Verify a claim request records the correct listing ID and business slug.
- [ ] [REVIEW] **SW-0843 · P1 · Claim capture reported; regression-test** — Verify a claim request appears in the admin pipeline with its claim source label.
- [x] [DONE] **SW-0844 · P1 · Audit current state** — Separate “claim this business” from “request a website quote.” Shipped by GuideBook bot, 26-31 Oct 2026.
- [ ] [TODO] **SW-0845 · P1 · Audit current state** — Explain that claiming a listing is not the same as buying a website.
- [ ] [TODO] **SW-0846 · P1 · Audit current state** — Define the minimum evidence required to verify an owner or authorised manager.
- [ ] [TODO] **SW-0847 · P1 · Audit current state** — Evaluate verification options such as official-domain email, business phone, or documented manual review.
- [ ] [TODO] **SW-0848 · P1 · Audit current state** — Avoid using a phone number as a public owner identifier.
- [ ] [TODO] **SW-0849 · P1 · Audit current state** — Create a pending-claim state before showing an owner-verified badge.
- [ ] [TODO] **SW-0850 · P1 · Audit current state** — Prevent two competing claimants from editing the same business without review.
- [ ] [TODO] **SW-0851 · P2 · Audit current state** — Create a review process for branch managers claiming one location of a chain.
- [ ] [TODO] **SW-0852 · P2 · Audit current state** — Keep brand-level management separate from branch-level details when appropriate.
- [ ] [TODO] **SW-0853 · P2 · Audit current state** — Allow an owner to submit corrected hours without making them public immediately.
- [ ] [TODO] **SW-0854 · P2 · Audit current state** — Allow an owner to submit a corrected phone number with review state.
- [ ] [TODO] **SW-0855 · P2 · Audit current state** — Allow an owner to submit a website URL with link-safety validation.
- [ ] [TODO] **SW-0856 · P2 · Audit current state** — Allow an owner to submit photos only with a clear rights/permission statement.
- [ ] [TODO] **SW-0857 · P2 · Audit current state** — Allow an owner to request removal of an inaccurate or unwanted preview.
- [ ] [TODO] **SW-0858 · P2 · Audit current state** — Show the owner which changes are pending review.
- [ ] [TODO] **SW-0859 · P2 · Audit current state** — Notify an owner of an approved or rejected claim only through an approved channel.
- [ ] [TODO] **SW-0860 · P2 · Audit current state** — Record the basis for approval without storing unnecessary personal documents.
- [ ] [TODO] **SW-0861 · P2 · Audit current state** — Define how long a claim can remain pending before it is closed.
- [ ] [TODO] **SW-0862 · P2 · Audit current state** — Provide a way to reopen a claim when new proof is supplied.
- [ ] [TODO] **SW-0863 · P2 · Audit current state** — Prevent an unverified owner from changing verification status or source records.
- [ ] [TODO] **SW-0864 · P2 · Audit current state** — Keep the public “owner verified” badge distinct from field-level data checked.
- [ ] [TODO] **SW-0865 · P2 · Audit current state** — Keep the current contact-only pathway available for owners who do not want an account.
- [ ] [TODO] **SW-0866 · P2 · Audit current state** — Avoid forcing consumer accounts for saving places or browsing the directory.
- [ ] [TODO] **SW-0867 · P2 · Audit current state** — Delay a full owner dashboard until enough owners need repeated self-service.
- [ ] [TODO] **SW-0868 · P2 · Audit current state** — Prototype owner edits using the current data model before introducing account complexity.
- [ ] [TODO] **SW-0869 · P2 · Audit current state** — Test claim requests in English and Nepali.
- [ ] [TODO] **SW-0870 · P2 · Audit current state** — Test claim-flow phone layout and success messaging.
- [ ] [TODO] **SW-0871 · P2 · Audit current state** — Test anti-spam protection without preventing genuine owners from claiming.
- [ ] [TODO] **SW-0872 · P2 · Audit current state** — Create a conflict-resolution policy for disputed business ownership.
- [ ] [TODO] **SW-0873 · P2 · Audit current state** — Create a process for former owners or managers to lose access safely.
- [ ] [TODO] **SW-0874 · P2 · Audit current state** — Track claim completion rate and median time to review.
- [ ] [TODO] **SW-0875 · P2 · Audit current state** — Track how many claimed listings lead to paid website enquiries without conflating correlation with causation.
- [ ] [TODO] **SW-0876 · P2 · Audit current state** — Interview a few business owners before expanding self-service features.
- [ ] [TODO] **SW-0877 · P2 · Audit current state** — Define an owner dashboard launch gate based on repeated manual work and active claim volume.
- [ ] [TODO] **SW-0878 · P2 · Audit current state** — Keep claim features separate from paid ranking promises.
- [ ] [TODO] **SW-0879 · P2 · Audit current state** — Ensure all claimed-business pages still show sourced facts and correction options.
- [ ] [TODO] **SW-0880 · P2 · Audit current state** — Do not build a complex owner account system until real usage justifies it.

### Workstream 23: Paid listings: validation before implementation (items 0881-0920)

**Phase:** 4 - Conditional business products  
**Definition of done:** Paid placement is tested with real owners and a transparent value proposition before prices, payments, or ranking rules go live.

- [ ] [TODO] **SW-0881 · P3 · Conditional; do not launch without owner approval** — Keep paid listing implementation behind a product-decision gate rather than starting with checkout code.
- [ ] [TODO] **SW-0882 · P3 · Conditional; do not launch without owner approval** — Write the customer problem a featured listing is supposed to solve.
- [ ] [TODO] **SW-0883 · P3 · Conditional; do not launch without owner approval** — Write the customer problem a paid verification badge is supposed to solve separately.
- [ ] [TODO] **SW-0884 · P3 · Conditional; do not launch without owner approval** — Define exactly what a featured placement changes in the user experience.
- [ ] [TODO] **SW-0885 · P3 · Conditional; do not launch without owner approval** — Define exactly what a paid verified badge would mean and what it would not mean.
- [ ] [TODO] **SW-0886 · P3 · Conditional; do not launch without owner approval** — Keep factual data verification independent from payment status.
- [ ] [TODO] **SW-0887 · P3 · Conditional; do not launch without owner approval** — Do not let a payment buy a stronger factual verification result.
- [ ] [TODO] **SW-0888 · P3 · Conditional; do not launch without owner approval** — Label sponsored or featured placements clearly if they are eventually launched.
- [ ] [TODO] **SW-0889 · P3 · Conditional; do not launch without owner approval** — Do not publish a price until the owner approves it explicitly.
- [ ] [TODO] **SW-0890 · P3 · Conditional; do not launch without owner approval** — Prepare a pricing research worksheet without pre-filling invented amounts.
- [ ] [TODO] **SW-0891 · P3 · Conditional; do not launch without owner approval** — Interview business owners about visibility, enquiries, and current marketing pain.
- [ ] [TODO] **SW-0892 · P3 · Conditional; do not launch without owner approval** — Ask owners whether they would pay for a specific measurable benefit rather than a badge alone.
- [ ] [TODO] **SW-0893 · P3 · Conditional; do not launch without owner approval** — Test a mock featured placement without charging money or changing public rankings.
- [ ] [TODO] **SW-0894 · P3 · Conditional; do not launch without owner approval** — Test owner understanding of the free listing versus paid placement difference.
- [ ] [TODO] **SW-0895 · P3 · Conditional; do not launch without owner approval** — Document the criteria for eligible featured listings.
- [ ] [TODO] **SW-0896 · P3 · Conditional; do not launch without owner approval** — Document whether all categories can buy featured placements or whether some are excluded.
- [ ] [TODO] **SW-0897 · P3 · Conditional; do not launch without owner approval** — Set a fair rotation or relevance rule if multiple owners sponsor the same category.
- [ ] [TODO] **SW-0898 · P3 · Conditional; do not launch without owner approval** — Prevent sponsored placements from masquerading as organic verification results.
- [ ] [TODO] **SW-0899 · P3 · Conditional; do not launch without owner approval** — Define impression, click, and lead metrics for a featured placement.
- [ ] [TODO] **SW-0900 · P3 · Conditional; do not launch without owner approval** — Define what reporting a paying owner receives.
- [ ] [TODO] **SW-0901 · P3 · Conditional; do not launch without owner approval** — Set a minimum active audience or lead volume gate before accepting paid listing payments.
- [ ] [TODO] **SW-0902 · P3 · Conditional; do not launch without owner approval** — Estimate the support burden of selling and maintaining paid listings.
- [ ] [TODO] **SW-0903 · P3 · Conditional; do not launch without owner approval** — Estimate payment-provider, tax, refund, and reconciliation requirements with qualified advice where needed.
- [ ] [TODO] **SW-0904 · P3 · Conditional; do not launch without owner approval** — Evaluate eSewa and Khalti only when payment scope and commercial terms are approved.
- [ ] [TODO] **SW-0905 · P3 · Conditional; do not launch without owner approval** — Do not store raw payment-card details in Sewa.
- [ ] [TODO] **SW-0906 · P3 · Conditional; do not launch without owner approval** — Define cancellation and refund rules before accepting subscription payments.
- [ ] [TODO] **SW-0907 · P3 · Conditional; do not launch without owner approval** — Define how unpaid, cancelled, or failed subscriptions affect feature visibility.
- [ ] [TODO] **SW-0908 · P3 · Conditional; do not launch without owner approval** — Define a dispute path for sponsored content and ranking.
- [ ] [TODO] **SW-0909 · P3 · Conditional; do not launch without owner approval** — Check local legal and consumer-protection obligations before launch.
- [ ] [TODO] **SW-0910 · P3 · Conditional; do not launch without owner approval** — Build a non-production prototype to validate the purchase flow before connecting live payments.
- [ ] [TODO] **SW-0911 · P3 · Conditional; do not launch without owner approval** — Test payment success, failure, duplicate callback, and refund states before launch.
- [ ] [TODO] **SW-0912 · P3 · Conditional; do not launch without owner approval** — Verify payment status server-side rather than trusting a client redirect.
- [ ] [TODO] **SW-0913 · P3 · Conditional; do not launch without owner approval** — Log payment events without leaking sensitive payment credentials.
- [ ] [TODO] **SW-0914 · P3 · Conditional; do not launch without owner approval** — Create a reconciliation report comparing provider transactions with subscription records.
- [ ] [TODO] **SW-0915 · P3 · Conditional; do not launch without owner approval** — Prepare clear terms for what the paid listing actually includes.
- [ ] [TODO] **SW-0916 · P3 · Conditional; do not launch without owner approval** — Ensure free listings remain useful and are not intentionally degraded to force payment.
- [ ] [TODO] **SW-0917 · P3 · Conditional; do not launch without owner approval** — Run a small opt-in pilot with explicit owner approval before general release.
- [ ] [TODO] **SW-0918 · P3 · Conditional; do not launch without owner approval** — Compare renewal, cancellation, and owner satisfaction after the pilot.
- [ ] [TODO] **SW-0919 · P3 · Conditional; do not launch without owner approval** — Launch paid listings only after pricing, value, fulfilment, compliance, and support are approved.
- [ ] [TODO] **SW-0920 · P3 · Conditional; do not launch without owner approval** — Define how a sponsored placement is paused when a listing is closed, disputed, or under factual review.

### Workstream 24: Bookings: discovery and deferred readiness gate (items 0921-0960)

**Phase:** 5 - Later, conditional product  
**Definition of done:** Bookings remain unbuilt until traffic, owner participation, operational capacity, and demand prove that booking complexity is worthwhile.

- [ ] [TODO] **SW-0921 · P3 · Deferred by plan; research only until launch gate** — Keep bookings marked as deferred in the current product roadmap.
- [ ] [TODO] **SW-0922 · P3 · Deferred by plan; research only until launch gate** — Measure whether users currently ask to book through Sewa rather than merely viewing contact details.
- [ ] [TODO] **SW-0923 · P3 · Deferred by plan; research only until launch gate** — Measure whether business owners want bookings inside Sewa or prefer their existing systems.
- [ ] [TODO] **SW-0924 · P3 · Deferred by plan; research only until launch gate** — Interview target businesses about appointment availability and booking pain before implementation.
- [ ] [TODO] **SW-0925 · P3 · Deferred by plan; research only until launch gate** — Separate appointment bookings from table reservations and hotel-room reservations in the product research.
- [ ] [TODO] **SW-0926 · P3 · Deferred by plan; research only until launch gate** — Identify which initial category has a repeated, clearly evidenced booking need.
- [ ] [TODO] **SW-0927 · P3 · Deferred by plan; research only until launch gate** — Avoid building a generic booking engine for every category at once.
- [ ] [TODO] **SW-0928 · P3 · Deferred by plan; research only until launch gate** — Map the smallest viable booking journey for one candidate category.
- [ ] [TODO] **SW-0929 · P3 · Deferred by plan; research only until launch gate** — Define who is responsible for confirming, rescheduling, and cancelling a booking.
- [ ] [TODO] **SW-0930 · P3 · Deferred by plan; research only until launch gate** — Define how a business owner will receive booking notifications.
- [ ] [TODO] **SW-0931 · P3 · Deferred by plan; research only until launch gate** — Define what happens if an owner does not respond.
- [ ] [TODO] **SW-0932 · P3 · Deferred by plan; research only until launch gate** — Define booking time zones and Nepal local time handling.
- [ ] [TODO] **SW-0933 · P3 · Deferred by plan; research only until launch gate** — Define business-specific opening hours and unavailable time slots.
- [ ] [TODO] **SW-0934 · P3 · Deferred by plan; research only until launch gate** — Define whether a booking is a request or an instant confirmation.
- [ ] [TODO] **SW-0935 · P3 · Deferred by plan; research only until launch gate** — Do not display confirmed availability unless live capacity data supports it.
- [ ] [TODO] **SW-0936 · P3 · Deferred by plan; research only until launch gate** — Define how duplicate requests and accidental double bookings are prevented.
- [ ] [TODO] **SW-0937 · P3 · Deferred by plan; research only until launch gate** — Define a cancellation and no-show policy before taking any deposits.
- [ ] [TODO] **SW-0938 · P3 · Deferred by plan; research only until launch gate** — Do not take payments for bookings until payment, refund, and dispute handling are approved.
- [ ] [TODO] **SW-0939 · P3 · Deferred by plan; research only until launch gate** — Define what user information is required to request a booking.
- [ ] [TODO] **SW-0940 · P3 · Deferred by plan; research only until launch gate** — Define how long booking contact details are retained.
- [ ] [TODO] **SW-0941 · P3 · Deferred by plan; research only until launch gate** — Define how businesses consent to receiving and processing booking information.
- [ ] [TODO] **SW-0942 · P3 · Deferred by plan; research only until launch gate** — Define a business workflow for confirming or rejecting a request.
- [ ] [TODO] **SW-0943 · P3 · Deferred by plan; research only until launch gate** — Define a consumer workflow for receiving a booking status update.
- [ ] [TODO] **SW-0944 · P3 · Deferred by plan; research only until launch gate** — Prototype the booking request form without promising real-time availability.
- [ ] [TODO] **SW-0945 · P3 · Deferred by plan; research only until launch gate** — Test the concept with a small group of consenting businesses.
- [ ] [TODO] **SW-0946 · P3 · Deferred by plan; research only until launch gate** — Test whether existing WhatsApp or phone booking is already sufficient for those businesses.
- [ ] [TODO] **SW-0947 · P3 · Deferred by plan; research only until launch gate** — Estimate the support workload per booking before promising a service level.
- [ ] [TODO] **SW-0948 · P3 · Deferred by plan; research only until launch gate** — Define how booking failures are monitored and resolved.
- [ ] [TODO] **SW-0949 · P3 · Deferred by plan; research only until launch gate** — Define the minimum business-side response rate required for launch.
- [ ] [TODO] **SW-0950 · P3 · Deferred by plan; research only until launch gate** — Define the minimum recurring booking demand required for launch.
- [ ] [TODO] **SW-0951 · P3 · Deferred by plan; research only until launch gate** — Define the minimum number of participating businesses required for a useful pilot.
- [ ] [TODO] **SW-0952 · P3 · Deferred by plan; research only until launch gate** — Define how bookings will be attributed to the business without exposing unnecessary personal data.
- [ ] [TODO] **SW-0953 · P3 · Deferred by plan; research only until launch gate** — Define how booking disputes and user complaints will be handled.
- [ ] [TODO] **SW-0954 · P3 · Deferred by plan; research only until launch gate** — Check local privacy, consumer, and payment obligations before building.
- [ ] [TODO] **SW-0955 · P3 · Deferred by plan; research only until launch gate** — Create a rollback or disable switch for an initial booking pilot.
- [ ] [TODO] **SW-0956 · P3 · Deferred by plan; research only until launch gate** — Do not advertise a booking feature before the full journey has passed production tests.
- [ ] [TODO] **SW-0957 · P3 · Deferred by plan; research only until launch gate** — Do not build availability calendar complexity until demand and workflows are validated.
- [ ] [TODO] **SW-0958 · P3 · Deferred by plan; research only until launch gate** — Re-evaluate booking priority at a formal roadmap review rather than by habit.
- [ ] [TODO] **SW-0959 · P3 · Deferred by plan; research only until launch gate** — Keep “contact the business” available if booking is unavailable or fails.
- [ ] [TODO] **SW-0960 · P3 · Deferred by plan; research only until launch gate** — Define a manual fallback when a booking notification is delayed or fails.

### Workstream 25: Growth channels, partnerships, and content that supports conversion (items 0961-0980)

**Phase:** 5 - Growth and scale  
**Definition of done:** Growth work drives qualified visitors and business leads without producing low-value pages or unsupported marketing claims.

- [ ] [TODO] **SW-0961 · P1 · Audit current state** — Set a baseline of qualified enquiries before spending time on broad traffic growth.
- [ ] [TODO] **SW-0962 · P1 · Audit current state** — Identify the top three audience intents the current inventory can genuinely serve.
- [ ] [TODO] **SW-0963 · P1 · Audit current state** — Create a short launch message that explains Sewa's trust angle and Boxont's business website offer.
- [ ] [TODO] **SW-0964 · P1 · Audit current state** — Prepare a business-owner outreach one-pager without prices until those are approved.
- [ ] [TODO] **SW-0965 · P1 · Audit current state** — Create a one-page explanation of the free-preview process for owners.
- [ ] [TODO] **SW-0966 · P1 · Audit current state** — Create a concise guide for local businesses on why phone-friendly pages matter.
- [ ] [TODO] **SW-0967 · P1 · Audit current state** — Create a factual article explaining how Sewa checks public business details.
- [ ] [TODO] **SW-0968 · P1 · Audit current state** — Create a case-study template for a consenting business after a real website launches.
- [ ] [TODO] **SW-0969 · P2 · Audit current state** — Ask for explicit permission before publishing any business owner's name as a customer.
- [ ] [TODO] **SW-0970 · P2 · Audit current state** — Capture before/after website screenshots only when rights and consent are clear.
- [ ] [TODO] **SW-0971 · P2 · Audit current state** — Avoid claiming sales uplift from a redesign without measured evidence.
- [ ] [TODO] **SW-0972 · P2 · Audit current state** — Identify Nepal business associations or local groups that may welcome a useful directory resource.
- [ ] [TODO] **SW-0973 · P2 · Audit current state** — Prepare a partnership pitch focused on accurate local information, not spam promotion.
- [ ] [TODO] **SW-0974 · P2 · Audit current state** — Explore partnerships with tourism or local-information groups where the audience fits.
- [ ] [TODO] **SW-0975 · P2 · Audit current state** — Create a way for a partner to suggest a business for verification.
- [ ] [TODO] **SW-0976 · P2 · Audit current state** — Do not accept bulk partner data without source and permission review.
- [ ] [TODO] **SW-0977 · P2 · Audit current state** — Create a public “suggest a business” pathway once moderation can support it.
- [ ] [TODO] **SW-0978 · P2 · Audit current state** — Keep “suggest a correction” separate from “add a missing business.”
- [ ] [TODO] **SW-0979 · P2 · Audit current state** — Create shareable category and neighbourhood pages only where they have meaningful coverage.
- [ ] [TODO] **SW-0980 · P2 · Audit current state** — Prepare short organic social posts that direct owners to the preview funnel without false urgency.

### Workstream 26: Codebase, release management, and long-term scalability (items 0981-1000)

**Phase:** 5 - Growth and scale  
**Definition of done:** The production path is understood, critical changes are reversible, and the system can grow without turning every edit into a risky redesign.

- [ ] [TODO] **SW-0981 · P1 · Audit current state** — Confirm the canonical GitHub repository for the live production site before editing code.
- [ ] [TODO] **SW-0982 · P1 · Audit current state** — Confirm the production branch and branch-protection policy before pushing changes.
- [ ] [TODO] **SW-0983 · P1 · Audit current state** — Confirm which Vercel project and domain receive production deployments.
- [ ] [TODO] **SW-0984 · P1 · Audit current state** — Confirm the production Supabase project is the intended owner-controlled database.
- [ ] [TODO] **SW-0985 · P1 · Audit current state** — Document how GitHub changes reach Vercel in the current deployment pipeline.
- [ ] [TODO] **SW-0986 · P1 · Audit current state** — Document how to identify whether a commit is live on the production domain.
- [ ] [TODO] **SW-0987 · P1 · Audit current state** — Keep a changelog for public conversion and data-model changes.
- [ ] [TODO] **SW-0988 · P1 · Audit current state** — Use a feature branch for substantial changes rather than experimenting directly on production.
- [ ] [TODO] **SW-0989 · P2 · Audit current state** — Define required checks before merging a feature branch.
- [ ] [TODO] **SW-0990 · P2 · Audit current state** — Add a smoke test for the homepage route.
- [ ] [TODO] **SW-0991 · P2 · Audit current state** — Add a smoke test for a category route.
- [ ] [TODO] **SW-0992 · P2 · Audit current state** — Add a smoke test for a neighbourhood route.
- [ ] [TODO] **SW-0993 · P2 · Audit current state** — Add a smoke test for a business listing route.
- [ ] [TODO] **SW-0994 · P2 · Audit current state** — Add a smoke test for the website-preview route.
- [ ] [TODO] **SW-0995 · P2 · Audit current state** — Add a smoke test for the For Businesses route.
- [ ] [TODO] **SW-0996 · P2 · Audit current state** — Add a smoke test for the admin authentication boundary.
- [ ] [TODO] **SW-0997 · P2 · Audit current state** — Add a safe test for form persistence and attribution.
- [ ] [TODO] **SW-0998 · P2 · Audit current state** — Add a safe test for the core lead-stage transitions.
- [ ] [TODO] **SW-0999 · P2 · Audit current state** — Keep production seed/test records clearly marked so they do not look like real customers.
- [ ] [TODO] **SW-1000 · P2 · Audit current state** — Document the database schema for listings, fields, sources, leads, and claims.