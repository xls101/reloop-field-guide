# ReLoop — English project story / DRAFT / LOCAL_ONLY

**This is a draft, not an entry.** No public repository, live site, uploaded video or submission exists. Entry fee, new-work/reuse and AI rules, student/region eligibility and final cash/credit prizes must be clarified by a human before publication/submission. AI-assisted development is disclosed below; an event AI tag is not permission.

## Inspiration

An object can stop being useful to its owner long before it stops being useful. The difficult part is not another recycling slogan: it is knowing the next safe, practical step for the item in your hand.

ReLoop turns that moment into a small field guide. It prioritises safe repair, useful repurposing and a handover that someone actually wants. Recycling is a locally confirmed last route—not a guessed bin or an automatic carbon credit.

## What it does

Name an item, optionally preview a photo, and **confirm its material yourself**. The app offers only clearly labelled plain-text keyword hints, not AI image recognition. Photos are decoded on the device, never uploaded, saved with history or exported.

Choose a route and receive three actionable steps with material-specific safety guidance. Batteries, chemicals, contamination and possibly unsafe items switch to a conservative specialist route. Optional region/locality inputs show jurisdiction-aware caveats: local rules and acceptance must still be checked, and no live facilities are fabricated.

The scenario strip explores a hypothetical displaced new purchase through CO2e, production-water and spending outputs. **New plans default to no verified environmental factor. Two confirmed paths use published US EPA WARM v16 container-glass/PET-resin production references (December 2023), with original units, material boundaries and retained source evidence. Current-mix/virgin alternatives are not confidence limits or individual marginal/net savings. Source water is Not modelled. Mass, price/cost and displacement remain user assumptions; optional illustrative category factors are explicitly unsourced.** Quantity, mass, prices, costs and displacement are editable; sources and omitted boundaries are visible. Recycling is not given an unsupported emissions credit. Negative spending means additional cost, not a reward.

Save plans on this browser, reopen/edit them without duplicates, mark steps as your own notes, and download a private, self-contained HTML report or SVG poster. Reports include exact inputs, assumptions, sources and caveats. Reset/removal require confirmation. No account, API key, backend or production dependency is required.

## The specific waste problem and measurement approach

The prototype focuses on everyday textiles, electronics, furniture, intact containers and books that may still have a safe use. A saved plan is **not evidence of a completed repair, accepted handover or avoided purchase**. Checkmarks are self-reported; no measured kilograms diverted or real CO2/water savings have been established. We intentionally do not combine scenarios into an impact scoreboard.

A future consented pilot would measure actual accepted actions, item mass, useful-life extension and whether a new purchase was truly replaced. A defensible environmental assessment would then need material/product-specific inventory data plus repair, transport, use, treatment and water-location burdens. The published glass/PET factor bytes, units, quotes and scope are verified; product-specific calibration and a real-life outcome pilot have not been conducted.

## How we built it

Native HTML/CSS and browser ES modules create a restrained cream-and-forest editorial interface, with system serif/sans fonts, labelled controls, keyboard access and responsive layouts. Pure model functions validate input and calculate bounded scenario ranges. localStorage persists validated versioned snapshots; corrupt data is preserved rather than silently replaced, and storage failure is clearly labelled tab-only.

Blob previews and downloads stay local. A scope-isolated service worker caches only the app shell after the first localhost/HTTPS visit. Node’s built-in test runner tests the pure logic, safety, escaping, storage and server boundaries. A real headless Chromium-based Edge browser verifies controls, downloads, reload/offline behaviour and mobile layouts; TEST_RESULTS.md contains actual logs and the retained first screenshot failure.

## Challenges

The easiest wrong solution was to make a filename look like computer vision, show precise-looking sustainability numbers, or assume that every municipality accepts the same material. We chose explicit human confirmation, visibly unvalidated what-if factors and local-acceptance checks instead. That honest limitation is part of the product, not hidden fine print.

A browser capture path for top-level SVG timed out during testing. We kept the failed run and revised the verification to decode the actual exported SVG as an image in a normal HTML document, retaining XML and active-content checks. The evidence report records what really completed.

## Accomplishments

A complete no-key local workflow, useful three-step guidance, real offline reload after caching, editable scenarios, safe private exports and tested persistence/failure paths. The design is deliberately simple enough to use at 375px and the product’s assumptions are inspectable rather than disguised as authority. No live deployment, real-world diversion or award success is claimed.

## What is next

Human review of the event rules and personal eligibility; actual public repository/video only if approved; validated product-specific factors; and a consented measured pilot. A free manual-only Pages workflow is included as configuration, not a deployed URL.

## Built with / credits / disclosure

HTML, CSS, JavaScript, Node built-in tests, optional test-only Playwright, localStorage, Blob APIs and Service Worker. Original vector branding and drawings. Numerical references: US EPA WARM v16 production tables for the two confirmed materials, plus NIST unit conversion. Other guidance: US EPA, GHG Protocol, Water Footprint Network and GOV.UK. They do not validate optional illustrative factors, user inputs or real-world savings. Source/branding licence: MIT; external publications retain their terms.

Codex assisted coding, design, test authoring and draft writing. No paid model API or image-recognition model is used at runtime. Detailed competition AI/new-work rules remain unresolved, so this disclosure must be reviewed rather than silently submitted.

**Links:** repository not public; live demo not deployed; demo video not recorded/uploaded. A human must provide actual observed links only after the gates pass.
