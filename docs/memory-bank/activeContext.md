# Active Context

_Last updated: 2026-11-06 (Session 1)_

## Current focus
App is built end to end (all 4 views plus Settings). Now: verify in a browser and on a phone, then deploy.

## Next steps
1. Run `npm run dev` and check every view at 320/375/768px, at 200% text, offline (DevTools), and with `?mock=error` / `?mock=empty`.
2. Fix anything the check turns up (contrast, touch targets, layout).
3. Turn on password protection for the Vercel deploy (https://protogen303.vercel.app/ is currently public) and test on a real phone.
4. Sync BRIEF.md and docs with the final build.

## Open questions
- None blocking. Aisle map and redeem confirmation were decided (see decisions.md #7, #8).

## Notes for next session
- Demo switches for states: `?mock=error`, `?mock=empty`, or per area (`?mock=error-offers`, `empty-history`, ...).
- Offline: DevTools > Network > Offline. The code stays visible, clips queue and sync on reconnect.
- PWA icons are generated placeholders in `public/`. The tab-bar icons are simple inline SVGs.
- Not yet verified in a browser: the build compiles, but runtime behaviour has not been exercised.
