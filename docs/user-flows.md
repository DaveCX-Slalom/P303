# User flows

User: Priya, in a store aisle, one hand on a cart. Job: member code, best offers, and points in under 10 seconds.

1. **First run.** A three-step intro (code, offers, points). Skip any time. Shown once; never blocks the code afterwards. Settings → Replay intro.
2. **Open to checkout-ready.** Pocket: best offer right now (one-tap clip), large QR, member number, animated points, tier progress. Works offline from cache. Brightness mode (default on) makes the code white and high contrast.
3. **At the register.** "Checkout mode" is a full-screen, always-bright code with the clipped offers listed. It keeps the screen awake; Done returns.
4. **Offers.** Search, section chips, Ending soon, sort (Best match, Ending soonest, A to Z). Best match puts this store's offers first, then chain-wide, soonest expiry first. Clip by swiping left or tapping the button. Tap an offer for products, stores and terms, and to add it to the shopping list. Under 24h is flagged "Ends soon"; expired offers sit behind a toggle. Bottom filter: All / Clipped. Clips made offline queue and sync on reconnect.
5. **Shopping list.** Add from clipped offers or type an item (it is filed under the right section when it matches an offer's products). Grouped in the store's walking order. Check off, clear checked.
6. **Stores.** Floor-plan map of the selected store with sections that hold clipped offers highlighted and counted, plus the same information as text. Stores sorted by distance with hours. "Use nearest store" in the bottom action.
7. **History.** Six-month earned vs. redeemed chart, All / Earned / Redeemed filter, month-grouped timeline, tap a row for details.
8. **Redeem.** "Redeem points" opens a bottom sheet with every reward; unaffordable or tier-locked rewards say why. Confirm is disabled offline. Success shows confetti (not with reduced motion).
9. **Rewards.** Tier perks for Sprout, Harvest and Orchard (yours is marked) and a rewards catalog with category filter.
10. **Inbox.** Expiring-offer and tier reminders with an unread badge on Pocket. Optional browser device alerts.
11. **Settings.** Preferred store, notification toggle, appearance (System / Light / Dark), install prompt, replay intro.

States on every screen: loading (skeleton), empty (illustration plus a next step), error with retry, and offline (banner plus cached data).
