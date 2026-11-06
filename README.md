# Loyalty Pocket

A mobile-first web app for in-store loyalty members: show the member code, surface the best offers, and check points in under 10 seconds, one-handed.

**Live site:** _add Vercel URL here_ (password-protected). Best viewed on a phone.

## What it does
- **Pocket:** scannable member code, points, tier progress (works offline)
- **Offers:** clip/unclip, sorted for the current store, expiry countdowns
- **Stores:** locator, hours, aisle sections
- **History:** points timeline and simulated redeem

## Data
All data is **invented** (fictional brand "Fieldmarket") and served by a mock API. It contains no client or Slalom information.

## Tech
Vue 3, Vite, Vue Router, Pinia, VueUse, vite-plugin-pwa.

## Run locally
```bash
npm install
npm run dev
```
Build: `npm run build`

## Repo guide
- `BRIEF.md`: the plan (user, flows, design direction)
- `CLAUDE.md` and `docs/memory-bank/`: AI context, decisions, and progress
- `src/`: `views/`, `components/`, `stores/`, `api/`

## License
MIT. See `LICENSE`.
