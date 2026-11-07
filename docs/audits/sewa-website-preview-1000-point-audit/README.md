# SEWA Shared Website Preview — 1,000-Point Audit

This folder contains the source-reviewed audit dataset exported from the audit workbook prepared on 7 November 2026.

## Audit status at export

- 1,000 unique criteria; exactly 1 point per criterion.
- 54 reviewed: 41 PASS, 13 FAIL, 946 NOT TESTED.
- Evidence coverage: 5.4% (54/1,000).
- Points earned: 41/1,000. This is an in-progress evidence score, not a final grade.
- PASS results include source/code/unit-test evidence; they are not all live browser/device checks.

## Files

- `1000-checks.csv` — all 1,000 criteria, statuses, evidence and scoring fields.
- `audit-dashboard.csv` — dashboard data.
- `live-data.csv` — live listing data quality snapshot.
- `preview-examples.csv` — preview examples.
- `sources-and-method.csv` — methodology and source register.
- `preview-candidates.csv` — all 18 currently preview-eligible businesses and research notes.
- `preview-analytics.csv` — preview views, CTA clicks and enquiry counts for the 18 candidates.

The workbook is maintained as a downloadable local artifact in the originating ChatGPT conversation; these CSVs are the Git-tracked, reviewable data exports. No production application code or production data was changed by this audit export.
