# DailyMood Journal – Legal Site (Static)

This folder is a tiny static site intended for App Store / Google Play “Privacy Policy URL” and “Terms URL”.
The Privacy and Terms pages are generated from the app's legal source files in `lib/legal/`.

## Pages

- `/privacy` → `legal-site/privacy/index.html`
- `/terms` → `legal-site/terms/index.html`

## Source of truth

- `lib/legal/privacy.ts`
- `lib/legal/terms.ts`

## Generate pages

From the project root:

```bash
npm run legal:build
```
