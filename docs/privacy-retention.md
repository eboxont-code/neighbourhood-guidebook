# Sewa privacy and retention

Reviewed 18 November 2026 against forms, first-party event payloads and local discovery code.

- Enquiries retain submitter name, business name, optional contact, message, selected service/budget and originating listing/page.
- Claims retain claimant details, proof link, requested changes and notes. Suggestions and corrections retain their submitted fields. These records are private to administrators under the recorded access policies.
- Events retain event name, listing slug, approved search labels, language, path and timestamp. They are intent counts, not proof of calls or sales.
- Exact discovery location remains in device session storage. Saved slugs and language stay on the device.
- No automatic retention schedule exists for submissions, accounts, review notes or events. Owner must approve periods, deletion responsibility and handling of exports before implementing deletion.
- Rate-limit hashes older than one day are removed when a subsequent form invokes the rate-limit trigger, not on a daily timer.
- Database backup inventory and exported-copy retention must be reviewed separately. Deletion in the application does not remove downloaded copies.
- Use the public contact form for data requests. Verify the requester before deleting private records. Do not disclose other submitters' details.

Public privacy page checked in English and Nepali at 390 × 844 and 1280 × 1800: no horizontal overflow. No layout change required. Screenshots reviewed in this session; temporary capture directory `/tmp/browser/sewa-18/`. Production settings and deletion behaviour remain unverified.