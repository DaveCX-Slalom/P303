# BRIEF.md: P303 Mobile Experience
## "Loyalty Pocket" (working title)

## 1. Industry, user, task
- **Industry:** Retail & Consumer Goods (grocery / specialty retail, fictional brand "Fieldmarket")
- **Primary user:** Priya, a loyalty member standing in a store aisle, one hand on a cart, phone in the other, wanting to use points and offers before checkout.
- **Single job to do well:** *"In the store, show me my member code, my best offers right now, and what my points can get me, in under 10 seconds."*
- **Context constraints:** one-handed use, glanceable, bright store lighting, spotty in-store signal, interrupted often.

## 2. Core flows (must work end to end)
1. **Open to checkout-ready:** the home screen shows the member code (large, scannable), points balance, and tier progress.
2. **Offers:** a list sorted by "in this store / this aisle", with Clip/Unclip toggle and expiry countdown.
3. **Store locator:** pick a store (or use the nearest), with hours, and an aisle map or section list for clipped offers.
4. **Points history:** earned/spent timeline with a redeem action (simulated).
5. **Settings-lite:** the preferred store and notification toggle.

## 3. Data (invented)
- 1 member, ~40 transactions, ~15 offers, 5 stores, 3 tiers.
- Local JSON plus a mock API layer (`/src/api/mock.js`) with artificial latency so loading, empty, and error states are real.
- No real brand, client, or Slalom data.

## 4. Information architecture
Bottom tab bar (thumb zone): **Pocket** (code and points) · **Offers** · **Stores** · **History**.
Primary actions sit in the bottom 40% of the screen. No hamburger menus.

## 5. Design direction
- **Tone:** fresh, friendly, fast. Retail energy without clutter.
- **Palette:** warm cream background, deep green primary, one bright accent (tomato) for deals and expiry urgency.
- **Type:** a rounded, highly legible sans. The member code and points use large numerals.
- **Touch:** minimum 48px targets, a sticky bottom action, swipe on an offer card to clip, and a visible button as the non-gesture alternative.
- **Brightness mode:** the member code screen auto-switches to high-contrast white with a boosted QR region.
- **Accessibility:** AA contrast, labeled controls, respects reduced motion, text scales to 200%.

## 6. Edge cases and Go-further
- **Empty:** no offers in this store, no history yet, no clipped offers.
- **Offline/poor signal:** the member code stays available from cache, clipped offers queue and sync, and a visible "offline" banner shows.
- **Error:** the API fails with a retry button and no dead ends.
- **Expired:** offers expiring in under 24h are flagged, and expired ones are moved out of the main list.
- **Responsive:** designed at 375px first, tested at 320px and 768px, and a tablet layout centers the phone-width column.
- **PWA touches:** manifest, add-to-home-screen, service worker caching of the code screen.

## 7. Stack and deploy
- Vue 3 + Vite, Vue Router (tab routes), Pinia (member, offers, connectivity), VueUse (`useOnline`, `useStorage`), `qrcode` library for the code.
- vite-plugin-pwa for offline cache.
- Deploy to Netlify or Vercel with password protection.

## 8. Repo structure
```
/
├─ README.md
├─ LICENSE
├─ BRIEF.md
├─ CLAUDE.md
├─ .claude/
├─ docs/
│  ├─ memory-bank/        projectbrief, activeContext, progress, decisions
│  ├─ user-flows.md
│  └─ design-tokens.md
└─ src/
   ├─ api/ (mock)
   ├─ stores/
   ├─ views/ (Pocket, Offers, Stores, History)
   ├─ components/
   └─ assets/
```

## 9. Commit plan
1. `Add BRIEF.md, README, LICENSE, and AI scaffolding`
2. `Scaffold Vue app, router, and tab-bar layout`
3. `Define design tokens and base mobile components`
4. `Add mock API with latency and invented member data`
5. `Build Pocket view with scannable member code`
6. `Build Offers list with clip/unclip and expiry states`
7. `Build Stores view with locator and aisle sections`
8. `Build History view with redeem flow`
9. `Add offline mode, queued clips, and connectivity banner`
10. `Handle empty and error states across views`
11. `Accessibility, touch-target, and small-screen pass`
12. `Add PWA manifest and service worker`
13. `Sync BRIEF.md and memory bank with final build`

## 10. Review checklist (maps to rubric)
- [ ] Deployed, password-protected, works on a real phone
- [ ] Code, offers, stores, history flows complete
- [ ] Empty, error, and offline states handled
- [ ] README and LICENSE in root, scaffolding organised
- [ ] Descriptive commits across multiple sessions
- [ ] Design reads as retail loyalty, one-handed, glanceable
- [ ] BRIEF.md matches the shipped build
