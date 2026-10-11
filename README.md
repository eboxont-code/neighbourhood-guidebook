# Neighbourhood Guidebook

Build a public local-business directory. Working name Boxont, read from one config field so it can be renamed later. Example area: New Baneshwor, Kathmandu. Categories are data. Start with a few, including salons and barbers and one other, so it is not a salon product.

A person should find a business and read its name, type, area, phone, hours, website, and whether that website was checked. It sits beside Google Maps. Directions leave this site and open a map. This site does not draw a map.

This version is a front-end prototype with sample data. Sample shops are obviously fictional, labelled "Sample listing. Not a real business.", and the pages are noindex. No login, no booking, no payments, no reviews, no scraping.

Routes: /  /search  /area/:areaSlug  /category/:categorySlug  /s/:slug  /about  /privacy  /contact  /suggest-correction  /website-help

One business record for every screen: id, slug, name, category, area, optional address, phone, WhatsApp, website, website status, description, services, hours, source notes, verification, last checked, demo flag. Website status is one of: checked and working, last check failed, owner says no website, no official site found, not checked. Show these as sentences, with a date only when a check happened. Verification is separate: not verified, checked against a source, confirmed by the business.

Homepage: a short line saying what the directory holds, a search box, links to the categories and areas that have businesses, and a short list of cards. A card shows name, category, area, a sample banner, and one line that is the phone or the website status. The card opens /s/{slug}.

Shop page, in this order: name, category and area as links, sample banner, description if any, then an action row. Call only if there is a phone, using tel:. Visit website only if there is a URL. WhatsApp only if there is a number, via wa.me with a short greeting. Get directions only if there is an address, as a Maps search link. Then hours, or "Hours not recorded." Then services as a clean list if any. Then the website-status sentence, the source, and the verification line. Name, area, and phone must be in the first HTML.

English is default. An EN | ने control switches interface labels and remembers the choice. It does not translate the shop name, address, phone, hours, or description.

Footer pages are real, each one heading and one paragraph: About the directory, Suggest a correction, Website help, Privacy, Contact. Website help says a simple site may be offered later and is not open yet. No form that says a message was sent.

Look: warm paper background, charcoal text, one quiet accent, serif for the shop name, sans for the interface. Compact cards, clear dividers, easy to read on a phone. Action buttons tall enough for a thumb. No stars, no review counts, no stock photos of shops. A letter monogram where a photo would be.

Search matches name, category, area, and services. A query with no match shows an empty state and invents nothing. Unknown slugs show not found, with a way home.

Done when a phone can search, open a sample shop, tap Call, switch to ने and back, and the shop name is unchanged.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://neighbourhood-guidebook.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eea9eb1c-ede6-406c-be8d-be327f7340e2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
