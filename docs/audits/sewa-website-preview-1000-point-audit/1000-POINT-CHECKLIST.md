# SEWA Shared Website Preview — Complete 1,000-Point Checklist

**Audit checkpoint:** 7 November 2026  
**Scope:** the reusable `/s/:slug/website-preview` template and current production listing data  
**Repository:** [`eboxont-code/neighbourhood-guidebook`](https://github.com/eboxont-code/neighbourhood-guidebook)

## Current scoring snapshot

| Metric | Count |
|---|---:|
| Total criteria | **1,000** |
| PASS | **41** |
| FAIL | **13** |
| NOT TESTED | **946** |
| Reviewed | **54 / 1000 (5.4%)** |
| Confirmed points | **41 / 1000** |

**This is not a final grade.** The 75.9% PASS ratio applies only to the 54 reviewed checks (41 PASS and 13 FAIL). The checklist is only 5.4% reviewed; 946 items remain NOT TESTED. Do not treat NOT TESTED as a confirmed failure or as a pass.

## Scoring and evidence rules

- Every row is one atomic criterion worth exactly **1 point**.
- **PASS = 1/1**. **FAIL = 0/1**. **NOT TESTED = 0/1 until verified**, but it is not a defect finding.
- PASS evidence can be source-code, automated-test or data evidence. It does not automatically mean that the deployed page was visually and interactively tested in a live browser/device session.
- Each reviewed row has its exact workbook evidence note below. Every NOT TESTED row has this workbook note: “Not verified in a live browser session; awaiting visual/device/interaction test.”
- Reviewed rows use the workbook scope note “One atomic one-point check of the single reusable website-preview template and its current production data.” The section scope headings below describe the theme of the remaining section checks.
- Keep IDs stable. Change a status only after executing the check and recording reproducible evidence.

## Section coverage

| Section | Checks | PASS | FAIL | NOT TESTED |
|---|---:|---:|---:|---:|
| 01 Structure & Navigation | 8 | 8 | 0 | 0 |
| 13 Technical SEO & Crawl | 55 | 5 | 0 | 50 |
| 02 Visual Design & Brand | 50 | 2 | 2 | 46 |
| 10 Conversion & Customer Actions | 59 | 8 | 1 | 50 |
| 19 Analytics & Lead Funnel | 53 | 3 | 0 | 50 |
| 17 Privacy & Security | 52 | 2 | 0 | 50 |
| 03 Responsive & Mobile | 54 | 3 | 1 | 50 |
| 16 Resilience & Error States | 51 | 1 | 0 | 50 |
| 08 Services & Pricing | 52 | 0 | 2 | 50 |
| 07 Content & Trust | 53 | 0 | 3 | 50 |
| 11 Location & Directions | 56 | 5 | 1 | 50 |
| 12 Opening Hours & Status | 56 | 4 | 2 | 50 |
| 09 Category Fit | 51 | 0 | 1 | 50 |
| 04 Accessibility: Semantics | 50 | 0 | 0 | 50 |
| 05 Accessibility: Keyboard | 50 | 0 | 0 | 50 |
| 06 Accessibility: Contrast & Readability | 50 | 0 | 0 | 50 |
| 14 Structured Data & Social Sharing | 50 | 0 | 0 | 50 |
| 15 Performance & Loading | 50 | 0 | 0 | 50 |
| 18 Localization & Language | 50 | 0 | 0 | 50 |
| 20 QA & Production Readiness | 50 | 0 | 0 | 50 |

## Full checklist

### 01 Structure & Navigation

*Section scope: Shared page structure, routing and business data resolution.*

- `SEWA-0001` **PASS** — Preview URL is matched to its own route, separate from the business listing page.
  - Evidence: src/test/preview.test.ts: router.matchRoutes() asserts /s/:slug/website-preview resolves to /s/$slug_/website-preview.
- `SEWA-0002` **PASS** — A valid business slug resolves to that business record for the shared template.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: loader calls getBusiness(params.slug) and passes { business }.
- `SEWA-0003` **PASS** — An unknown business slug returns the not-found state rather than a blank demo.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: loader calls notFound(); NotFoundView is configured.
- `SEWA-0004` **PASS** — Legacy business slugs redirect to the current preview URL with HTTP 301 semantics.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: slugRedirects/liveSlugRedirects redirect with statusCode: 301.
- `SEWA-0009` **PASS** — The selected business name is rendered as the page’s primary H1.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: hero title renders `<h1>{b.name}</h1>`.
- `SEWA-0010` **PASS** — The category is incorporated into the hero label using localized copy.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: `pvHeroIn` is filled with name, area, city and category.
- `SEWA-0023` **PASS** — Desktop hero navigation links to About, Hours, Visit and Contact section IDs.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: nav array maps four section IDs to anchors.
- `SEWA-0024` **PASS** — The main About, Hours, Visit and Contact sections have matching anchor IDs.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: sections use ids about, hours, visit and contact.

### 13 Technical SEO & Crawl

*Section scope: Titles, descriptions, canonical rules, robots and crawl behavior*

- `SEWA-0005` **PASS** — The page title is specific to the business name.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: head() builds `Website preview: ${b.name}`.
- `SEWA-0006` **PASS** — The meta description identifies the page as a free preview for the selected business.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: head() includes the business name and public-listing origin in description.
- `SEWA-0007` **PASS** — Search engines are told not to index or follow the demo preview.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: robots meta is `noindex, nofollow`.
- `SEWA-0008` **PASS** — Preview URLs are omitted from the generated sitemap.
  - Evidence: src/test/preview.test.ts: explicit assertion that sitemapPaths() has no website-preview route.
- `SEWA-0054` **PASS** — The HTML document language is updated to match the selected English or Nepali interface language.
  - Evidence: src/lib/i18n.tsx: LangProvider updates document.documentElement.lang to `en` or `ne` when lang changes.
- `SEWA-0601` **NOT TESTED** — Sewa promo bar: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0602` **NOT TESTED** — Sewa promo bar: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0603` **NOT TESTED** — Sewa promo bar: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0604` **NOT TESTED** — Sewa promo bar: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0605` **NOT TESTED** — Sewa promo bar: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0606` **NOT TESTED** — Hero navigation: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0607` **NOT TESTED** — Hero navigation: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0608` **NOT TESTED** — Hero navigation: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0609` **NOT TESTED** — Hero navigation: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0610` **NOT TESTED** — Hero navigation: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0611` **NOT TESTED** — Hero title and category: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0612` **NOT TESTED** — Hero title and category: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0613` **NOT TESTED** — Hero title and category: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0614` **NOT TESTED** — Hero title and category: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0615` **NOT TESTED** — Hero title and category: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0616` **NOT TESTED** — Quick-facts panel: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0617` **NOT TESTED** — Quick-facts panel: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0618` **NOT TESTED** — Quick-facts panel: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0619` **NOT TESTED** — Quick-facts panel: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0620` **NOT TESTED** — Quick-facts panel: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0621` **NOT TESTED** — About section: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0622` **NOT TESTED** — About section: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0623` **NOT TESTED** — About section: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0624` **NOT TESTED** — About section: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0625` **NOT TESTED** — About section: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0626` **NOT TESTED** — Services panel: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0627` **NOT TESTED** — Services panel: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0628` **NOT TESTED** — Services panel: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0629` **NOT TESTED** — Services panel: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0630` **NOT TESTED** — Services panel: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0631` **NOT TESTED** — Opening-hours section: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0632` **NOT TESTED** — Opening-hours section: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0633` **NOT TESTED** — Opening-hours section: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0634` **NOT TESTED** — Opening-hours section: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0635` **NOT TESTED** — Opening-hours section: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0636` **NOT TESTED** — Visit/map section: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0637` **NOT TESTED** — Visit/map section: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0638` **NOT TESTED** — Visit/map section: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0639` **NOT TESTED** — Visit/map section: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0640` **NOT TESTED** — Visit/map section: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0641` **NOT TESTED** — Contact section: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0642` **NOT TESTED** — Contact section: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0643` **NOT TESTED** — Contact section: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0644` **NOT TESTED** — Contact section: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0645` **NOT TESTED** — Contact section: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0646` **NOT TESTED** — Owner conversion section: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0647` **NOT TESTED** — Owner conversion section: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0648` **NOT TESTED** — Owner conversion section: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0649` **NOT TESTED** — Owner conversion section: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0650` **NOT TESTED** — Owner conversion section: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.

### 02 Visual Design & Brand

*Section scope: Visual consistency, business identity, imagery and presentation*

- `SEWA-0011` **PASS** — The shared template has a separate category hue mapping for all eight live categories.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: HUE map defines salons, barbers, spas, clinics, cafes, restaurants, gyms and hotels.
- `SEWA-0012` **PASS** — The SEWA banner clearly labels the page as a preview and not the official business website.
  - Evidence: src/lib/i18n.tsx: `pvBarText` / `pvBarNote` explicitly state free preview and not official site.
- `SEWA-0033` **FAIL** `[priority: High]` — Every currently eligible preview uses a business-published cover photo rather than generic art.
  - Evidence: Live Supabase query: 0 of 18 preview-eligible listings have a cover object; all use generated category art.
- `SEWA-0053` **FAIL** `[priority: Medium]` — The preview offers a multi-image gallery for the business rather than a single cover image.
  - Evidence: The template supports one `cover` image and no gallery array or gallery component.
- `SEWA-0055` **NOT TESTED** — Sewa promo bar: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0056` **NOT TESTED** — Hero navigation: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0057` **NOT TESTED** — Hero navigation: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0058` **NOT TESTED** — Hero navigation: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0059` **NOT TESTED** — Hero navigation: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0060` **NOT TESTED** — Hero navigation: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0061` **NOT TESTED** — Hero title and category: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0062` **NOT TESTED** — Hero title and category: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0063` **NOT TESTED** — Hero title and category: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0064` **NOT TESTED** — Hero title and category: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0065` **NOT TESTED** — Hero title and category: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0066` **NOT TESTED** — Quick-facts panel: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0067` **NOT TESTED** — Quick-facts panel: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0068` **NOT TESTED** — Quick-facts panel: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0069` **NOT TESTED** — Quick-facts panel: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0070` **NOT TESTED** — Quick-facts panel: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0071` **NOT TESTED** — About section: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0072` **NOT TESTED** — About section: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0073` **NOT TESTED** — About section: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0074` **NOT TESTED** — About section: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0075` **NOT TESTED** — About section: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0076` **NOT TESTED** — Services panel: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0077` **NOT TESTED** — Services panel: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0078` **NOT TESTED** — Services panel: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0079` **NOT TESTED** — Services panel: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0080` **NOT TESTED** — Services panel: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0081` **NOT TESTED** — Opening-hours section: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0082` **NOT TESTED** — Opening-hours section: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0083` **NOT TESTED** — Opening-hours section: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0084` **NOT TESTED** — Opening-hours section: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0085` **NOT TESTED** — Opening-hours section: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0086` **NOT TESTED** — Visit/map section: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0087` **NOT TESTED** — Visit/map section: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0088` **NOT TESTED** — Visit/map section: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0089` **NOT TESTED** — Visit/map section: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0090` **NOT TESTED** — Visit/map section: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0091` **NOT TESTED** — Contact section: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0092` **NOT TESTED** — Contact section: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0093` **NOT TESTED** — Contact section: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0094` **NOT TESTED** — Contact section: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0095` **NOT TESTED** — Contact section: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0096` **NOT TESTED** — Owner conversion section: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0097` **NOT TESTED** — Owner conversion section: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0098` **NOT TESTED** — Owner conversion section: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0099` **NOT TESTED** — Owner conversion section: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0100` **NOT TESTED** — Owner conversion section: has an appropriate accessible name. Confirm the result is still clear on a small phone.

### 10 Conversion & Customer Actions

*Section scope: Customer-facing calls to action, booking, enquiry and purchase paths*

- `SEWA-0013` **PASS** — The owner-facing banner CTA links to SEWA’s contact route.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: ownerLink targets `/contact`.
- `SEWA-0014` **PASS** — The contact route receives the source listing slug and business name.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: ownerLink search includes `from=preview`, `listing`, and `business`.
- `SEWA-0015` **PASS** — The contact form preselects the website enquiry topic when opened from a preview.
  - Evidence: src/lib/form-options.ts: topicFromSource('preview') returns `website`; src/routes/contact.tsx passes initialTopic.
- `SEWA-0016` **PASS** — The preview enquiry message is prefilled with the selected business name.
  - Evidence: src/routes/contact.tsx: `pvLeadMsg` replaces `{name}` with business; ContactForm uses it as initial message.
- `SEWA-0017` **PASS** — The contact form validates required name and message fields before submitting.
  - Evidence: src/components/forms.tsx: Zod contactSchema requires name and message; submit validates with safeParse().
- `SEWA-0034` **FAIL** `[priority: Medium]` — Every preview-eligible listing provides WhatsApp as a one-tap contact method.
  - Evidence: Live Supabase query: 0 of 18 eligible listings have a WhatsApp number.
- `SEWA-0042` **PASS** — The recorded business phone number is exposed as a one-tap telephone link.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: phone action uses telLink(b.phone); all 18 eligible records have a phone.
- `SEWA-0043` **PASS** — WhatsApp is only rendered when an explicit WhatsApp number exists.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: WhatsApp anchor is conditional on `b.whatsapp`.
- `SEWA-0044` **PASS** — Social actions are rendered only for recorded social profiles.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: social list renders only when socials.length > 0.
- `SEWA-0451` **NOT TESTED** — Sewa promo bar: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0452` **NOT TESTED** — Sewa promo bar: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0453` **NOT TESTED** — Sewa promo bar: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0454` **NOT TESTED** — Sewa promo bar: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0455` **NOT TESTED** — Sewa promo bar: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0456` **NOT TESTED** — Hero navigation: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0457` **NOT TESTED** — Hero navigation: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0458` **NOT TESTED** — Hero navigation: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0459` **NOT TESTED** — Hero navigation: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0460` **NOT TESTED** — Hero navigation: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0461` **NOT TESTED** — Hero title and category: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0462` **NOT TESTED** — Hero title and category: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0463` **NOT TESTED** — Hero title and category: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0464` **NOT TESTED** — Hero title and category: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0465` **NOT TESTED** — Hero title and category: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0466` **NOT TESTED** — Quick-facts panel: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0467` **NOT TESTED** — Quick-facts panel: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0468` **NOT TESTED** — Quick-facts panel: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0469` **NOT TESTED** — Quick-facts panel: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0470` **NOT TESTED** — Quick-facts panel: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0471` **NOT TESTED** — About section: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0472` **NOT TESTED** — About section: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0473` **NOT TESTED** — About section: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0474` **NOT TESTED** — About section: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0475` **NOT TESTED** — About section: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0476` **NOT TESTED** — Services panel: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0477` **NOT TESTED** — Services panel: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0478` **NOT TESTED** — Services panel: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0479` **NOT TESTED** — Services panel: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0480` **NOT TESTED** — Services panel: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0481` **NOT TESTED** — Opening-hours section: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0482` **NOT TESTED** — Opening-hours section: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0483` **NOT TESTED** — Opening-hours section: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0484` **NOT TESTED** — Opening-hours section: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0485` **NOT TESTED** — Opening-hours section: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0486` **NOT TESTED** — Visit/map section: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0487` **NOT TESTED** — Visit/map section: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0488` **NOT TESTED** — Visit/map section: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0489` **NOT TESTED** — Visit/map section: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0490` **NOT TESTED** — Visit/map section: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0491` **NOT TESTED** — Contact section: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0492` **NOT TESTED** — Contact section: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0493` **NOT TESTED** — Contact section: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0494` **NOT TESTED** — Contact section: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0495` **NOT TESTED** — Contact section: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0496` **NOT TESTED** — Owner conversion section: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0497` **NOT TESTED** — Owner conversion section: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0498` **NOT TESTED** — Owner conversion section: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0499` **NOT TESTED** — Owner conversion section: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0500` **NOT TESTED** — Owner conversion section: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.

### 19 Analytics & Lead Funnel

*Section scope: Preview views, owner leads, event quality and conversion measurement*

- `SEWA-0018` **PASS** — A successful preview-origin website enquiry emits an `enquiry_submit` event.
  - Evidence: src/components/forms.tsx: success path tracks enquiry_submit for topic=website or page=preview.
- `SEWA-0019` **PASS** — A preview page view emits a `preview_view` event tagged with its listing slug.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: useEffect calls track('preview_view', { slug: b.slug }).
- `SEWA-0020` **PASS** — The owner CTA emits a `preview_enquiry_click` event.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: banner Link onClick tracks preview_enquiry_click.
- `SEWA-0901` **NOT TESTED** — Sewa promo bar: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0902` **NOT TESTED** — Sewa promo bar: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0903` **NOT TESTED** — Sewa promo bar: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0904` **NOT TESTED** — Sewa promo bar: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0905` **NOT TESTED** — Sewa promo bar: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0906` **NOT TESTED** — Hero navigation: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0907` **NOT TESTED** — Hero navigation: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0908` **NOT TESTED** — Hero navigation: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0909` **NOT TESTED** — Hero navigation: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0910` **NOT TESTED** — Hero navigation: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0911` **NOT TESTED** — Hero title and category: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0912` **NOT TESTED** — Hero title and category: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0913` **NOT TESTED** — Hero title and category: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0914` **NOT TESTED** — Hero title and category: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0915` **NOT TESTED** — Hero title and category: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0916` **NOT TESTED** — Quick-facts panel: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0917` **NOT TESTED** — Quick-facts panel: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0918` **NOT TESTED** — Quick-facts panel: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0919` **NOT TESTED** — Quick-facts panel: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0920` **NOT TESTED** — Quick-facts panel: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0921` **NOT TESTED** — About section: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0922` **NOT TESTED** — About section: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0923` **NOT TESTED** — About section: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0924` **NOT TESTED** — About section: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0925` **NOT TESTED** — About section: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0926` **NOT TESTED** — Services panel: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0927` **NOT TESTED** — Services panel: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0928` **NOT TESTED** — Services panel: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0929` **NOT TESTED** — Services panel: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0930` **NOT TESTED** — Services panel: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0931` **NOT TESTED** — Opening-hours section: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0932` **NOT TESTED** — Opening-hours section: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0933` **NOT TESTED** — Opening-hours section: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0934` **NOT TESTED** — Opening-hours section: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0935` **NOT TESTED** — Opening-hours section: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0936` **NOT TESTED** — Visit/map section: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0937` **NOT TESTED** — Visit/map section: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0938` **NOT TESTED** — Visit/map section: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0939` **NOT TESTED** — Visit/map section: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0940` **NOT TESTED** — Visit/map section: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0941` **NOT TESTED** — Contact section: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0942` **NOT TESTED** — Contact section: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0943` **NOT TESTED** — Contact section: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0944` **NOT TESTED** — Contact section: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0945` **NOT TESTED** — Contact section: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0946` **NOT TESTED** — Owner conversion section: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0947` **NOT TESTED** — Owner conversion section: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0948` **NOT TESTED** — Owner conversion section: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0949` **NOT TESTED** — Owner conversion section: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0950` **NOT TESTED** — Owner conversion section: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.

### 17 Privacy & Security

*Section scope: Data exposure, form abuse, safe links, analytics and backend controls*

- `SEWA-0021` **PASS** — Analytics respects the browser Do Not Track setting.
  - Evidence: src/lib/track.ts: track() returns when navigator.doNotTrack === '1'.
- `SEWA-0022` **PASS** — Analytics payload avoids names, direct identifiers, tracking cookies and location.
  - Evidence: src/lib/track.ts: trackPayload returns event, listing_slug, query, lang and path only; comment says no names/IDs/cookies/location.
- `SEWA-0801` **NOT TESTED** — Sewa promo bar: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0802` **NOT TESTED** — Sewa promo bar: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0803` **NOT TESTED** — Sewa promo bar: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0804` **NOT TESTED** — Sewa promo bar: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0805` **NOT TESTED** — Sewa promo bar: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0806` **NOT TESTED** — Hero navigation: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0807` **NOT TESTED** — Hero navigation: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0808` **NOT TESTED** — Hero navigation: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0809` **NOT TESTED** — Hero navigation: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0810` **NOT TESTED** — Hero navigation: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0811` **NOT TESTED** — Hero title and category: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0812` **NOT TESTED** — Hero title and category: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0813` **NOT TESTED** — Hero title and category: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0814` **NOT TESTED** — Hero title and category: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0815` **NOT TESTED** — Hero title and category: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0816` **NOT TESTED** — Quick-facts panel: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0817` **NOT TESTED** — Quick-facts panel: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0818` **NOT TESTED** — Quick-facts panel: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0819` **NOT TESTED** — Quick-facts panel: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0820` **NOT TESTED** — Quick-facts panel: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0821` **NOT TESTED** — About section: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0822` **NOT TESTED** — About section: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0823` **NOT TESTED** — About section: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0824` **NOT TESTED** — About section: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0825` **NOT TESTED** — About section: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0826` **NOT TESTED** — Services panel: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0827` **NOT TESTED** — Services panel: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0828` **NOT TESTED** — Services panel: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0829` **NOT TESTED** — Services panel: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0830` **NOT TESTED** — Services panel: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0831` **NOT TESTED** — Opening-hours section: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0832` **NOT TESTED** — Opening-hours section: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0833` **NOT TESTED** — Opening-hours section: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0834` **NOT TESTED** — Opening-hours section: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0835` **NOT TESTED** — Opening-hours section: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0836` **NOT TESTED** — Visit/map section: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0837` **NOT TESTED** — Visit/map section: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0838` **NOT TESTED** — Visit/map section: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0839` **NOT TESTED** — Visit/map section: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0840` **NOT TESTED** — Visit/map section: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0841` **NOT TESTED** — Contact section: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0842` **NOT TESTED** — Contact section: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0843` **NOT TESTED** — Contact section: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0844` **NOT TESTED** — Contact section: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0845` **NOT TESTED** — Contact section: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0846` **NOT TESTED** — Owner conversion section: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0847` **NOT TESTED** — Owner conversion section: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0848` **NOT TESTED** — Owner conversion section: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0849` **NOT TESTED** — Owner conversion section: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0850` **NOT TESTED** — Owner conversion section: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.

### 03 Responsive & Mobile

*Section scope: Mobile-first layout, touch use, sticky elements and breakpoints*

- `SEWA-0025` **PASS** — The bottom SEWA CTA bar is fixed at the bottom of the phone viewport.
  - Evidence: src/styles.css: pv-bar is position:fixed bottom:0; desktop switches to sticky.
- `SEWA-0026` **PASS** — The standalone preview reserves bottom padding for its fixed phone CTA bar.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: outer pv-site uses bottom padding including safe-area inset.
- `SEWA-0027` **PASS** — The SEWA CTA bar becomes sticky at the top on desktop-sized viewports.
  - Evidence: src/styles.css: pv-bar media query at min-width 1024px sets position:sticky; top:0.
- `SEWA-0029` **FAIL** `[priority: High]` — A compact section-jump navigation remains available to users on phone-sized screens.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: section navigation has `hidden ... lg:flex`; no mobile equivalent is rendered.
- `SEWA-0101` **NOT TESTED** — Sewa promo bar: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0102` **NOT TESTED** — Sewa promo bar: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0103` **NOT TESTED** — Sewa promo bar: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0104` **NOT TESTED** — Sewa promo bar: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0105` **NOT TESTED** — Sewa promo bar: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0106` **NOT TESTED** — Hero navigation: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0107` **NOT TESTED** — Hero navigation: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0108` **NOT TESTED** — Hero navigation: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0109` **NOT TESTED** — Hero navigation: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0110` **NOT TESTED** — Hero navigation: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0111` **NOT TESTED** — Hero title and category: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0112` **NOT TESTED** — Hero title and category: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0113` **NOT TESTED** — Hero title and category: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0114` **NOT TESTED** — Hero title and category: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0115` **NOT TESTED** — Hero title and category: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0116` **NOT TESTED** — Quick-facts panel: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0117` **NOT TESTED** — Quick-facts panel: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0118` **NOT TESTED** — Quick-facts panel: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0119` **NOT TESTED** — Quick-facts panel: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0120` **NOT TESTED** — Quick-facts panel: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0121` **NOT TESTED** — About section: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0122` **NOT TESTED** — About section: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0123` **NOT TESTED** — About section: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0124` **NOT TESTED** — About section: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0125` **NOT TESTED** — About section: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0126` **NOT TESTED** — Services panel: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0127` **NOT TESTED** — Services panel: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0128` **NOT TESTED** — Services panel: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0129` **NOT TESTED** — Services panel: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0130` **NOT TESTED** — Services panel: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0131` **NOT TESTED** — Opening-hours section: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0132` **NOT TESTED** — Opening-hours section: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0133` **NOT TESTED** — Opening-hours section: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0134` **NOT TESTED** — Opening-hours section: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0135` **NOT TESTED** — Opening-hours section: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0136` **NOT TESTED** — Visit/map section: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0137` **NOT TESTED** — Visit/map section: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0138` **NOT TESTED** — Visit/map section: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0139` **NOT TESTED** — Visit/map section: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0140` **NOT TESTED** — Visit/map section: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0141` **NOT TESTED** — Contact section: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0142` **NOT TESTED** — Contact section: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0143` **NOT TESTED** — Contact section: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0144` **NOT TESTED** — Contact section: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0145` **NOT TESTED** — Contact section: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0146` **NOT TESTED** — Owner conversion section: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0147` **NOT TESTED** — Owner conversion section: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0148` **NOT TESTED** — Owner conversion section: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0149` **NOT TESTED** — Owner conversion section: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0150` **NOT TESTED** — Owner conversion section: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.

### 16 Resilience & Error States

*Section scope: Missing fields, broken assets, invalid data and fallback behavior*

- `SEWA-0028` **PASS** — A failed business cover image falls back to category-generated hero artwork.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: image onError sets failed; no-photo branch renders CatIcon.
- `SEWA-0751` **NOT TESTED** — Sewa promo bar: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0752` **NOT TESTED** — Sewa promo bar: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0753` **NOT TESTED** — Sewa promo bar: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0754` **NOT TESTED** — Sewa promo bar: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0755` **NOT TESTED** — Sewa promo bar: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0756` **NOT TESTED** — Hero navigation: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0757` **NOT TESTED** — Hero navigation: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0758` **NOT TESTED** — Hero navigation: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0759` **NOT TESTED** — Hero navigation: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0760` **NOT TESTED** — Hero navigation: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0761` **NOT TESTED** — Hero title and category: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0762` **NOT TESTED** — Hero title and category: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0763` **NOT TESTED** — Hero title and category: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0764` **NOT TESTED** — Hero title and category: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0765` **NOT TESTED** — Hero title and category: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0766` **NOT TESTED** — Quick-facts panel: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0767` **NOT TESTED** — Quick-facts panel: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0768` **NOT TESTED** — Quick-facts panel: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0769` **NOT TESTED** — Quick-facts panel: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0770` **NOT TESTED** — Quick-facts panel: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0771` **NOT TESTED** — About section: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0772` **NOT TESTED** — About section: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0773` **NOT TESTED** — About section: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0774` **NOT TESTED** — About section: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0775` **NOT TESTED** — About section: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0776` **NOT TESTED** — Services panel: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0777` **NOT TESTED** — Services panel: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0778` **NOT TESTED** — Services panel: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0779` **NOT TESTED** — Services panel: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0780` **NOT TESTED** — Services panel: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0781` **NOT TESTED** — Opening-hours section: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0782` **NOT TESTED** — Opening-hours section: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0783` **NOT TESTED** — Opening-hours section: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0784` **NOT TESTED** — Opening-hours section: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0785` **NOT TESTED** — Opening-hours section: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0786` **NOT TESTED** — Visit/map section: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0787` **NOT TESTED** — Visit/map section: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0788` **NOT TESTED** — Visit/map section: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0789` **NOT TESTED** — Visit/map section: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0790` **NOT TESTED** — Visit/map section: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0791` **NOT TESTED** — Contact section: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0792` **NOT TESTED** — Contact section: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0793` **NOT TESTED** — Contact section: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0794` **NOT TESTED** — Contact section: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0795` **NOT TESTED** — Contact section: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0796` **NOT TESTED** — Owner conversion section: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0797` **NOT TESTED** — Owner conversion section: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0798` **NOT TESTED** — Owner conversion section: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0799` **NOT TESTED** — Owner conversion section: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0800` **NOT TESTED** — Owner conversion section: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.

### 08 Services & Pricing

*Section scope: Service, menu, class, room, treatment and price presentation*

- `SEWA-0030` **FAIL** `[priority: High]` — The services panel displays a stored service price when the Business record includes one.
  - Evidence: Business service schema supports `price`, but preview maps only `s.name`; price is never rendered.
- `SEWA-0032` **FAIL** `[priority: High]` — Every currently eligible preview contains at least one real service or product.
  - Evidence: Live Supabase query: 0 of 18 preview-eligible listings have a non-empty services array.
- `SEWA-0351` **NOT TESTED** — Sewa promo bar: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0352` **NOT TESTED** — Sewa promo bar: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0353` **NOT TESTED** — Sewa promo bar: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0354` **NOT TESTED** — Sewa promo bar: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0355` **NOT TESTED** — Sewa promo bar: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0356` **NOT TESTED** — Hero navigation: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0357` **NOT TESTED** — Hero navigation: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0358` **NOT TESTED** — Hero navigation: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0359` **NOT TESTED** — Hero navigation: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0360` **NOT TESTED** — Hero navigation: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0361` **NOT TESTED** — Hero title and category: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0362` **NOT TESTED** — Hero title and category: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0363` **NOT TESTED** — Hero title and category: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0364` **NOT TESTED** — Hero title and category: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0365` **NOT TESTED** — Hero title and category: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0366` **NOT TESTED** — Quick-facts panel: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0367` **NOT TESTED** — Quick-facts panel: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0368` **NOT TESTED** — Quick-facts panel: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0369` **NOT TESTED** — Quick-facts panel: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0370` **NOT TESTED** — Quick-facts panel: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0371` **NOT TESTED** — About section: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0372` **NOT TESTED** — About section: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0373` **NOT TESTED** — About section: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0374` **NOT TESTED** — About section: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0375` **NOT TESTED** — About section: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0376` **NOT TESTED** — Services panel: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0377` **NOT TESTED** — Services panel: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0378` **NOT TESTED** — Services panel: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0379` **NOT TESTED** — Services panel: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0380` **NOT TESTED** — Services panel: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0381` **NOT TESTED** — Opening-hours section: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0382` **NOT TESTED** — Opening-hours section: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0383` **NOT TESTED** — Opening-hours section: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0384` **NOT TESTED** — Opening-hours section: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0385` **NOT TESTED** — Opening-hours section: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0386` **NOT TESTED** — Visit/map section: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0387` **NOT TESTED** — Visit/map section: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0388` **NOT TESTED** — Visit/map section: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0389` **NOT TESTED** — Visit/map section: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0390` **NOT TESTED** — Visit/map section: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0391` **NOT TESTED** — Contact section: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0392` **NOT TESTED** — Contact section: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0393` **NOT TESTED** — Contact section: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0394` **NOT TESTED** — Contact section: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0395` **NOT TESTED** — Contact section: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0396` **NOT TESTED** — Owner conversion section: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0397` **NOT TESTED** — Owner conversion section: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0398` **NOT TESTED** — Owner conversion section: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0399` **NOT TESTED** — Owner conversion section: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0400` **NOT TESTED** — Owner conversion section: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.

### 07 Content & Trust

*Section scope: Business information quality, completeness, accuracy and provenance*

- `SEWA-0031` **FAIL** `[priority: High]` — The About section has meaningful business-specific descriptive copy for each currently eligible preview.
  - Evidence: Live Supabase query: only 5 of 18 preview-eligible records have a non-empty description.
- `SEWA-0050` **FAIL** `[priority: High]` — The business website status excludes listings with a currently working official website from the free-preview offer.
  - Evidence: Independent current source checks found active official pages for H2O Athletics, Nuad Thai, TONI&GUY Kathmandu and Femina Flaunt, while SEWA still records failed/none_found; the current status gate therefore needs rechecking.
- `SEWA-0052` **FAIL** `[priority: Medium]` — The record and page support a business contact email as a direct customer action.
  - Evidence: Business interface and preview component have no email field or email action; contact is phone, WhatsApp and social only.
- `SEWA-0301` **NOT TESTED** — Sewa promo bar: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0302` **NOT TESTED** — Sewa promo bar: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0303` **NOT TESTED** — Sewa promo bar: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0304` **NOT TESTED** — Sewa promo bar: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0305` **NOT TESTED** — Sewa promo bar: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0306` **NOT TESTED** — Hero navigation: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0307` **NOT TESTED** — Hero navigation: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0308` **NOT TESTED** — Hero navigation: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0309` **NOT TESTED** — Hero navigation: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0310` **NOT TESTED** — Hero navigation: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0311` **NOT TESTED** — Hero title and category: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0312` **NOT TESTED** — Hero title and category: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0313` **NOT TESTED** — Hero title and category: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0314` **NOT TESTED** — Hero title and category: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0315` **NOT TESTED** — Hero title and category: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0316` **NOT TESTED** — Quick-facts panel: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0317` **NOT TESTED** — Quick-facts panel: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0318` **NOT TESTED** — Quick-facts panel: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0319` **NOT TESTED** — Quick-facts panel: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0320` **NOT TESTED** — Quick-facts panel: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0321` **NOT TESTED** — About section: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0322` **NOT TESTED** — About section: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0323` **NOT TESTED** — About section: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0324` **NOT TESTED** — About section: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0325` **NOT TESTED** — About section: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0326` **NOT TESTED** — Services panel: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0327` **NOT TESTED** — Services panel: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0328` **NOT TESTED** — Services panel: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0329` **NOT TESTED** — Services panel: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0330` **NOT TESTED** — Services panel: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0331` **NOT TESTED** — Opening-hours section: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0332` **NOT TESTED** — Opening-hours section: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0333` **NOT TESTED** — Opening-hours section: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0334` **NOT TESTED** — Opening-hours section: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0335` **NOT TESTED** — Opening-hours section: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0336` **NOT TESTED** — Visit/map section: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0337` **NOT TESTED** — Visit/map section: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0338` **NOT TESTED** — Visit/map section: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0339` **NOT TESTED** — Visit/map section: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0340` **NOT TESTED** — Visit/map section: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0341` **NOT TESTED** — Contact section: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0342` **NOT TESTED** — Contact section: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0343` **NOT TESTED** — Contact section: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0344` **NOT TESTED** — Contact section: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0345` **NOT TESTED** — Contact section: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0346` **NOT TESTED** — Owner conversion section: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0347` **NOT TESTED** — Owner conversion section: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0348` **NOT TESTED** — Owner conversion section: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0349` **NOT TESTED** — Owner conversion section: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0350` **NOT TESTED** — Owner conversion section: is present and visible. Confirm the result is still clear on a small phone.

### 11 Location & Directions

*Section scope: Address, map, pin, directions and local context*

- `SEWA-0035` **FAIL** `[priority: High]` — Every preview-eligible listing has coordinates for a real embedded map.
  - Evidence: Live Supabase query: only 5 of 18 eligible listings have both latitude and longitude.
- `SEWA-0045` **PASS** — The directions action is conditional on a generated directions URL.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: directions anchor renders only when `dir` exists.
- `SEWA-0046` **PASS** — The preview gives a non-map fallback when no verified coordinate pin is available.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: `hasPin(b)` gate selects MapView or a category/area visual fallback.
- `SEWA-0047` **PASS** — The map library is loaded only in the browser after mount, avoiding server-side Leaflet execution.
  - Evidence: src/components/map-view.tsx: ListingMap is lazy imported; mounted state gates map render.
- `SEWA-0048` **PASS** — Map markers expose a title, alt label and keyboard interaction.
  - Evidence: src/components/listing-map.tsx: markers set title, alt and keyboard:true.
- `SEWA-0049` **PASS** — Map tiles include OpenStreetMap attribution.
  - Evidence: src/components/listing-map.tsx: tile layer attribution includes OpenStreetMap copyright link.
- `SEWA-0501` **NOT TESTED** — Sewa promo bar: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0502` **NOT TESTED** — Sewa promo bar: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0503` **NOT TESTED** — Sewa promo bar: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0504` **NOT TESTED** — Sewa promo bar: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0505` **NOT TESTED** — Sewa promo bar: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0506` **NOT TESTED** — Hero navigation: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0507` **NOT TESTED** — Hero navigation: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0508` **NOT TESTED** — Hero navigation: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0509` **NOT TESTED** — Hero navigation: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0510` **NOT TESTED** — Hero navigation: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0511` **NOT TESTED** — Hero title and category: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0512` **NOT TESTED** — Hero title and category: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0513` **NOT TESTED** — Hero title and category: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0514` **NOT TESTED** — Hero title and category: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0515` **NOT TESTED** — Hero title and category: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0516` **NOT TESTED** — Quick-facts panel: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0517` **NOT TESTED** — Quick-facts panel: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0518` **NOT TESTED** — Quick-facts panel: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0519` **NOT TESTED** — Quick-facts panel: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0520` **NOT TESTED** — Quick-facts panel: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0521` **NOT TESTED** — About section: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0522` **NOT TESTED** — About section: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0523` **NOT TESTED** — About section: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0524` **NOT TESTED** — About section: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0525` **NOT TESTED** — About section: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0526` **NOT TESTED** — Services panel: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0527` **NOT TESTED** — Services panel: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0528` **NOT TESTED** — Services panel: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0529` **NOT TESTED** — Services panel: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0530` **NOT TESTED** — Services panel: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0531` **NOT TESTED** — Opening-hours section: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0532` **NOT TESTED** — Opening-hours section: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0533` **NOT TESTED** — Opening-hours section: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0534` **NOT TESTED** — Opening-hours section: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0535` **NOT TESTED** — Opening-hours section: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0536` **NOT TESTED** — Visit/map section: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0537` **NOT TESTED** — Visit/map section: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0538` **NOT TESTED** — Visit/map section: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0539` **NOT TESTED** — Visit/map section: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0540` **NOT TESTED** — Visit/map section: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0541` **NOT TESTED** — Contact section: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0542` **NOT TESTED** — Contact section: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0543` **NOT TESTED** — Contact section: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0544` **NOT TESTED** — Contact section: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0545` **NOT TESTED** — Contact section: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0546` **NOT TESTED** — Owner conversion section: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0547` **NOT TESTED** — Owner conversion section: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0548` **NOT TESTED** — Owner conversion section: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0549` **NOT TESTED** — Owner conversion section: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0550` **NOT TESTED** — Owner conversion section: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.

### 12 Opening Hours & Status

*Section scope: Weekly hours, status calculations, missing data and exceptions*

- `SEWA-0036` **FAIL** `[priority: High]` — Every preview-eligible listing has opening hours to populate the weekly schedule.
  - Evidence: Live Supabase query: 13 of 18 eligible listings have hours; 5 have none.
- `SEWA-0037` **FAIL** `[priority: High]` — All recorded hours for preview-eligible listings are verified against an official source.
  - Evidence: Live Supabase query: only 7 of 13 eligible listings with hours are marked verified; 6 are explicitly unverified.
- `SEWA-0038` **PASS** — When hours exist but are marked unverified, the preview displays an unverified-source note.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: Week renders hoursSource when `!hoursVerified`.
- `SEWA-0039` **PASS** — A valid weekly opening schedule is rendered as a seven-day table.
  - Evidence: src/routes/s.$slug_.website-preview.tsx: Week() calls weekTable() and renders ORDER over all weekdays.
- `SEWA-0040` **PASS** — Current open/closed status is calculated using Kathmandu local time.
  - Evidence: src/lib/venue.ts + src/data/directory.ts: statusDetail uses kathmanduNow(); hours tests cover Kathmandu UTC+5:45.
- `SEWA-0041` **PASS** — Unparseable or ambiguous hours do not produce an invented open/closed status.
  - Evidence: src/lib/venue.ts: statusDetail returns null if hours cannot be parsed; src/test/hours.test.ts covers invalid and missing times.
- `SEWA-0551` **NOT TESTED** — Sewa promo bar: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0552` **NOT TESTED** — Sewa promo bar: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0553` **NOT TESTED** — Sewa promo bar: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0554` **NOT TESTED** — Sewa promo bar: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0555` **NOT TESTED** — Sewa promo bar: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0556` **NOT TESTED** — Hero navigation: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0557` **NOT TESTED** — Hero navigation: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0558` **NOT TESTED** — Hero navigation: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0559` **NOT TESTED** — Hero navigation: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0560` **NOT TESTED** — Hero navigation: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0561` **NOT TESTED** — Hero title and category: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0562` **NOT TESTED** — Hero title and category: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0563` **NOT TESTED** — Hero title and category: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0564` **NOT TESTED** — Hero title and category: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0565` **NOT TESTED** — Hero title and category: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0566` **NOT TESTED** — Quick-facts panel: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0567` **NOT TESTED** — Quick-facts panel: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0568` **NOT TESTED** — Quick-facts panel: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0569` **NOT TESTED** — Quick-facts panel: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0570` **NOT TESTED** — Quick-facts panel: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0571` **NOT TESTED** — About section: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0572` **NOT TESTED** — About section: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0573` **NOT TESTED** — About section: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0574` **NOT TESTED** — About section: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0575` **NOT TESTED** — About section: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0576` **NOT TESTED** — Services panel: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0577` **NOT TESTED** — Services panel: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0578` **NOT TESTED** — Services panel: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0579` **NOT TESTED** — Services panel: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0580` **NOT TESTED** — Services panel: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0581` **NOT TESTED** — Opening-hours section: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0582` **NOT TESTED** — Opening-hours section: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0583` **NOT TESTED** — Opening-hours section: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0584` **NOT TESTED** — Opening-hours section: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0585` **NOT TESTED** — Opening-hours section: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0586` **NOT TESTED** — Visit/map section: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0587` **NOT TESTED** — Visit/map section: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0588` **NOT TESTED** — Visit/map section: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0589` **NOT TESTED** — Visit/map section: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0590` **NOT TESTED** — Visit/map section: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0591` **NOT TESTED** — Contact section: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0592` **NOT TESTED** — Contact section: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0593` **NOT TESTED** — Contact section: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0594` **NOT TESTED** — Contact section: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0595` **NOT TESTED** — Contact section: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0596` **NOT TESTED** — Owner conversion section: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0597` **NOT TESTED** — Owner conversion section: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0598` **NOT TESTED** — Owner conversion section: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0599` **NOT TESTED** — Owner conversion section: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0600` **NOT TESTED** — Owner conversion section: does not block the primary page content. Confirm the result is still clear on a small phone.

### 09 Category Fit

*Section scope: Fitness, salon, spa, clinic, cafe, restaurant, hotel and barber-specific needs*

- `SEWA-0051` **FAIL** `[priority: High]` — The template contains different category-specific modules for gym classes, salon treatments, restaurant menus, clinic practitioners and hotel rooms.
  - Evidence: src/routes/s.$slug_.website-preview.tsx renders the same About/Services/Hours/Visit/Contact/Owner sections for every category; HUE only changes colour.
- `SEWA-0401` **NOT TESTED** — Sewa promo bar: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0402` **NOT TESTED** — Sewa promo bar: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0403` **NOT TESTED** — Sewa promo bar: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0404` **NOT TESTED** — Sewa promo bar: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0405` **NOT TESTED** — Sewa promo bar: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0406` **NOT TESTED** — Hero navigation: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0407` **NOT TESTED** — Hero navigation: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0408` **NOT TESTED** — Hero navigation: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0409` **NOT TESTED** — Hero navigation: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0410` **NOT TESTED** — Hero navigation: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0411` **NOT TESTED** — Hero title and category: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0412` **NOT TESTED** — Hero title and category: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0413` **NOT TESTED** — Hero title and category: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0414` **NOT TESTED** — Hero title and category: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0415` **NOT TESTED** — Hero title and category: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0416` **NOT TESTED** — Quick-facts panel: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0417` **NOT TESTED** — Quick-facts panel: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0418` **NOT TESTED** — Quick-facts panel: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0419` **NOT TESTED** — Quick-facts panel: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0420` **NOT TESTED** — Quick-facts panel: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0421` **NOT TESTED** — About section: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0422` **NOT TESTED** — About section: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0423` **NOT TESTED** — About section: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0424` **NOT TESTED** — About section: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0425` **NOT TESTED** — About section: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0426` **NOT TESTED** — Services panel: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0427` **NOT TESTED** — Services panel: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0428` **NOT TESTED** — Services panel: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0429` **NOT TESTED** — Services panel: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0430` **NOT TESTED** — Services panel: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0431` **NOT TESTED** — Opening-hours section: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0432` **NOT TESTED** — Opening-hours section: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0433` **NOT TESTED** — Opening-hours section: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0434` **NOT TESTED** — Opening-hours section: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0435` **NOT TESTED** — Opening-hours section: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0436` **NOT TESTED** — Visit/map section: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0437` **NOT TESTED** — Visit/map section: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0438` **NOT TESTED** — Visit/map section: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0439` **NOT TESTED** — Visit/map section: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0440` **NOT TESTED** — Visit/map section: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0441` **NOT TESTED** — Contact section: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0442` **NOT TESTED** — Contact section: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0443` **NOT TESTED** — Contact section: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0444` **NOT TESTED** — Contact section: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0445` **NOT TESTED** — Contact section: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0446` **NOT TESTED** — Owner conversion section: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0447` **NOT TESTED** — Owner conversion section: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0448` **NOT TESTED** — Owner conversion section: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0449` **NOT TESTED** — Owner conversion section: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0450` **NOT TESTED** — Owner conversion section: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.

### 04 Accessibility: Semantics

*Section scope: HTML semantics, labels, relationships and screen-reader structure*

- `SEWA-0151` **NOT TESTED** — Sewa promo bar: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0152` **NOT TESTED** — Sewa promo bar: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0153` **NOT TESTED** — Sewa promo bar: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0154` **NOT TESTED** — Sewa promo bar: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0155` **NOT TESTED** — Sewa promo bar: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0156` **NOT TESTED** — Hero navigation: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0157` **NOT TESTED** — Hero navigation: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0158` **NOT TESTED** — Hero navigation: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0159` **NOT TESTED** — Hero navigation: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0160` **NOT TESTED** — Hero navigation: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0161` **NOT TESTED** — Hero title and category: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0162` **NOT TESTED** — Hero title and category: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0163` **NOT TESTED** — Hero title and category: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0164` **NOT TESTED** — Hero title and category: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0165` **NOT TESTED** — Hero title and category: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0166` **NOT TESTED** — Quick-facts panel: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0167` **NOT TESTED** — Quick-facts panel: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0168` **NOT TESTED** — Quick-facts panel: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0169` **NOT TESTED** — Quick-facts panel: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0170` **NOT TESTED** — Quick-facts panel: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0171` **NOT TESTED** — About section: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0172` **NOT TESTED** — About section: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0173` **NOT TESTED** — About section: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0174` **NOT TESTED** — About section: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0175` **NOT TESTED** — About section: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0176` **NOT TESTED** — Services panel: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0177` **NOT TESTED** — Services panel: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0178` **NOT TESTED** — Services panel: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0179` **NOT TESTED** — Services panel: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0180` **NOT TESTED** — Services panel: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0181` **NOT TESTED** — Opening-hours section: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0182` **NOT TESTED** — Opening-hours section: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0183` **NOT TESTED** — Opening-hours section: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0184` **NOT TESTED** — Opening-hours section: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0185` **NOT TESTED** — Opening-hours section: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0186` **NOT TESTED** — Visit/map section: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0187` **NOT TESTED** — Visit/map section: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0188` **NOT TESTED** — Visit/map section: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0189` **NOT TESTED** — Visit/map section: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0190` **NOT TESTED** — Visit/map section: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0191` **NOT TESTED** — Contact section: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0192` **NOT TESTED** — Contact section: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0193` **NOT TESTED** — Contact section: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0194` **NOT TESTED** — Contact section: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0195` **NOT TESTED** — Contact section: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0196` **NOT TESTED** — Owner conversion section: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0197` **NOT TESTED** — Owner conversion section: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0198` **NOT TESTED** — Owner conversion section: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0199` **NOT TESTED** — Owner conversion section: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0200` **NOT TESTED** — Owner conversion section: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.

### 05 Accessibility: Keyboard

*Section scope: Keyboard access, focus order, focus visibility and operation*

- `SEWA-0201` **NOT TESTED** — Sewa promo bar: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0202` **NOT TESTED** — Sewa promo bar: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0203` **NOT TESTED** — Sewa promo bar: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0204` **NOT TESTED** — Sewa promo bar: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0205` **NOT TESTED** — Sewa promo bar: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0206` **NOT TESTED** — Hero navigation: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0207` **NOT TESTED** — Hero navigation: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0208` **NOT TESTED** — Hero navigation: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0209` **NOT TESTED** — Hero navigation: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0210` **NOT TESTED** — Hero navigation: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0211` **NOT TESTED** — Hero title and category: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0212` **NOT TESTED** — Hero title and category: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0213` **NOT TESTED** — Hero title and category: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0214` **NOT TESTED** — Hero title and category: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0215` **NOT TESTED** — Hero title and category: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0216` **NOT TESTED** — Quick-facts panel: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0217` **NOT TESTED** — Quick-facts panel: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0218` **NOT TESTED** — Quick-facts panel: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0219` **NOT TESTED** — Quick-facts panel: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0220` **NOT TESTED** — Quick-facts panel: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0221` **NOT TESTED** — About section: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0222` **NOT TESTED** — About section: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0223` **NOT TESTED** — About section: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0224` **NOT TESTED** — About section: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0225` **NOT TESTED** — About section: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0226` **NOT TESTED** — Services panel: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0227` **NOT TESTED** — Services panel: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0228` **NOT TESTED** — Services panel: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0229` **NOT TESTED** — Services panel: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0230` **NOT TESTED** — Services panel: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0231` **NOT TESTED** — Opening-hours section: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0232` **NOT TESTED** — Opening-hours section: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0233` **NOT TESTED** — Opening-hours section: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0234` **NOT TESTED** — Opening-hours section: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0235` **NOT TESTED** — Opening-hours section: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0236` **NOT TESTED** — Visit/map section: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0237` **NOT TESTED** — Visit/map section: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0238` **NOT TESTED** — Visit/map section: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0239` **NOT TESTED** — Visit/map section: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0240` **NOT TESTED** — Visit/map section: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0241` **NOT TESTED** — Contact section: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0242` **NOT TESTED** — Contact section: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0243` **NOT TESTED** — Contact section: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0244` **NOT TESTED** — Contact section: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0245` **NOT TESTED** — Contact section: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0246` **NOT TESTED** — Owner conversion section: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0247` **NOT TESTED** — Owner conversion section: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0248` **NOT TESTED** — Owner conversion section: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0249` **NOT TESTED** — Owner conversion section: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0250` **NOT TESTED** — Owner conversion section: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.

### 06 Accessibility: Contrast & Readability

*Section scope: Contrast, text sizing, reflow and legibility*

- `SEWA-0251` **NOT TESTED** — Sewa promo bar: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0252` **NOT TESTED** — Sewa promo bar: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0253` **NOT TESTED** — Sewa promo bar: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0254` **NOT TESTED** — Sewa promo bar: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0255` **NOT TESTED** — Sewa promo bar: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0256` **NOT TESTED** — Hero navigation: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0257` **NOT TESTED** — Hero navigation: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0258` **NOT TESTED** — Hero navigation: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0259` **NOT TESTED** — Hero navigation: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0260` **NOT TESTED** — Hero navigation: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0261` **NOT TESTED** — Hero title and category: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0262` **NOT TESTED** — Hero title and category: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0263` **NOT TESTED** — Hero title and category: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0264` **NOT TESTED** — Hero title and category: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0265` **NOT TESTED** — Hero title and category: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0266` **NOT TESTED** — Quick-facts panel: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0267` **NOT TESTED** — Quick-facts panel: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0268` **NOT TESTED** — Quick-facts panel: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0269` **NOT TESTED** — Quick-facts panel: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0270` **NOT TESTED** — Quick-facts panel: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0271` **NOT TESTED** — About section: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0272` **NOT TESTED** — About section: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0273` **NOT TESTED** — About section: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0274` **NOT TESTED** — About section: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0275` **NOT TESTED** — About section: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0276` **NOT TESTED** — Services panel: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0277` **NOT TESTED** — Services panel: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0278` **NOT TESTED** — Services panel: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0279` **NOT TESTED** — Services panel: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0280` **NOT TESTED** — Services panel: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0281` **NOT TESTED** — Opening-hours section: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0282` **NOT TESTED** — Opening-hours section: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0283` **NOT TESTED** — Opening-hours section: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0284` **NOT TESTED** — Opening-hours section: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0285` **NOT TESTED** — Opening-hours section: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0286` **NOT TESTED** — Visit/map section: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0287` **NOT TESTED** — Visit/map section: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0288` **NOT TESTED** — Visit/map section: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0289` **NOT TESTED** — Visit/map section: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0290` **NOT TESTED** — Visit/map section: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0291` **NOT TESTED** — Contact section: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0292` **NOT TESTED** — Contact section: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0293` **NOT TESTED** — Contact section: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0294` **NOT TESTED** — Contact section: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0295` **NOT TESTED** — Contact section: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0296` **NOT TESTED** — Owner conversion section: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0297` **NOT TESTED** — Owner conversion section: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0298` **NOT TESTED** — Owner conversion section: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0299` **NOT TESTED** — Owner conversion section: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0300` **NOT TESTED** — Owner conversion section: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.

### 14 Structured Data & Social Sharing

*Section scope: Schema.org, Open Graph, Twitter cards and preview presentation*

- `SEWA-0651` **NOT TESTED** — Sewa promo bar: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0652` **NOT TESTED** — Sewa promo bar: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0653` **NOT TESTED** — Sewa promo bar: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0654` **NOT TESTED** — Sewa promo bar: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0655` **NOT TESTED** — Sewa promo bar: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0656` **NOT TESTED** — Hero navigation: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0657` **NOT TESTED** — Hero navigation: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0658` **NOT TESTED** — Hero navigation: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0659` **NOT TESTED** — Hero navigation: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0660` **NOT TESTED** — Hero navigation: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0661` **NOT TESTED** — Hero title and category: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0662` **NOT TESTED** — Hero title and category: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0663` **NOT TESTED** — Hero title and category: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0664` **NOT TESTED** — Hero title and category: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0665` **NOT TESTED** — Hero title and category: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0666` **NOT TESTED** — Quick-facts panel: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0667` **NOT TESTED** — Quick-facts panel: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0668` **NOT TESTED** — Quick-facts panel: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0669` **NOT TESTED** — Quick-facts panel: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0670` **NOT TESTED** — Quick-facts panel: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0671` **NOT TESTED** — About section: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0672` **NOT TESTED** — About section: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0673` **NOT TESTED** — About section: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0674` **NOT TESTED** — About section: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0675` **NOT TESTED** — About section: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0676` **NOT TESTED** — Services panel: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0677` **NOT TESTED** — Services panel: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0678` **NOT TESTED** — Services panel: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0679` **NOT TESTED** — Services panel: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0680` **NOT TESTED** — Services panel: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0681` **NOT TESTED** — Opening-hours section: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0682` **NOT TESTED** — Opening-hours section: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0683` **NOT TESTED** — Opening-hours section: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0684` **NOT TESTED** — Opening-hours section: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0685` **NOT TESTED** — Opening-hours section: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0686` **NOT TESTED** — Visit/map section: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0687` **NOT TESTED** — Visit/map section: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0688` **NOT TESTED** — Visit/map section: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0689` **NOT TESTED** — Visit/map section: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0690` **NOT TESTED** — Visit/map section: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0691` **NOT TESTED** — Contact section: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0692` **NOT TESTED** — Contact section: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0693` **NOT TESTED** — Contact section: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0694` **NOT TESTED** — Contact section: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0695` **NOT TESTED** — Contact section: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0696` **NOT TESTED** — Owner conversion section: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0697` **NOT TESTED** — Owner conversion section: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0698` **NOT TESTED** — Owner conversion section: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0699` **NOT TESTED** — Owner conversion section: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0700` **NOT TESTED** — Owner conversion section: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.

### 15 Performance & Loading

*Section scope: Core Web Vitals, image loading, scripts and network conditions*

- `SEWA-0701` **NOT TESTED** — Sewa promo bar: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0702` **NOT TESTED** — Sewa promo bar: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0703` **NOT TESTED** — Sewa promo bar: remains usable at narrow viewport widths. Confirm the implementation matches the page's stated purpose.
- `SEWA-0704` **NOT TESTED** — Sewa promo bar: has an appropriate accessible name. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0705` **NOT TESTED** — Sewa promo bar: has a visible and distinct focus state. Confirm the state is understandable without relying on color alone.
- `SEWA-0706` **NOT TESTED** — Hero navigation: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0707` **NOT TESTED** — Hero navigation: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0708` **NOT TESTED** — Hero navigation: has a visible and distinct focus state. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0709` **NOT TESTED** — Hero navigation: uses readable text and sufficient contrast. Confirm the state is understandable without relying on color alone.
- `SEWA-0710` **NOT TESTED** — Hero navigation: handles missing or malformed data safely. Confirm the result is still clear on a small phone.
- `SEWA-0711` **NOT TESTED** — Hero title and category: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0712` **NOT TESTED** — Hero title and category: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0713` **NOT TESTED** — Hero title and category: handles missing or malformed data safely. Confirm the state is understandable without relying on color alone.
- `SEWA-0714` **NOT TESTED** — Hero title and category: has a meaningful success or failure outcome. Confirm the result is still clear on a small phone.
- `SEWA-0715` **NOT TESTED** — Hero title and category: does not expose private or unnecessary data. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0716` **NOT TESTED** — Quick-facts panel: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0717` **NOT TESTED** — Quick-facts panel: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0718` **NOT TESTED** — Quick-facts panel: does not expose private or unnecessary data. Confirm the result is still clear on a small phone.
- `SEWA-0719` **NOT TESTED** — Quick-facts panel: uses accurate, business-specific content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0720` **NOT TESTED** — Quick-facts panel: uses an appropriate action destination. Confirm the implementation matches the page's stated purpose.
- `SEWA-0721` **NOT TESTED** — About section: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0722` **NOT TESTED** — About section: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0723` **NOT TESTED** — About section: uses an appropriate action destination. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0724` **NOT TESTED** — About section: is localized consistently in both languages. Confirm the implementation matches the page's stated purpose.
- `SEWA-0725` **NOT TESTED** — About section: does not create unexpected layout shifts. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0726` **NOT TESTED** — Services panel: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0727` **NOT TESTED** — Services panel: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0728` **NOT TESTED** — Services panel: does not create unexpected layout shifts. Confirm the implementation matches the page's stated purpose.
- `SEWA-0729` **NOT TESTED** — Services panel: does not block the primary page content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0730` **NOT TESTED** — Services panel: works after a hard refresh on its direct URL. Confirm the state is understandable without relying on color alone.
- `SEWA-0731` **NOT TESTED** — Opening-hours section: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0732` **NOT TESTED** — Opening-hours section: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0733` **NOT TESTED** — Opening-hours section: works after a hard refresh on its direct URL. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0734` **NOT TESTED** — Opening-hours section: behaves consistently after route navigation. Confirm the state is understandable without relying on color alone.
- `SEWA-0735` **NOT TESTED** — Opening-hours section: is represented correctly in assistive technology. Confirm the result is still clear on a small phone.
- `SEWA-0736` **NOT TESTED** — Visit/map section: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0737` **NOT TESTED** — Visit/map section: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0738` **NOT TESTED** — Visit/map section: is represented correctly in assistive technology. Confirm the state is understandable without relying on color alone.
- `SEWA-0739` **NOT TESTED** — Visit/map section: has a sensible fallback when its dependency fails. Confirm the result is still clear on a small phone.
- `SEWA-0740` **NOT TESTED** — Visit/map section: is present and visible. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0741` **NOT TESTED** — Contact section: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0742` **NOT TESTED** — Contact section: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0743` **NOT TESTED** — Contact section: is present and visible. Confirm the result is still clear on a small phone.
- `SEWA-0744` **NOT TESTED** — Contact section: has a clear, understandable label. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0745` **NOT TESTED** — Contact section: works with keyboard-only input. Confirm the implementation matches the page's stated purpose.
- `SEWA-0746` **NOT TESTED** — Owner conversion section: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0747` **NOT TESTED** — Owner conversion section: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0748` **NOT TESTED** — Owner conversion section: works with keyboard-only input. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0749` **NOT TESTED** — Owner conversion section: does not overlap nearby content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0750` **NOT TESTED** — Owner conversion section: remains usable at narrow viewport widths. Confirm its behavior is consistent with the same component on other business previews.

### 18 Localization & Language

*Section scope: English/Nepali translation, language metadata, typography and formats*

- `SEWA-0851` **NOT TESTED** — Sewa promo bar: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0852` **NOT TESTED** — Sewa promo bar: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0853` **NOT TESTED** — Sewa promo bar: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0854` **NOT TESTED** — Sewa promo bar: does not create unexpected layout shifts. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0855` **NOT TESTED** — Sewa promo bar: does not block the primary page content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0856` **NOT TESTED** — Hero navigation: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0857` **NOT TESTED** — Hero navigation: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0858` **NOT TESTED** — Hero navigation: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0859` **NOT TESTED** — Hero navigation: works after a hard refresh on its direct URL. Confirm the implementation matches the page's stated purpose.
- `SEWA-0860` **NOT TESTED** — Hero navigation: behaves consistently after route navigation. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0861` **NOT TESTED** — Hero title and category: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0862` **NOT TESTED** — Hero title and category: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0863` **NOT TESTED** — Hero title and category: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0864` **NOT TESTED** — Hero title and category: is represented correctly in assistive technology. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0865` **NOT TESTED** — Hero title and category: has a sensible fallback when its dependency fails. Confirm the state is understandable without relying on color alone.
- `SEWA-0866` **NOT TESTED** — Quick-facts panel: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0867` **NOT TESTED** — Quick-facts panel: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-0868` **NOT TESTED** — Quick-facts panel: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0869` **NOT TESTED** — Quick-facts panel: is present and visible. Confirm the state is understandable without relying on color alone.
- `SEWA-0870` **NOT TESTED** — Quick-facts panel: has a clear, understandable label. Confirm the result is still clear on a small phone.
- `SEWA-0871` **NOT TESTED** — About section: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0872` **NOT TESTED** — About section: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0873` **NOT TESTED** — About section: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0874` **NOT TESTED** — About section: works with keyboard-only input. Confirm the result is still clear on a small phone.
- `SEWA-0875` **NOT TESTED** — About section: does not overlap nearby content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0876` **NOT TESTED** — Services panel: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0877` **NOT TESTED** — Services panel: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0878` **NOT TESTED** — Services panel: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0879` **NOT TESTED** — Services panel: remains usable at narrow viewport widths. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0880` **NOT TESTED** — Services panel: has an appropriate accessible name. Confirm the implementation matches the page's stated purpose.
- `SEWA-0881` **NOT TESTED** — Opening-hours section: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0882` **NOT TESTED** — Opening-hours section: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0883` **NOT TESTED** — Opening-hours section: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0884` **NOT TESTED** — Opening-hours section: has a visible and distinct focus state. Confirm the implementation matches the page's stated purpose.
- `SEWA-0885` **NOT TESTED** — Opening-hours section: uses readable text and sufficient contrast. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0886` **NOT TESTED** — Visit/map section: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0887` **NOT TESTED** — Visit/map section: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0888` **NOT TESTED** — Visit/map section: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0889` **NOT TESTED** — Visit/map section: handles missing or malformed data safely. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0890` **NOT TESTED** — Visit/map section: has a meaningful success or failure outcome. Confirm the state is understandable without relying on color alone.
- `SEWA-0891` **NOT TESTED** — Contact section: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0892` **NOT TESTED** — Contact section: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0893` **NOT TESTED** — Contact section: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0894` **NOT TESTED** — Contact section: does not expose private or unnecessary data. Confirm the state is understandable without relying on color alone.
- `SEWA-0895` **NOT TESTED** — Contact section: uses accurate, business-specific content. Confirm the result is still clear on a small phone.
- `SEWA-0896` **NOT TESTED** — Owner conversion section: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0897` **NOT TESTED** — Owner conversion section: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0898` **NOT TESTED** — Owner conversion section: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0899` **NOT TESTED** — Owner conversion section: uses an appropriate action destination. Confirm the result is still clear on a small phone.
- `SEWA-0900` **NOT TESTED** — Owner conversion section: is localized consistently in both languages. Confirm it is visible without requiring a user to scroll past the hero.

### 20 QA & Production Readiness

*Section scope: Browser/device checks, deployment evidence, regression and release readiness*

- `SEWA-0951` **NOT TESTED** — Sewa promo bar: behaves consistently after route navigation. Confirm the result is still clear on a small phone.
- `SEWA-0952` **NOT TESTED** — Sewa promo bar: is represented correctly in assistive technology. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0953` **NOT TESTED** — Sewa promo bar: has a sensible fallback when its dependency fails. Confirm the implementation matches the page's stated purpose.
- `SEWA-0954` **NOT TESTED** — Sewa promo bar: is present and visible. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0955` **NOT TESTED** — Sewa promo bar: has a clear, understandable label. Confirm the state is understandable without relying on color alone.
- `SEWA-0956` **NOT TESTED** — Hero navigation: has a sensible fallback when its dependency fails. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0957` **NOT TESTED** — Hero navigation: is present and visible. Confirm the implementation matches the page's stated purpose.
- `SEWA-0958` **NOT TESTED** — Hero navigation: has a clear, understandable label. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0959` **NOT TESTED** — Hero navigation: works with keyboard-only input. Confirm the state is understandable without relying on color alone.
- `SEWA-0960` **NOT TESTED** — Hero navigation: does not overlap nearby content. Confirm the result is still clear on a small phone.
- `SEWA-0961` **NOT TESTED** — Hero title and category: has a clear, understandable label. Confirm the implementation matches the page's stated purpose.
- `SEWA-0962` **NOT TESTED** — Hero title and category: works with keyboard-only input. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0963` **NOT TESTED** — Hero title and category: does not overlap nearby content. Confirm the state is understandable without relying on color alone.
- `SEWA-0964` **NOT TESTED** — Hero title and category: remains usable at narrow viewport widths. Confirm the result is still clear on a small phone.
- `SEWA-0965` **NOT TESTED** — Hero title and category: has an appropriate accessible name. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0966` **NOT TESTED** — Quick-facts panel: does not overlap nearby content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0967` **NOT TESTED** — Quick-facts panel: remains usable at narrow viewport widths. Confirm the state is understandable without relying on color alone.
- `SEWA-0968` **NOT TESTED** — Quick-facts panel: has an appropriate accessible name. Confirm the result is still clear on a small phone.
- `SEWA-0969` **NOT TESTED** — Quick-facts panel: has a visible and distinct focus state. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0970` **NOT TESTED** — Quick-facts panel: uses readable text and sufficient contrast. Confirm the implementation matches the page's stated purpose.
- `SEWA-0971` **NOT TESTED** — About section: has an appropriate accessible name. Confirm the state is understandable without relying on color alone.
- `SEWA-0972` **NOT TESTED** — About section: has a visible and distinct focus state. Confirm the result is still clear on a small phone.
- `SEWA-0973` **NOT TESTED** — About section: uses readable text and sufficient contrast. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0974` **NOT TESTED** — About section: handles missing or malformed data safely. Confirm the implementation matches the page's stated purpose.
- `SEWA-0975` **NOT TESTED** — About section: has a meaningful success or failure outcome. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0976` **NOT TESTED** — Services panel: uses readable text and sufficient contrast. Confirm the result is still clear on a small phone.
- `SEWA-0977` **NOT TESTED** — Services panel: handles missing or malformed data safely. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0978` **NOT TESTED** — Services panel: has a meaningful success or failure outcome. Confirm the implementation matches the page's stated purpose.
- `SEWA-0979` **NOT TESTED** — Services panel: does not expose private or unnecessary data. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0980` **NOT TESTED** — Services panel: uses accurate, business-specific content. Confirm the state is understandable without relying on color alone.
- `SEWA-0981` **NOT TESTED** — Opening-hours section: has a meaningful success or failure outcome. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0982` **NOT TESTED** — Opening-hours section: does not expose private or unnecessary data. Confirm the implementation matches the page's stated purpose.
- `SEWA-0983` **NOT TESTED** — Opening-hours section: uses accurate, business-specific content. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0984` **NOT TESTED** — Opening-hours section: uses an appropriate action destination. Confirm the state is understandable without relying on color alone.
- `SEWA-0985` **NOT TESTED** — Opening-hours section: is localized consistently in both languages. Confirm the result is still clear on a small phone.
- `SEWA-0986` **NOT TESTED** — Visit/map section: uses accurate, business-specific content. Confirm the implementation matches the page's stated purpose.
- `SEWA-0987` **NOT TESTED** — Visit/map section: uses an appropriate action destination. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0988` **NOT TESTED** — Visit/map section: is localized consistently in both languages. Confirm the state is understandable without relying on color alone.
- `SEWA-0989` **NOT TESTED** — Visit/map section: does not create unexpected layout shifts. Confirm the result is still clear on a small phone.
- `SEWA-0990` **NOT TESTED** — Visit/map section: does not block the primary page content. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0991` **NOT TESTED** — Contact section: is localized consistently in both languages. Confirm its behavior is consistent with the same component on other business previews.
- `SEWA-0992` **NOT TESTED** — Contact section: does not create unexpected layout shifts. Confirm the state is understandable without relying on color alone.
- `SEWA-0993` **NOT TESTED** — Contact section: does not block the primary page content. Confirm the result is still clear on a small phone.
- `SEWA-0994` **NOT TESTED** — Contact section: works after a hard refresh on its direct URL. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0995` **NOT TESTED** — Contact section: behaves consistently after route navigation. Confirm the implementation matches the page's stated purpose.
- `SEWA-0996` **NOT TESTED** — Owner conversion section: does not block the primary page content. Confirm the state is understandable without relying on color alone.
- `SEWA-0997` **NOT TESTED** — Owner conversion section: works after a hard refresh on its direct URL. Confirm the result is still clear on a small phone.
- `SEWA-0998` **NOT TESTED** — Owner conversion section: behaves consistently after route navigation. Confirm it is visible without requiring a user to scroll past the hero.
- `SEWA-0999` **NOT TESTED** — Owner conversion section: is represented correctly in assistive technology. Confirm the implementation matches the page's stated purpose.
- `SEWA-1000` **NOT TESTED** — Owner conversion section: has a sensible fallback when its dependency fails. Confirm its behavior is consistent with the same component on other business previews.

## Related audit record

For the wider audit summary, production listing data snapshot, preview-eligible business findings, analytics, source register, limitations and recommended next work, see [`AUDIT-RESULTS.md`](./AUDIT-RESULTS.md).

## Source artifact

This checklist was converted from the seven-sheet workbook `sewa_shared_website_preview_1000_point_audit_updated.xlsx`. The checklist IDs, criteria, section names, priorities, statuses, awarded points and reviewed evidence notes are preserved. The workbook itself remains a separate local artifact; this Markdown file is the Git-tracked, human-readable checklist.
