# Decisions Log

| # | Date | Decision | Why | Alternatives |
|---|------|----------|-----|--------------|
| 1 | 2026-11-06 | Bottom tab bar with 4 tabs | Thumb-zone, one-handed use | Hamburger menu |
| 2 | 2026-11-06 | Member code is the home screen | The in-store job to do | Dashboard home |
| 3 | 2026-11-06 | Offers sorted by in-store/aisle relevance | Glanceable, context-aware | Sort by expiry |
| 4 | 2026-11-06 | Swipe to clip plus a visible button | Gesture speed with accessibility | Button only |
| 5 | 2026-11-06 | Cache member code for offline | Signal is unreliable in stores | Online only |
| 6 | 2026-11-06 | Vue 3 + Vite + PWA plugin | Required stack, offline support | |
| 7 | 2026-11-06 | Redeem confirms in a bottom sheet | Reachable one-handed, stays in context | Centered modal |
| 8 | 2026-11-06 | Aisle info is a section list grouped by clipped offers | Simple, glanceable, no map asset needed | Visual store map (superseded in part by #15) |
| 9 | 2026-11-06 | Settings reached from a gear on Pocket, not a fifth tab | Keeps the four-tab bar from the brief | Fifth tab |
| 10 | 2026-11-06 | Single accent `#c23a22` instead of a brighter tomato | Passes AA contrast as text on cream | Brighter tomato (fails AA for small text) |
| 11 | 2026-11-06 | Demo error/empty states via `?mock=` URL param | Lets reviewers see every state without code changes | Hidden dev panel |
| 12 | 2026-11-06 | Deploy stays public, no password | Exercise project, invented data only (owner's call) | Vercel password protection |
| 13 | 2026-11-06 | Dark mode through the same tokens, system by default with a manual override | Dim stores and night use; no component changes needed | Separate dark stylesheet |
| 14 | 2026-11-06 | Checkout mode is its own full-screen route, always white-on-black, with a wake lock | The register moment is the app's reason to exist; scanners read high contrast best | Reuse the Pocket card |
| 15 | 2026-11-06 | Add an SVG floor-plan map and keep the text section list beside it | The map shows where, the list is the accessible equivalent. Builds on #8 | Map only |
| 16 | 2026-11-06 | Ranking, filtering, history, rewards and list grouping are pure functions in `src/utils/` | Unit-testable without Vue or storage | Logic inside stores or components |
| 17 | 2026-11-06 | One shared `Sheet` for every overlay, handling keys at document level and reclaiming lost focus | Found by e2e: a self-disabling Confirm button dropped focus and Esc stopped working | Per-view dialogs |
| 18 | 2026-11-06 | Inbox items are derived from live offers and member data; only "read" ids are stored | No stale notifications, nothing to sync | Stored notification records |
| 19 | 2026-11-06 | Intro shown once, guard fails open if storage is unavailable | Never block a member from the code | Always-on splash |
| 20 | 2026-11-06 | Test with Vitest plus playwright-core on the system Chrome and axe-core | No browser download, real rendering, real accessibility checks | jsdom-only component tests |
| 21 | 2026-11-06 | Product lists belong to each offer, not to the aisle | Search for "yogurt" found the oat milk offer; found by unit/e2e tests | Aisle-level product lists |
