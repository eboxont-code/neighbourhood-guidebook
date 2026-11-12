# Public-page indexing and canonical audit

## Checked first
- Audited all 79 neighbourhood, category, combined neighbourhood/category, and listing URLs in the current preview sitemap. All returned HTTP 200 with a unique title, a unique description, and exactly one canonical.
- Every canonical points to `https://sewa.boxont.com`, rather than the supplied published address `https://neighbourhood-guidebook.lovable.app`.
- 23 combined neighbourhood/category pages contain fewer than three real listings but are currently indexable and included in the sitemap.
- Two qualifying combinations have two public page addresses: the city-based URL and `/a/<area>/<category>`.
- Existing SEO scanner results are stale or unavailable, so these findings come from current source and server-rendered preview responses, not a current scanner verdict or Google indexing report.

## Corrections
1. Use the supplied published address for the shared canonical origin. Keep every page's own path, align the existing sitemap directive, and leave preview addresses out of canonicals.
2. Keep thin city-based combination pages usable for browsing, but add `noindex,follow` and exclude them from the sitemap. Missing combinations continue returning 404 with noindex.
3. Permanently redirect qualifying city-based combination URLs to the existing `/a/<area>/<category>` pages, leaving one indexable page per qualifying combination. Keep the three-real-listing threshold shared with sitemap eligibility.
4. Preserve existing titles and descriptions, which are already unique. Do not change business records, translations, contact actions, forms, administration, or the general indexing policy of listing and neighbourhood pages.
5. Update the Phase 5 audit checklist with verified evidence and any remaining limitations.

## Technical details
- Update the existing configuration, robots file, route loader/head, sitemap helper, and relevant tests; do not introduce packages or migrations.
- Add regression checks for the three-listing indexing rule, sitemap exclusions, and canonical origin.
- Recheck server-rendered metadata, HTTP redirects, missing-page noindex, and navigation to a qualifying local page at 390px. Run affected tests and lint; inspect available preview error signals.
- Record the combination-page indexing rule in the existing architecture instructions.

## Limits
- Do not publish or deploy. The live site will remain unchanged until a later publish.
- Actual Google indexing and Google's selected canonical are not established by this audit; they need page-specific Search Console evidence.