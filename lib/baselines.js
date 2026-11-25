// Source-backed material references, not universal factors or measured savings.
// Original units and snapshot fingerprints are retained for reproducible verification.
export const SHORT_TON_KG = 907.1847; // NIST SP 811 Appendix B.8: short ton (2,000 lb) → kg, published 9.071 847 E+02 (rounded table precision).
export const WARM_BACKGROUND_SHA256 = '4771c13639ded5e979eeb037e9895493750096e76b84631796fbb6d445cbf473';
export const WARM_CONTAINERS_SHA256 = 'ec8c9a500a60ab68f3d90552faba835dca606cd34bc5c819dcd0f9885b185e87';
export const BASELINES = Object.freeze({
  none: Object.freeze({ label: 'No verified environmental baseline (default)', kind: 'unknown', carbon: null, water: null }),
  illustrative: Object.freeze({ label: 'Illustrative category assumptions — not sourced', kind: 'illustrative' }),
  warm_glass_v16: Object.freeze({
    label: 'US EPA WARM v16 · container glass', kind: 'source', category: 'glass',
    rawCarbon: Object.freeze([0.53, 0.60]), rawCarbonText: Object.freeze(['0.53', '0.60']), rawUnit: 'MTCO2e / US short ton of material',
    endpointLabels: Object.freeze(['WARM current mix of inputs', '100% virgin inputs']),
    published: 'December 2023', sourceId: 'EPA_WARM_BACKGROUND', scopeSourceId: 'EPA_WARM_CONTAINERS',
    sourcePage: 'Exhibit 6-1 continuation, printed 6-2 / PDF page 61',
    corroboration: 'Glass Exhibits 1-9 and 1-10, printed 1-6 / PDF page 9',
    confirmation: 'I identified a container-glass bottle or jar, not a window, ceramic, drinking glass or specialist glass. Mass excludes lids/other materials; the hypothetical replacement is functionally equivalent container glass.',
    boundary: 'US-average WARM raw-material acquisition and manufacturing reference for container glass. Includes modelled production/process and transportation emissions; excludes use and end-of-life. Underlying inventory includes RTI (2004), not a 2026 supplier-specific footprint.',
    exclusions: 'No repair, cleaning, additional reuse/collection travel, replacement-product differences, use, disposal or market response is assessed. Not a marginal supplier footprint or net saving.',
    waterNote: 'WARM provides no water factor here. Green, blue, grey, scarcity-weighted and local tap-water savings are not calculated.'
  }),
  warm_pet_v16: Object.freeze({
    label: 'US EPA WARM v16 · identified PET resin only', kind: 'source', category: 'plastic',
    rawCarbon: Object.freeze([2.17, 2.21]), rawCarbonText: Object.freeze(['2.17', '2.21']), rawUnit: 'MTCO2e / US short ton of material',
    endpointLabels: Object.freeze(['WARM current mix of inputs', '100% virgin inputs']),
    published: 'December 2023', sourceId: 'EPA_WARM_BACKGROUND', scopeSourceId: 'EPA_WARM_CONTAINERS',
    sourcePage: 'Exhibit 6-1 continuation, printed 6-2 / PDF page 61',
    corroboration: 'Plastics Exhibits 5-6 and 5-7, printed 5-6 / PDF page 75; resin-only footnote 41, PDF page 76',
    confirmation: 'I checked that this bottle/container is PET (#1), not PETG, mixed resin or multilayer packaging. Mass is PET only, excluding cap/label; an equivalent PET-resin mass is hypothetically displaced, not the whole bottle footprint.',
    boundary: 'US-average WARM PET-resin raw-material acquisition/manufacturing reference. Modelled transportation is included; extrusion/conversion of resin into a bottle is NOT included. Underlying inventories include FAL (2011/2018), not a 2026 product-specific footprint.',
    exclusions: 'No bottle forming, cap/label, repair, cleaning, additional reuse/collection travel, use, disposal or market response is assessed. Not a complete bottle LCA, marginal footprint or net saving.',
    waterNote: 'WARM provides no water factor here. Green, blue, grey, scarcity-weighted and local tap-water savings are not calculated.'
  })
});
