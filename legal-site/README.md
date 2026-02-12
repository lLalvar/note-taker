# DailyMood Journal – Legal Site (Static)

This folder is a tiny static site intended for App Store / Google Play “Privacy Policy URL” and “Terms URL”.
The Privacy and Terms pages are generated from the app's legal source files in `lib/legal/`.

## Pages

- `/` → `legal-site/index.html` (landing)
- `/privacy/` → `legal-site/privacy/index.html`
- `/terms/` → `legal-site/terms/index.html`

## Source of truth

- `lib/legal/privacy.ts`
- `lib/legal/terms.ts`

## Generate pages

From the project root:

```bash
npm run legal:build
```

With a base URL (for canonical URLs, Open Graph, and sitemap):

```bash
LEGAL_SITE_URL=https://legal.yourdomain.com npm run legal:build
```

When `LEGAL_SITE_URL` is set, the script generates `sitemap.xml` and updates `robots.txt` with the correct Sitemap URL. Generated privacy/terms pages get canonical and og:url meta tags. `sitemap.xml` is in `.gitignore`; generate it at deploy time with your real domain.

## SEO

- **robots.txt** – Allows all crawlers; points to `sitemap.xml` (updated when `LEGAL_SITE_URL` is set).
- **sitemap.xml** – Generated when `LEGAL_SITE_URL` is set. Lists `/`, `/privacy/`, `/terms/`.
- **Meta** – Each page has `description`, `canonical` (when URL set), Open Graph and Twitter Card tags.
- **Landing (index.html)** – Replace `YOUR_DOMAIN` in the canonical and og meta tags with your live domain (e.g. `legal.yourdomain.com`), or run the generator with `LEGAL_SITE_URL` and consider generating the landing from the script if you want it automated.
