# Source citations — PUBLIC numeric references / LOCAL_ONLY

Live public read-only HTTPS checks: **2026-11-25 UTC**. No account, cookies, credentials, paid API, native CUA or organizer contact. Running ReLoop does not fetch remote sources. The links below are used only when deliberately followed.

## Actual numerical sources (two narrow paths)

1. [US EPA — WARM v16 Background Chapters, December 2023](https://www.epa.gov/system/files/documents/2023-12/warm-background_v16_dec.pdf). HTTP **200**, retrieved **2026-11-25T04:52:41.525Z**, retained 970,639 bytes. **Exhibit 6-1, PDF pp.60–61 / printed 6-1–6-2**: production factors in **MTCO₂e per US short ton of material**. Page 61 rows: **Glass 0.53 / 0.60**, **PET 2.17 / 2.21**; columns are current mix / 100% virgin. Page 60 explains production as inverse source reduction and states use-phase emissions are not included.

   SHA-256: `4771c13639ded5e979eeb037e9895493750096e76b84631796fbb6d445cbf473`.

2. [US EPA — WARM v16 Containers, Packaging & Non-Durable Goods Chapters, December 2023](https://www.epa.gov/system/files/documents/2023-12/warm_containers_packaging_and_non-durable_goods_materials_v16_dec.pdf). HTTP **200**, retrieved **2026-11-25T04:52:24.089Z**, retained 4,021,332 bytes. Glass scope **PDF pp.4–5** is containers/packaging, not windows, mirrors or durable goods. Glass **Ex.1-9/1-10, p.9** corroborates factors and virgin manufacturing total. Plastics **Ex.5-6/5-7, p.75** corroborates PET 2.17/2.21; **footnote 41, p.76** explicitly excludes resin extrusion into bottles. Current-mix PET recycled content assumption on **p.74** is 3%. WARM's underlying inventory is older than its publication date.

   SHA-256: `ec8c9a500a60ab68f3d90552faba835dca606cd34bc5c819dcd0f9885b185e87`.

3. [NIST SP 811 — Appendix B.8, units listed alphabetically](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8). HTTP **200**, retrieved **2026-11-25T05:03:24.767Z**, retained 168,804 bytes. Exact normalised table text: **“ton, short (2000 lb) kilogram (kg) 9.071 847 E+02”**; metric ton/tonne maps to 1.0 E+03 kg. ReLoop preserves published table precision **907.1847 kg/US short ton**, yielding factor conversion ×1000/907.1847. NIST supplies only a unit conversion, not an environmental factor.

   SHA-256: `cda77e35259b6601f6149ddd23d805ba2390ff22658b5d590317d452e56cb3ee`.

These are **US WARM material-production references**, not marginal/net savings, current supplier-specific footprints or confidence intervals. PET is **resin only**, not a whole bottle LCA. **No water factor** is sourced for these paths; green/blue/grey, scarcity and local water saved are not calculated. Mass, equivalent purchase, prices/costs and displacement are user assumptions. Generic/unmatched items default to unknown; optional illustrative category factors are not sourced.

Evidence: `evidence/source-baselines/retrievals.json` (including failed attempts), `verified-baselines.json` (three byte-hashed source records and 14 exact normalised PDF quotations), original PDFs/HTML, extracted page text, and two visually checked table PNGs. `node scripts/verify-source-evidence.mjs` verifies retained files/quotes without more network.

## Qualitative guidance (not numerical factors)

- [US EPA — What You Can Do](https://www.epa.gov/recycle/what-you-can-do): reduction/reuse/donation context.
- [US EPA — Common recyclables](https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables): preparation and local-program variation.
- [US EPA — Electronics donation/recycling](https://www.epa.gov/recycle/electronics-donation-and-recycling): data erasure, extending use and e-waste precautions.
- [US EPA — Used household batteries](https://www.epa.gov/recycle/used-household-batteries): chemistry/condition, fire risk and separate collection.
- [GHG Protocol — Product Standard](https://ghgprotocol.org/product-standard): full life-cycle boundaries. ReLoop is not a conforming LCA.
- [Water Footprint Network — What is a water footprint?](https://www.waterfootprint.org/water-footprint-2/what-is-a-water-footprint/): distinct green/blue/grey components and location; not a source for our optional illustrative litres.
- [GOV.UK — Recycling collections](https://www.gov.uk/recycling-collections): official council lookup **England and Wales only**, not live facility/fee/availability verification.

These successful qualitative checks remain in `evidence/source-checks.json`. No recipient, facility, appointment, acceptance, fee, partnership or endorsement is invented.

## Failed attempts retained honestly

Levi's 2015 LCA URL returned **403**: not used as numerical evidence. Two outdated NIST HTML routes returned **404**; an old PDF URL redirected to an HTML overview. Only the subsequently observed successful Appendix B.8 route is used for conversion. A prior EPA reuse URL also returned 404 and was replaced by a successfully observed official endpoint. Failed responses remain in project evidence; they are not cited as successful references.

## Bounded Arbiter rules refresh — no policy permission inferred

[Arbiter official rules](https://arbiter-hacks-v1.devpost.com/rules): single HTTP **200** read-only refresh at **2026-11-25T04:51:05.559Z**. Retained SHA-256 `61a6818f260a71ae7bccc5a120313376cad9cb86fd848f81751bf0697d634495`, raw HTML, cleaned text and `arbiter-rules-check.json`. Exact retained rules still say one submission/one track, team “[1 to 4]”, solo allowed, and Theme prizes **TBD**. No express entry-fee/no-purchase, new-work/reuse or complete AI policy was located in this sparse text. Absence is **not permission**; no organizer was contacted.

Earlier shared official research remains read-only: calendar deadline **2026-12-20 21:00 PST = 2026-12-21 13:00 Asia/Shanghai**. Fee, AI/new-work policy, personal student/age/team/region eligibility and final cash/credits remain unresolved. No READY status, public URL, deployed site, public repo/video or submitted entry is claimed.
