# ReLoop — LOCAL_ONLY

**Good things deserve another round.** A complete, local-first field guide for safe repair, practical reuse, useful handovers and locally confirmed recycling. Cream paper, forest ink, editorial serif and small orange accents. No account, backend, production dependency or API key.

> Not submission-ready or publicly deployed. Arbiter’s 2026 calendar is verified, but entry fee, new-work/reuse and AI rules, individual eligibility and final cash/credit prizes remain unresolved. No live demo URL, award value or measured impact is claimed.

## Run locally — no npm install

Node.js 22 or newer:

    npm start

Open the loopback URL printed by the server (default http://127.0.0.1:4178/). Choose another port with PORT=4180 npm start. The server binds 127.0.0.1 only and exposes just the app shell, not .git, docs, tests, profiles or evidence. Stop your own preview with Ctrl+C.

Use localhost, not a file:// double-click: browser modules and service-worker caching need localhost or HTTPS. After **Offline-ready** appears, you can disconnect and reload. Storage is scoped to this browser, origin and port.

## Complete local workflow

1. Type an item name; a labelled plain-text keyword hint may appear. You must choose and confirm its material category.
2. Optionally choose a JPEG/PNG/WebP (8 MB / 30 megapixels max). The browser decodes a local preview, **not image recognition**. A filename never selects category. SVG/other formats and bad image bytes are rejected. Photos are not uploaded, saved or exported.
3. Choose condition, route and optional region/locality. Get three actionable steps, safety guidance and explicit local acceptance caveats. Hazardous/uncertain items get a safety-first route.
4. Edit quantity, mass, prices, costs, currency and notes. Operate the displacement slider by pointer or keyboard. Choose a confirmed public glass/PET production reference or explicitly opt into illustrative factors. Outputs are gross what-ifs, never measured/net/marginal savings.
5. Mark steps as your own notes and save up to 50 plans. Open/edit without duplicates. Remove/reset require confirmation; other site storage is not cleared. Blocked/full storage gets a tab-only warning; unreadable history is not overwritten.
6. Download a script-free, self-contained HTML report or standalone SVG poster locally. User text is escaped. Reports can contain private names/locality/notes: review before sharing.

No geolocation, analytics, live facility search, AI workflow or automated submission exists or is advertised. Saving/checking a plan does not measure waste diversion; there is no summed carbon scoreboard.

## Honest source-backed estimates

New plans default to **no verified environmental baseline**. Explicitly identified **container glass** and **PET (#1) resin** have selectable **US EPA WARM v16 (December 2023)** paths requiring separate material/mass/boundary confirmation. Background **Exhibit 6-1, PDF p61** gives **0.53 / 0.60** and **2.17 / 2.21 MTCO₂e per US short ton**, respectively; the columns are **current mix / 100% virgin**, not confidence limits. NIST's published unit conversion is ×1000/907.1847 to kg CO₂e/kg. Source bytes, hashes, 14 exact normalised page quotes and visual table checks are retained.

This is a **gross material-production reference × assumed displaced material mass**, not an individual marginal/net saving, complete product LCA or measured diversion. PET excludes bottle extrusion, caps and labels; glass excludes non-container/specialist glass. WARM includes modelled production transportation and historical US inventories. Added repair/cleaning/reuse trips, use, disposal and market response are not assessed. **Source paths have no water factor** and display Not modelled—not zero or litres saved; no green/blue/grey, scarcity or local water saving.

Mass, quantity, price/cost, functional equivalence and displacement remain editable user/default assumptions. Spending = quantity × (new price × displacement / 100 − route cost); negative is extra cost, handover is not donor income, and currency change is not conversion. Recycling gets no environmental credit; unsafe/unidentified items have no metric. Optional **illustrative** mode retains explicitly unsourced category factors, never mixed with EPA water claims. Old illustrative-v1 history opens unchanged; explicit edits save public-baselines-v2 without duplicate/created-date loss. See METHODOLOGY.md and SOURCE_CITATIONS.md.

## Actual verification

Final source-backed run: **75/75 unit tests, 29/29 real Edge checks, zero observed console/page errors or remote app requests; local build exit 0.** Source verification: 3 retained successful source/unit records and 14 exact page quotations. See TEST_RESULTS.md. Worker write ownership released; main owns video capture/integration.

    npm test
    npm run build

Unit tests use Node built-ins. Build copies a public-file whitelist to _site/ and does not deploy.

Optional browser testing requires test-only Playwright and a Chromium-based executable. Nothing is automatically installed; no existing user profile/tabs are used:

    RELOOP_PLAYWRIGHT_PATH=/absolute/path/to/playwright \
    RELOOP_BROWSER_EXECUTABLE=/absolute/path/to/browser \
    node scripts/browser-verify.mjs

With local Playwright/Chromium, npm run test:browser works. The script uses CommonJS require, starts/stops its own loopback server under /reloop/, uses an isolated profile under ignored .local/, runs actual form/upload/slider/download/history/reset/offline/storage checks, and captures desktop/tablet/375px/320px screenshots. Durable logs live in evidence/. TEST_RESULTS.md records only what actually executed, including the retained earlier screenshot failure. Safari/Firefox, real collection facilities, supplier-specific factor calibration, real marginal/physical savings and external publication are not tested. Source bytes/quotes/units are verified, not a real-life outcome.

## Package

- index.html, styles.css, app.js: full interface and workflow.
- lib/: source/assumption/guide data, pure model, safe reports, validated shelf storage.
- lib/baselines.js: the two narrow verified public carbon pathways; no universal source factors.
- sw.js, manifest.webmanifest, assets/mark.svg: local shell caching and original vector branding.
- tests/, scripts/: built-in tests, loopback server, public whitelist build and optional real browser verification.
- HUMAN_GATED_DEPLOY.md + .github/workflows/pages.yml: free Pages configuration, manual dispatch only, approval default false.
- DEVPOST_SUBMISSION_DRAFT.md + DEMO_SCRIPT.md: English story and two-minute recording draft; no actual public video.

Independent local main-branch Git repository, no remote. Source/branding are MIT; cited works retain publisher terms. Never commit .local/ profiles, private photos or personal reports. _site/ excludes evidence, profiles, test files and submission drafts. Publication/submission remain human-only.

## Public source scope
Original app/source/tests and the minimal public EPA/NIST evidence needed to reproduce numeric-reference tests are included. Personal files, auth/runtime/browser caches, raw model logs, unrelated projects and Reddit are not uploaded. Government source documents retain their original bytes and citations; they are not original app assets or a certification.
