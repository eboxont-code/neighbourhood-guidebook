# SEWA shared website preview audit — 7 November 2026

## Scope

This is an audit of the shared `/s/:slug/website-preview` experience and the current 18 preview-eligible business records. The route is shared; the 18 count is the current offer/eligibility set, not a limit on which published records can resolve through the route.

The full checklist contains 1,000 unique criteria, with exactly 1 point available per criterion. A criterion earns its point only when marked PASS.

## Evidence status at this checkpoint

| Status | Criteria |
|---|---:|
| PASS | 41 |
| FAIL | 13 |
| NOT TESTED | 946 |
| **Total** | **1,000** |

- Evidence coverage: **54/1,000 = 5.4%**
- Points earned: **41/1,000**
- Pass ratio among reviewed criteria: **41/54 = 75.9%**

This is an interim evidence score, not a final grade. PASS evidence includes source-code, automated-test and data evidence; it must not be represented as 54 live browser/device checks.

## Published listing data snapshot

52 published businesses across 8 categories:

| Field | Populated |
|---|---:|
| Description | 18/52 |
| Services | 0/52 |
| Opening hours | 37/52 (22 verified, 15 unverified) |
| Cover image | 2/52 |
| Address | 51/52 |
| Phone | 52/52 |
| WhatsApp | 5/52 |
| Website URL | 36/52 |
| Social profile | 16/52 |
| Directions URL | 33/52 |
| Coordinates | 21/52 |
| Last checked date | 34/52 |
| Field-level source provenance | 0/52 |
| Business-confirmed records | 0/52 |

### Current preview-eligible records (18)

| Category | Eligible |
|---|---:|
| Barbers | 4 |
| Café | 1 |
| Clinic | 1 |
| Gyms | 4 |
| Restaurant | 1 |
| Salons | 4 |
| Spas | 3 |
| Hotels | 0 |

Among these 18: descriptions 5/18; services 0/18; cover images 0/18; opening hours 13/18 (7 verified, 6 unverified); WhatsApp 0/18; social profiles 11/18; coordinates 5/18; address 17/18; phone 18/18.

## High-impact findings

1. Four preview offers have stale or false-negative website status based on official web evidence: H2O Athletics, Nuad Thai, TONI&GUY Kathmandu and Femina Flaunt. Reconcile the official website/contact facts before changing production records.
2. The 18 eligible previews currently have no recorded services or cover images; all render generated category artwork.
3. Only 5 of the 18 eligible records have descriptions.
4. Six of the 13 eligible records with hours have unverified hours.
5. The shared template does not currently render the service price field.
6. Mobile section-jump navigation is hidden below the large breakpoint without a phone alternative.
7. There are no category-specific content modules (for example gym classes, restaurant menus, clinic practitioners or hotel rooms).
8. No direct email action and no multi-image gallery are supported.

## Analytics snapshot

Across the 18 eligible records: 4 preview-view events across 3 businesses; 0 CTA clicks; 0 enquiry submissions. Cafe Deja Vu had 2 views; Fitness Studio Nepal and Serene Salon & Spa had 1 each. The sample is too small to infer a conversion rate.

## Verification and limitations

- Production runtime errors: none reported in the last 7 days at the time of review.
- GitHub SEWA Quality Gate run `42217060656` passed migration/security tests, TypeScript, lint, unit/component tests and production build.
- The production preview route could not be visually fetched in the research browser; no claim is made that a live visual/device review was completed in this checkpoint.
- No production database updates, migrations, deployments or outreach were performed as part of this audit.

## Recommended next work

1. Correct the four website-status false negatives only after reconciling official branch/contact facts.
2. Verify business details for the 18 eligible candidates, prioritising hours, address, services, imagery and source provenance.
3. Add visible service prices where present in the data model.
4. Provide a mobile-friendly section navigation alternative.
5. Add category-specific preview content only when trustworthy business data exists.
6. Continue testing the remaining 946 criteria in controlled batches and record evidence for every status change.

## Source and export note

The complete, Git-tracked 1,000-row checklist is in [`1000-POINT-CHECKLIST.md`](./1000-POINT-CHECKLIST.md). It preserves every criterion ID, status, priority, one-point scoring rule and row-level evidence note for all reviewed checks. The seven-sheet Excel workbook remains a separate local artifact; this repository contains the Markdown checklist and this audit summary.
