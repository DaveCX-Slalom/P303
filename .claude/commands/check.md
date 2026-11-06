---
description: Run unit tests, build, browser audit, and end-to-end flows, then summarise
---
Run `npm run check` (unit tests, production build, real-Chrome audit with axe, end-to-end flows).

Report what passed and what failed. For each failure, say which screen or flow it is, find the cause in the code, and fix it. Do not weaken a test or the audit to make it pass. Re-run until it is clean.
