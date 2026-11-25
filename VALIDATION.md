# Verified local checks

75 Node built-in tests, 29 real isolated Edge browser cases and the public whitelist build passed on 2026-11-25. Browser cases covered320/375px mobile, desktop, inputs, local photos without classification, public EPA glass/PET unit/boundary confirmation, slider, reports, legacy storage, reset and offline behavior.

Tests: `npm test`. Build: `npm run build`. Unit source has zero production dependencies. Original detailed captures/logs remain in the local review package. No remote CI/deployment test is claimed before it actually runs.

Public factors: EPA WARM v16 (Dec2023), with material-specific boundaries, no net/marginal savings or water credit. Prices, mass and displacement remain assumptions.

The public release uses `.js` module names for scripts/tests with package `type: module`; imports and commands were changed consistently. Same75 tests are re-run in the exact release directory. This is a filename-only portable distribution adjustment, not a reduced suite.
