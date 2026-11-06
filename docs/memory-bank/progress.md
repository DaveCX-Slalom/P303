# Progress

## Done
- [x] BRIEF.md, README, LICENSE, CLAUDE.md
- [x] Memory bank organised in docs/memory-bank/
- [x] Vue scaffold, router, tab bar
- [x] Design tokens (light and dark) and base components
- [x] Mock API and member data (seeded, matches the brief's sizes)
- [x] Pocket view (scannable code, best offer, count-up points, tier progress)
- [x] Offers view (clip/unclip, expiry, search, section and ending-soon filters, sort, details sheet)
- [x] Stores view (locator, floor-plan map, section list)
- [x] History view (chart, filters, details, redeem bottom sheet with confetti)
- [x] Settings-lite (preferred store, notifications, theme, install, replay intro)
- [x] Offline mode, queued clips, connectivity banner
- [x] Empty and error states across views (illustrated)
- [x] Accessibility, touch-target, small-screen pass, verified by automated audit
- [x] PWA manifest, service worker, icons from the logo, shortcuts, screenshots
- [x] docs/user-flows.md and docs/design-tokens.md
- [x] Deployed to Vercel: https://protogen303.vercel.app/
- [x] Password protection waived by owner (exercise project, invented data only)
- [x] Improvement round: checkout mode, shopping list, rewards and tier perks, inbox, dark mode, intro, brand, store map, history chart, install prompt
- [x] Tests: 52 unit tests, browser audit (axe), 21 e2e flows
- [x] README with demo GIF, screenshots, architecture diagram; BRIEF.md synced ("As built")

## In progress
- [ ] Push and redeploy the improvement round (Vercel redeploys from `main`)

## To do
- [ ] Test on a real phone (manual)
- [ ] Optional: real barcode symbology and a real notification backend (out of scope for the mock)

## Session log
| Date | Session | Summary |
|------|---------|---------|
| 2026-11-06 | 1 | Pulled repo, organised docs into docs/memory-bank/, added BRIEF.md (renamed from P303_BRIEF.md). No app code yet. |
| 2026-11-06 | 1 (cont.) | Built the full app: tokens, mock API, stores, 4 views plus Settings, offline queue, PWA. Deployed to Vercel. |
| 2026-11-06 | 2 | Improvement round (14 items): checkout mode, best-offer card, brand and illustrations, offer details, dark mode, rewards and tier perks, shopping list, search/filter/sort, store map, history chart, inbox, install polish, tests, docs. Browser audit clean; 52 unit and 21 e2e tests pass. |
