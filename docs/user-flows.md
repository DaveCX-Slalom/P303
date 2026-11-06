# User flows

User: Priya, in a store aisle, one hand on a cart. Job: member code, best offers, and points in under 10 seconds.

1. **Open to checkout-ready.** App opens on Pocket: large QR, member number, points, tier progress. Works offline from cache. Brightness mode (default on) gives a white, high-contrast code.
2. **Offers.** Sorted: store-specific first, then chain-wide, soonest expiry first. Clip/unclip by swiping left or tapping the button. Under 24h is flagged "Ends soon". Expired offers are hidden behind a toggle. Bottom filter: All / Clipped. Clips made offline queue and sync on reconnect.
3. **Stores.** Stores sorted by distance, hours shown, "Use nearest store" in the bottom action. Clipped offers are grouped by store section.
4. **History.** Points timeline grouped by month. "Redeem points" opens a bottom sheet; confirm is disabled offline.
5. **Settings-lite.** Preferred store and notification toggle, reached from the gear on Pocket.

States per view: loading (skeleton), empty, error with retry, offline (banner plus cached data).
