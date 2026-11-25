# ReLoop methodology — public-baselines-v2 / LOCAL_ONLY

## What changed (narrow scope, not universal factors)

New plans default to **No verified environmental baseline**. Two explicitly selectable, source-backed carbon references are supported: **container glass** and **identified PET resin**. The app never infers a source baseline from a photo or silently applies it to a generic product. Material/category/name matching and a separate boundary/mass confirmation are required. The original category-assumption mode remains available only by explicit opt-in or when reopening an older saved plan.

These are **gross material-production what-ifs**, not measured diversion, net savings, marginal supplier emissions, offsets, or a certified product LCA. Price/cost, item mass, quantity, functional equivalence and displacement remain user inputs/default assumptions.

## Published numerical references, units and dates

Official US EPA WARM **version 16, December 2023**, Background Chapters, **Exhibit 6-1** on printed pages **6-1–6-2 / PDF pages 60–61** defines production emissions as the inverse of WARM source-reduction factors. The following positive **production** values appear on PDF page 61:

| Explicit material path | Current input mix | 100% virgin inputs | Published unit | Counted boundary |
|---|---:|---:|---|---|
| Container glass | **0.53** | **0.60** | MTCO₂e / US short ton of material | WARM raw-material acquisition and manufacturing of containers/packaging glass, including its modelled process and transportation terms |
| Identified PET resin | **2.17** | **2.21** | MTCO₂e / US short ton of material | WARM PET resin raw-material acquisition/manufacturing, including its modelled transportation; **not extrusion/conversion into a bottle** |

The table columns are **two input-composition scenarios**, NOT low/high statistical confidence limits, universal minimum/maximum, or an uncertainty distribution. They may not bracket the footprint of a particular supplier. WARM uses historical inventories (glass cites RTI 2004; plastics cite FAL 2011/2018 and US recycled-content assumptions). December 2023 is publication/version timing, not proof of a current 2026 product footprint. The app displays at most two significant digits for scenario results; exact original factor strings remain visible.

Corroboration: WARM Containers, Packaging and Non-Durable Goods Chapters, Glass **Exhibits 1-9/1-10**, printed 1-6 / PDF page 9; Plastics **Exhibits 5-6/5-7**, printed 5-6 / PDF page 75. The negative source-reduction rows are *not* a separately added recycling credit. Use the published PET total **2.21**, rather than summing individually rounded component cells.

### Defensible mappings only

- Glass: explicitly identified **container-glass bottle/jar**. No windows, mirrors, ceramics, drinking/specialist glass, or composite goods. Count only glass mass; lids and other materials are excluded. A functionally equivalent container-glass replacement is a user assumption.
- PET: explicitly confirmed **PET (#1) bottle/container resin**. No generic rigid plastic, PETG, multilayer/mixed packaging or polyester garments. Count PET mass only; cap/label and other resins are excluded. WARM's resin-only footnote **41, PDF page 76** explicitly excludes extrusion into end products. Do **not** call this a complete bottle footprint.
- Identified but unmatched products: environmental outputs remain unknown by default. No universal source factor is invented for textiles, furniture, electronics, paper or generic plastic.

## Unit conversion and calculation

NIST SP 811, Appendix B.8 gives **US short ton (2,000 lb) → kg = 9.071 847 E+02**, and metric ton/tonne → kg = **1.0 E+03**. ReLoop uses the published table precision **907.1847 kg per US short ton**, not an extra unsourced decimal. This is a unit conversion, not environmental validation.

    displaced_material_kg = quantity × material_kg_per_item × displacement_percent / 100
    gross_source_carbon_scenarios = displaced_material_kg × published_MTCO2e_per_short_ton × 1000 / 907.1847
    assumed_spending_difference = quantity × (replacement_price × displacement_percent / 100 − per_item_route_cost)

Mass, equivalent replacement, new price, costs, quantity and displacement are editable assumptions. At 0% displacement, gross carbon is zero but route costs still apply. A handover may replace a recipient's purchase; it is not cash income for the donor. Negative spending means additional cost. Currency relabelling performs no exchange-rate conversion.

Recycling receives **no CO₂/water credit** because local processing/counterfactual data are missing; only entered costs are counted. Hazardous/possibly unsafe and unidentified items receive no environmental or spending result. A published source cannot override a safety hold.

## Water: source paths are deliberately not modelled

**EPA WARM does not supply a water factor for these selected references.** Consequently the source-backed glass/PET paths show **Not modelled**, not zero and not an assumed “water saved” value. Green, blue, grey, scarcity-weighted water footprint and actual local tap-water savings are all uncalculated. No cradle-to-grave water total is relabelled as marginal production avoided.

The optional illustrative category mode retains its old uncalibrated author-set litres. They are explicitly **not sourced, not a validated footprint, not green/blue/grey components and not local water saved**. It is never mixed with an EPA carbon baseline to imply water evidence.

## Missing terms: no measured, marginal or net-saving claim

WARM production references include some production transportation. Added repair parts/energy, cleaning, reuse/collection trips, functional/product differences, actual use, disposal and market/rebound response are not assessed here. Source resin modelling excludes bottle forming/cap/label. Actual savings may be lower, absent or unfavourable. No claim is made that an individual action actually changes marginal production. Do not combine a gross source what-if with a separate recycling credit.

Saved plans and checkmarks are self-reported notes, not completed actions or verification. No combined carbon scoreboard is shown.

## Optional illustrative defaults (not EPA data)

Only opt-in illustrative mode uses this table. Mass/price/cost defaults are also assumptions in source mode until the user replaces them. Currency defaults to USD; values are not market quotes.

| Category | kg/item | assumed kg CO₂e/kg | assumed L/kg | assumed new price / cost per item |
|---|---:|---:|---:|---:|
| Textiles | 0.25 | 5–20 | 1,000–5,000 | 25 / 3 |
| Electronics | 0.2 | 30–150 | 100–2,000 | 180 / 20 |
| Furniture | 8 | 1–8 | 10–300 | 100 / 10 |
| Glass | 0.35 | 0.5–2 | 1–20 | 4 / 0 |
| Rigid plastic | 0.12 | 1–5 | 5–100 | 6 / 0 |
| Paper/books | 0.3 | 0.5–3 | 10–100 | 10 / 0 |
| Other/not sure | 1 | None | None | 0 / 0 |

Default quantity **1**, displacement **50%**. None of this illustrative table is an empirical category mean or a confidence interval.

## Versioned history and reproducible evidence

Older **illustrative-v1** records remain readable in the same `reloop.shelf.v1` storage envelope. Opening an old record preserves its arithmetic, identity, notes and timestamps and does not rewrite it or silently attach a source baseline. An explicit edit/save creates a **public-baselines-v2** record with selected baseline/confirmation, retaining identity/created timestamp. Mixed shelves are tested; unsupported/corrupt/forged source data is not silently accepted. Photos are never stored/exported.

`evidence/source-baselines/verified-baselines.json` retains three successful live source/unit records, original files/SHA-256, 14 exact normalised page quotations, units/boundaries and limitations. `node scripts/verify-source-evidence.mjs` rechecks retained bytes and quotes without network. Two PDF table pages were rendered and visually checked. See SOURCE_CITATIONS.md.

LOCAL_ONLY. No real-world pilot, public URL, completed environmental outcome or competition permission is claimed.
