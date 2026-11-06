---
description: Add a new view that meets the project's definition of done
argument-hint: <ViewName> <what it is for>
---
Add the view described in: $ARGUMENTS

Follow CLAUDE.md conventions:
- File in `src/views/`, route in `src/router.js` with `meta.title` and `meta.tab` (or `fullscreen`).
- Design for 375px first, test at 320px and 768px. Colors only from `src/assets/tokens.css`.
- Touch targets at least 48px, primary actions in the bottom 40% (use `.sticky-action`), a visible button for any gesture.
- Use `StateView` for loading, empty, and error. Offline works through the stores' cached data.
- Overlays use `components/Sheet.vue`.
- Put any ranking, filtering, or grouping logic in `src/utils/` with a unit test.
- Add an end-to-end step in `scripts/e2e.mjs` and the route in `scripts/audit.mjs`.

Finish with `/check`.
