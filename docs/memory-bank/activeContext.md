# Active Context

_Last updated: 2026-11-06 (Session 2)_

## Current focus
The app is complete and deployed (https://protogen303.vercel.app/). The owner has tested it on a real phone. Ready to share.

## Next steps
1. Nothing required. Optional polish: more store layouts, richer notifications, more rewards.
2. Use `/check` before any change ships, and `/end-session` to close a session.

## Open questions
- None blocking.

## Notes for next session
- Run `npm run check` before finishing any change: unit tests, build, browser audit, e2e. Add an e2e step for a new flow and a unit test for new logic in `src/utils/`.
- Demo switches for states: `?mock=error`, `?mock=empty`, or per area (`?mock=error-offers`, `empty-history`, `error-member`, ...).
- Offline: DevTools > Network > Offline. The code stays visible, clips queue and sync on reconnect.
- First visit shows the intro (`fm-onboarded` in localStorage). Tests and scripts set it to skip.
- Browser tooling uses system Chrome via playwright-core (override with `CHROME_PATH`). `npm run demo` re-records docs/demo.gif; `npm run icons` re-renders icons.
- Gotchas found: `useOnline()` is read-only (tests drive it with window events); Node 26 ships a global `localStorage` that shadows jsdom's (see tests/setup.js); a sheet's focused button disabling itself drops focus to body (Sheet.vue now listens at document level and reclaims focus).
