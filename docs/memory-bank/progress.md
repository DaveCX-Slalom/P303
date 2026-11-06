# Progress

## Done
- [x] BRIEF.md, README, LICENSE, CLAUDE.md
- [x] Memory bank organised in docs/memory-bank/
- [x] Vue scaffold, router, tab bar

## In progress
- [ ] Accessibility, touch-target, small-screen pass (built to spec; needs verification in a browser at 320/375/768px, 200% text, AA contrast)

## To do
- [x] Design tokens and base components
- [x] Mock API and member data
- [x] Pocket view (scannable code)
- [x] Offers view (clip/unclip, expiry)
- [x] Stores view (locator, aisle sections)
- [x] History view (timeline, redeem)
- [x] Settings-lite (preferred store, notification toggle)
- [x] Offline mode, queued clips, connectivity banner
- [x] Empty and error states across views
- [x] PWA manifest and service worker
- [ ] Test on a real phone (manual)
- [x] docs/user-flows.md and docs/design-tokens.md
- [x] Deployed to Vercel: https://protogen303.vercel.app/
- [ ] Turn on password protection (the site answers publicly right now)
- [ ] Sync BRIEF.md and docs with final build

## Session log
| Date | Session | Summary |
|------|---------|---------|
| 2026-11-06 | 1 | Pulled repo, organised docs into docs/memory-bank/, added BRIEF.md (renamed from P303_BRIEF.md). No app code yet. |
| 2026-11-06 | 1 (cont.) | Built the full app: tokens, mock API, stores, 4 views plus Settings, offline queue, PWA. `npm run build` passes. Not yet checked in a browser or on a phone. |
