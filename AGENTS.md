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

- All listing data lives in src/data/directory.ts as one Business shape used by every screen; swap this module for a real data source later.
- Interface strings go through src/lib/i18n.tsx; business data is never translated.
- Form submissions insert straight from the browser into insert-only tables (anonymous INSERT allowed, no read access); zod limits mirror the table CHECK limits.
- Renamed listing or category slugs stay reachable through the redirect maps in src/data/directory.ts, so old links keep working.
- Open/closed status is computed only after mount in Asia/Kathmandu time, so the first HTML never mismatches.
