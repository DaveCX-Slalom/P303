# Active Context

_Last updated: 2026-11-06 (Session 2)_

## Current focus
The app is feature-complete for the brief and the improvement round. Remaining: push, confirm the Vercel redeploy, and try it on a real phone.

## Next steps
1. Push `main` and confirm https://protogen303.vercel.app/ shows the new build.
2. Test on a real phone (install to home screen, offline code, brightness, swipe to clip, checkout mode).
3. Optional polish: more stores' layouts, richer notifications, more rewards.

## Open questions
- None blocking.

## Notes for next session
- Run `npm run check` before finishing any change: unit tests, build, browser audit, e2e. Add an e2e step for a new flow and a unit test for new logic in `src/utils/`.
- Demo switches for states: `?mock=error`, `?mock=empty`, or per area (`?mock=error-offers`, `empty-history`, `error-member`, ...).
- Offline: DevTools > Network > Offline. The code stays visible, clips queue and sync on reconnect.
- First visit shows the intro (`fm-onboarded` in localStorage). Tests and scripts set it to skip.
- Browser tooling uses system Chrome via playwright-core (override with `CHROME_PATH`). `npm run demo` re-records docs/demo.gif; `npm run icons` re-renders icons.
- Gotchas found: `useOnline()` is read-only (tests drive it with window events); Node 26 ships a global `localStorage` that shadows jsdom's (see tests/setup.js); a sheet's focused button disabling itself drops focus to body (Sheet.vue now listens at document level and reclaims focus).
