# CLAUDE.md: P303 "Loyalty Pocket"

## Start every session by
1. Reading `BRIEF.md` and everything in `docs/memory-bank/`.
2. Checking `activeContext.md` for the current focus and `progress.md` for what's done.

## End every session by
Updating `activeContext.md` and `progress.md`, and logging any new choice in `decisions.md`.

## Project
Mobile-first responsive web app for a loyalty member in a store (fictional brand "Fieldmarket"). One job: member code, best offers, and points in under 10 seconds. Invented data only. No client or Slalom information.

## Stack
Vue 3 + Vite, Vue Router, Pinia, VueUse (`useOnline`, `useStorage`), `qrcode`, vite-plugin-pwa. Deployed on Netlify/Vercel, password-protected.

## Conventions
- Design for 375px first. Test at 320px and 768px.
- Views in `src/views/` (Pocket, Offers, Stores, History). Shared UI in `src/components/`.
- Stores in `src/stores/` (member, offers, connectivity). Mock API in `src/api/mock.js` with artificial latency.
- Tokens are CSS variables in `src/assets/tokens.css`. Never hardcode colors.
- Touch targets are at least 48px. Primary actions in the bottom 40% of the screen. Every gesture (swipe to clip) needs a visible button alternative.
- Bottom tab bar navigation. No hamburger menus.
- Every view needs loading, empty, error, and offline states.
- The member code must work offline (cached).

## Commits
Small and descriptive, imperative mood (e.g. `Add offline queue for clipped offers`). No `update` or `fix` alone.

## Definition of done (per view)
Works one-handed at 375px, all four states handled, AA contrast, text scales to 200%, matches BRIEF.md.
