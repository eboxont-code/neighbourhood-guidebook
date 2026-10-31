<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Listings live in the database `listings` table (columns for slug/city/area/category/status/sort_order, the rest of the Business shape in `data` jsonb); the root beforeLoad loads published rows via src/lib/listings.ts (60s cache) into the live `businesses` array, and the router dehydrates them so server and browser render the same set.
- If the listings query fails or the table is missing, the bundled snapshot in src/data/directory.ts stays in place and only a console error is logged; keep that snapshot as the fallback.
- Areas, categories and code redirect maps stay in src/data/directory.ts; slug renames made in /admin are recorded by a database trigger in `slug_redirects` and redirect permanently.
- The admin role is granted by hand in `user_roles`; public sign-up is off and no users or roles are seeded. /admin writes straight from the browser under RLS checked by has_role.
- Interface strings go through src/lib/i18n.tsx; business data is never translated.
- Form submissions insert straight from the browser into insert-only tables (anonymous INSERT allowed, no read access); zod limits mirror the table CHECK limits.
- Open/closed status is computed only after mount in Asia/Kathmandu time, so the first HTML never mismatches.
- Form spam is stopped by a hidden honeypot in the browser and a BEFORE INSERT database trigger that rate-limits by hashed IP and per-tab key; no captcha, so real people see no extra step.
- Page head tags come from pageMeta in src/lib/seo.ts and listing JSON-LD from businessJsonLd, built only from recorded fields so nothing is invented.
- URLs are /{city}, /{city}/{area-or-category}, /a/{area}/{category} and /s/{listing}; area and category slugs must never collide. Legacy single-segment /a/* and /c/* redirect permanently into the city scheme. local-pages.ts owns the real-listing threshold shared by local pages, their parent links and sitemap.
- Leaflet is imported only by src/components/listing-map.tsx, loaded lazily after mount through MapView, so server rendering never touches it.
- The /new page uses recentlyVerified to order all listings by recorded check date, undated last; home and area additions keep newListings and the New badge rule. Relative ages render only after mount.
- Field provenance is derived centrally by provenance.ts from explicit fieldSources or conservative recorded evidence; nearby.ts applies coordinate-only distance limits, and verification.ts owns freshness ordering and buckets so views share the same rules.
- /s/{listing}/website-preview (src/routes/s.$slug_.website-preview.tsx) is one shared free website preview template built only from the listing fields; it hides the directory header, footer and bottom nav, is noindex and must stay out of the sitemap. Its "Make this my website" button opens /for-businesses?from=preview&listing=…, which prefills the quote form and saves the message with page "preview". The listing page links to it only when offersPreview (src/lib/preview.ts) is true.
- contact_messages doubles as the sales lead list: each row has a status (new, contacted, quoted, won, lost), a private admin_note and status_changed_at, changed only by admins in the /admin Leads tab (src/lib/leads.ts holds the status and source helpers). Visitors can insert only the form columns. The page column tags the source: preview, claim (owner buttons on a listing, via /contact?from=claim), for-businesses, listing or contact.
- One listing owner panel follows the mobile action row and contains the single claim and eligible preview destinations; offersPreview also includes unchecked listings with no recorded website so unknown websites are not excluded.
- branches.ts groups explicit recorded brands only, using the snapshot as fallback for older live records without brand metadata; this preserves established branch evidence without guessing from names.
- Location stays in browser session storage for local distance calculations; location-redaction.ts sanitizes error contexts and breadcrumbs before application telemetry so coordinate objects are never serialized.
