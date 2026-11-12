# Lovable design-prompt standard for SEWA / Boxont

Use this standard when a task needs substantial layout, interaction, responsive-design or user-journey work through the connected Lovable project. It is a prompt-writing standard, not permission to select an uncertain project, change production, publish, deploy or spend money.

A good prompt is detailed and self-contained. It should be long enough that the goal, existing context, boundaries and proof of completion are clear without relying on old chat messages. Do not add filler or invent facts to make it longer.

## Required prompt sections

1. **Goal and outcome**
   - State the user problem and the business outcome.
   - Name the audience and the journey that should improve.
   - Explain what successful behaviour looks like and what must not be optimised at the expense of trust, accessibility or accuracy.

2. **Exact project and current state**
   - Identify the exact Lovable project and the pages/routes involved.
   - Inspect the current implementation before editing: existing components, styles/tokens, responsive behaviour, translations, data sources, integrations and tests.
   - Locate and read the existing Lovable north-star/knowledge file. Preserve it verbatim; do not replace or silently rewrite it.
   - Separate verified current behaviour from assumptions. If the project or required source material cannot be positively identified, do not guess.

3. **User journey and states**
   - Describe where the user starts, the actions they take, what they should see next and the intended end state.
   - Include relevant loading, empty, validation, error, success, permission-denied and returning-user states.
   - Identify the mobile and desktop contexts and any state that changes the layout or available actions.

4. **Requested work and boundaries**
   - List the exact pages, components, content and interactions that may change.
   - List explicit non-goals and neighbouring features that must remain unchanged.
   - Reuse existing patterns and assets. Make the smallest complete change; do not redesign unrelated routes or introduce a new architecture just for convenience.

5. **Design, content and accessibility constraints**
   - Treat 390 CSS pixels as the primary phone review width, then check a relevant desktop width. Include other widths only when the affected layout needs them.
   - Preserve natural English and Nepali meaning, matching actions and placeholders. Business names and business-supplied facts stay in their recorded form.
   - Follow the existing design tokens, component patterns, navigation and brand hierarchy.
   - Cover keyboard use, visible focus, labels, contrast, comfortable touch targets, text wrapping and reduced-motion behaviour where relevant.
   - Do not rely on colour, animation or visual decoration alone to communicate an important state.

6. **Data, privacy and commercial constraints**
   - Use only existing, source-supported business facts and assets with clear permission. Do not invent services, opening hours, locations, photos, ratings, testimonials, verification, owner approval or customer outcomes.
   - Do not expose names, contact details, account identifiers or precise device coordinates to analytics or logs.
   - Do not change database schemas, grants, row-level security, authentication, secrets or production data unless the task explicitly authorises that exact work and the migration/release gates are satisfied.
   - Keep additional expenditure at $0. Do not add paid services, APIs, subscriptions, credits or billable resources.
   - Do not send outreach, publish prices, or promise delivery terms without owner approval.

7. **Numbered acceptance criteria**
   - Write criteria as observable outcomes, preferably in “Given / When / Then” form.
   - Cover the primary journey, affected responsive states, English and Nepali, accessibility, and relevant error/empty/success behaviour.
   - State what must remain unchanged. Avoid subjective criteria such as “looks premium” unless paired with concrete evidence a reviewer can inspect.

8. **Verification and evidence**
   - Name the tests, checks and build that should be run. Report each as passed, failed, blocked or not run based on the actual result.
   - For visual changes, capture the affected route and important states at 390 CSS pixels and a relevant desktop viewport. Attach the actual screenshots or durable artifact links, with route, viewport, state and exact commit identified; open and inspect the images before approval.
   - Identify the exact preview and commit being reviewed. A preview, green CI result or local build is not proof of production release.
   - If a required browser, screenshot, test account, source fact or owner decision is unavailable, leave that criterion unverified and state the precise blocker.

9. **Delivery report**
   - Summarise what changed in everyday language and list the affected pages/files.
   - Record tests and their actual outcomes, screenshots inspected, preview URL, exact commit, deployment state and any remaining limitation.
   - Do not publish or deploy as part of the design prompt unless the existing release workflow and all release gates explicitly permit it.

## Reusable prompt template

Copy this structure and replace every bracketed item with verified project-specific information. Remove sections that genuinely do not apply, but do not omit the goal, scope, constraints, acceptance criteria or verification plan.

> **Project:** [Exact Lovable project name/identifier, positively confirmed]
>
> **Goal:** [User problem and measurable business/user outcome]
>
> **Audience and journey:** [Who uses this, where they start, what they do, and the intended result]
>
> **Current state and evidence:** [Exact routes/screens, existing behaviour, relevant components/data, screenshots and known defects. Distinguish observed facts from assumptions.]
>
> **North-star and existing patterns:** Read and preserve the existing Lovable north-star/knowledge file verbatim. Reuse [existing components, design tokens, navigation, translations and interaction patterns]. Do not silently change the product direction.
>
> **Requested changes:** [Numbered list of the precise screens, content, layout and interactions to change]
>
> **Out of scope:** [Pages, data, features, integrations and behaviour that must not change]
>
> **Constraints:** [390 CSS-pixel phone layout, relevant desktop layout, EN/NE parity, accessibility, performance, privacy, $0 spend, existing architecture, data-source and brand rules]
>
> **Acceptance criteria:**
> 1. [Given / When / Then outcome]
> 2. [Given / When / Then outcome]
> 3. [Responsive and language outcome]
> 4. [Accessibility and state-handling outcome]
> 5. [Required unchanged behaviour]
>
> **Verification:** [Tests, typecheck, lint, build, browser journeys and screenshots to capture and inspect. State which environments/accounts are available.]
>
> **Delivery:** Make the smallest complete change. Report what changed, what was tested, the actual results, screenshots and exact preview/commit, what remains unverified, and whether anything is actually live. Do not invent evidence or bypass release gates.

## When not to use the full template

A small typo correction or narrowly scoped defect may use a shorter prompt. It must still state the exact target, intended result, constraints and a testable acceptance check. Use the full structure whenever a task changes a multi-step journey, page hierarchy, responsive layout, shared design system or several connected screens.
