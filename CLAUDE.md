# CLAUDE.md: P303 "Loyalty Pocket"

## Start every session by
1. Reading `BRIEF.md` and everything in `docs/memory-bank/`.
2. Checking `activeContext.md` for the current focus and `progress.md` for what's done.

## End every session by
Updating `activeContext.md` and `progress.md`, and logging any new choice in `decisions.md`.

## Project
Mobile-first responsive web app for a loyalty member in a store (fictional brand "Fieldmarket"). One job: member code, best offers, and points in under 10 seconds. Invented data only. No client or Slalom information.

## Stack
Vue 3 + Vite, Vue Router, Pinia, VueUse (`useOnline`, `useStorage`, `useWakeLock`), `qrcode`, vite-plugin-pwa. Tests: Vitest (unit) and playwright-core + axe-core driving system Chrome (audit, e2e). Deployed on Vercel at https://protogen303.vercel.app/. Password protection was waived by the owner (exercise project, invented data; see decisions.md #12).

## Conventions
- Design for 375px first. Test at 320px and 768px.
- Views in `src/views/` (Pocket, Offers, Stores, History, plus Rewards, List, Inbox, Settings, Checkout, Welcome). Shared UI in `src/components/`.
- Stores in `src/stores/` (member, offers, list, notifications, connectivity). Mock API in `src/api/mock.js` with artificial latency.
- Pure logic (ranking, filters, history, rewards, list grouping) lives in `src/utils/` so it can be unit tested. Keep it free of Vue and storage.
- Any overlay uses `components/Sheet.vue` (focus trap, Esc, focus return). Do not hand-roll dialogs.
- Name controls by their visible text; avoid `aria-label`s that differ from it (axe `label-content-name-mismatch`).
- Tokens are CSS variables in `src/assets/tokens.css`. Never hardcode colors.
- Touch targets are at least 48px. Primary actions in the bottom 40% of the screen. Every gesture (swipe to clip) needs a visible button alternative.
- Bottom tab bar navigation. No hamburger menus.
- Every view needs loading, empty, error, and offline states.
- The member code must work offline (cached).

## Verify before you finish
`npm run check` runs unit tests, the build, the browser audit (axe, 44px targets, overflow, console errors at 320/375/768, light and dark) and the end-to-end flows. Add an e2e step when you add a flow, and a unit test when you add logic to `src/utils/`.

## Commits
Small and descriptive, imperative mood (e.g. `Add offline queue for clipped offers`). No `update` or `fix` alone.

## Definition of done (per view)
Works one-handed at 375px, all four states handled, AA contrast, text scales to 200%, matches BRIEF.md.
