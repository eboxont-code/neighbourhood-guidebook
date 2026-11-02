# SEWA by Boxont

SEWA is a neighbourhood-first guide to real businesses and everyday services. It helps people discover local places, understand the information available about them, and take a useful next step. SEWA is a Boxont product.

## Product principles

- Publish real businesses and clearly distinguish unknown information from verified information.
- Preserve original business names, addresses, phone numbers, opening hours and descriptions.
- Show where important information came from and when it was checked.
- Never invent business details, reviews, ratings, opening hours or verification claims.
- Keep discovery free and make owner-facing services clear and optional.
- Treat English and Nepali as first-class interface languages.
- Keep the public experience fast, accessible and comfortable on mobile devices.

## Current capabilities

- Neighbourhood and category discovery.
- Search by business name, category, area and recorded services, including supported English and Nepali terms.
- Business profiles with available contact actions, directions, opening hours and source disclosures.
- Saved listings and nearby discovery.
- Opening-status calculations using Kathmandu local time, only when the recorded schedule can be interpreted.
- Business suggestions, correction reports, owner claims and enquiry submissions.
- A private administration area for listings, submissions, claims, leads and anonymous usage insights.
- Shared website previews for eligible business profiles.
- Canonical metadata, structured business data, breadcrumbs and an XML sitemap.

## Application structure

- `src/routes` contains public, business-owner and administration routes.
- `src/components` contains reusable interface components.
- `src/data/directory.ts` contains the bundled listing snapshot and fixed location/category definitions.
- `src/lib` contains search, hours, location, provenance, verification, analytics and business rules.
- `src/integrations` contains the database client and generated database types.
- `supabase/migrations` contains the ordered database migrations used by the deployed database.
- `drizzle/migrations` mirrors the database migration history. Keep both migration histories aligned.
- `src/test` contains automated rule, component and database-contract tests.

## Requirements

- Node.js 22
- npm
- A configured database project for local or deployed data

## Local setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env` and fill in the local database values.

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Run the quality checks:

   ```sh
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```

Never commit `.env`, production credentials, service-role keys or private deployment values. Only publishable credentials may use the browser-exposed `VITE_` variables.

## Database changes

Create database changes as forward-only SQL migrations. Add the migration to `supabase/migrations`, mirror it in `drizzle/migrations`, and update the Drizzle migration journal when required. Do not rewrite migrations that have already been applied to a shared or production database.

Before deployment, confirm that the target database has applied every migration in chronological order. Review row-level security policies, grants, constraints and triggers for every new table or operation.

## Deployment checklist

- Quality checks pass on the proposed commit.
- Required environment values exist in the deployment environment.
- Database migrations are applied and verified.
- Public listing data has traceable sources and acceptable freshness.
- Administration operations are protected by database policies, not only interface checks.
- Canonical URLs, sitemap entries, robots rules and structured data use the SEWA production domain.
- Mobile, desktop, English and Nepali journeys have been checked.
- No private credentials, customer data or precise device coordinates appear in logs or repository files.

## Brand and authorship

The public product is **SEWA** and the owning brand is **Boxont**. Project-authored interface copy, documentation, metadata, commit messages and generated project content must use SEWA or Boxont identity only. Do not introduce unrelated company, product, person or competitor names into authored content. Do not alter real business names in directory records, required technical identifiers, dependencies, protocols or legally required notices.

## Production domain

[https://sewa.boxont.com](https://sewa.boxont.com)
