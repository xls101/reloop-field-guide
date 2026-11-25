import { ACTIONS, CATEGORIES, CONDITIONS, MODEL_VERSION, SOURCES } from './data.js';
import { calculateScenario, escapeHtml, formatMoney, formatNumber, formatRange, getGuide, getLocationAdvice, validateDraft } from './model.js';
import { SHORT_TON_KG, WARM_BACKGROUND_SHA256, WARM_CONTAINERS_SHA256 } from './baselines.js';
const e = escapeHtml;
const boundary = 'Gross material-production what-if, not measured, net or marginal environmental savings. Factor provenance follows the selected baseline; mass, price/cost and displacement remain user assumptions. No source-backed green/blue/grey, scarcity-weighted or local tap-water saving is calculated.';

function checked(input) {
  const result = validateDraft(input);
  if (!result.ok) throw new RangeError('Complete and confirm a valid plan before exporting.');
  return result.value;
}
export function filenameFor(name, extension) {
  if (!['html', 'svg'].includes(extension)) throw new RangeError('Unsupported report type.');
  const base = String(name).normalize('NFKD').replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 42).replace(/^-|-$/g, '').toLowerCase() || 'item';
  return 'reloop-' + base + '.' + extension;
}

export function buildReport(input, { createdAt = new Date().toISOString() } = {}) {
  const draft = checked(input);
  if (!Number.isFinite(Date.parse(createdAt))) throw new RangeError('Invalid export timestamp.');
  const impact = calculateScenario(draft);
  const guide = getGuide(draft);
  const location = getLocationAdvice(draft);
  const category = CATEGORIES[draft.category];
  const reference = impact.baseline;
  const row = (label, value, basis) => '<tr><td>' + e(label) + '</td><td>' + e(value) + '</td><td>' + e(basis) + '</td></tr>';
  let factorRows;
  if (reference.kind === 'source') factorRows = row('Published carbon factor (current / virgin)', reference.rawCarbonText.join(' / ') + ' ' + reference.rawUnit, 'US EPA WARM v16, ' + reference.published + ' · ' + reference.sourcePage) + row('kg CO₂e / kg material, converted', reference.carbon.map(value => Number(value.toPrecision(4))).join(' / '), 'Derived unit conversion, NOT a new published factor or measured result; original × 1000 / ' + SHORT_TON_KG) + row('Water factor', 'Not modelled', 'No water inventory supplied for this pathway; no green/blue/grey or local water saving.');
  else if (reference.carbon) factorRows = row('Illustrative carbon factor', reference.carbon.join('–') + ' kg CO₂e/kg', 'Author assumption, NOT sourced') + row('Illustrative water factor', reference.water.join('–') + ' L/kg', 'Uncalibrated author assumption, not a validated water footprint.');
  else factorRows = row('Environmental factors', 'Not modelled', 'No defensible source/product/material match selected.');
  const steps = guide.steps.map((step, i) => '<li><strong>' + e(step.title) + '</strong><p>' + e(step.body) + '</p><small>' + (draft.completedSteps[i] ? 'You marked this step done; not independently verified.' : 'Planned; not marked done.') + '</small></li>').join('');
  const sources = SOURCES.map(source => '<li><a href="' + e(source.url) + '" rel="noreferrer noopener">' + e(source.title) + '</a><p>' + e(source.scope) + '</p></li>').join('');
  const metrics = [
    [formatRange(impact.carbon), reference.kind === 'source' ? 'kg CO₂e · current-mix / virgin material-production alternatives' : 'kg CO₂e · illustrative production scenario'],
    [formatRange(impact.water), reference.water ? 'L · uncalibrated illustrative water, not a footprint' : 'Water not modelled · no component/local-water data'],
    [formatMoney(impact.money, draft.currency), draft.currency + ' · assumed spending difference, not income']
  ].map(([value, label]) => '<div class="metric"><strong>' + e(value) + '</strong><span>' + e(label) + '</span></div>').join('');
  const provenance = reference.kind === 'source' ? '<p><strong>Published source path.</strong> ' + e(reference.label) + ' · ' + e(reference.sourcePage) + '. ' + e(reference.corroboration) + '.</p><p>Reference endpoints: ' + e(reference.endpointLabels.join(' / ')) + '. ' + e(reference.rangeNote) + '</p><p class="note">Retained source SHA-256: production table ' + e(WARM_BACKGROUND_SHA256) + '; material scope ' + e(WARM_CONTAINERS_SHA256) + '. Exact source files and quoted page evidence are retained in the local project; this report does not fetch them.</p>' : '<p>' + e(reference.status) + '. ' + e(reference.rangeNote) + '</p>';
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'; object-src \'none\'"><title>ReLoop report · ' + e(draft.name) + '</title><style>' +
    'body{margin:0;background:#f6f3eb;color:#183d30;font:16px/1.6 system-ui,sans-serif}main{max-width:850px;margin:auto;padding:48px 24px}h1,h2{font-family:Georgia,serif;font-weight:400;line-height:1.15}h1{font-size:clamp(34px,7vw,60px);overflow-wrap:anywhere}h2{font-size:30px;margin-top:48px}.eyebrow,small{font-size:12px;letter-spacing:.04em}a{color:#183d30;overflow-wrap:anywhere}.notice{border-left:3px solid #b44726;padding:12px 18px;background:#eee9df}.metrics{display:flex;flex-wrap:wrap;gap:32px;border-block:1px solid #d9ddd0;padding:24px 0}.metric{flex:1;min-width:180px}.metric strong{display:block;font:32px Georgia,serif}.metric span{font-size:13px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{text-align:left;padding:12px 8px;border-bottom:1px solid #d9ddd0;overflow-wrap:anywhere}ol{padding-left:24px}li{margin-bottom:22px}li p{margin:6px 0}.note{white-space:pre-wrap;overflow-wrap:anywhere}footer{border-top:1px solid #d9ddd0;margin-top:40px;padding-top:24px;font-size:13px}@media print{body{background:white}main{padding:0}a{color:inherit}.notice{break-inside:avoid}.metric{break-inside:avoid}h2{break-after:avoid}}' +
    '</style></head><body><main><p class="eyebrow">RELOOP / PERSONAL FIELD NOTES / LOCAL_ONLY</p><h1>' + e(draft.name) + '</h1><p>' + e(category.label) + ' · category confirmed by you · ' + e(CONDITIONS[draft.condition]) + '</p><p class="notice">A saved plan is not an environmental result. No photo, verified waste diversion, measured savings, AI recognition or competition eligibility is claimed.</p><p><strong>' + e(reference.status) + '</strong></p><div class="metrics">' + metrics + '</div><p>' + e(impact.reason) + '</p><h2>' + e(guide.title) + '</h2><ol>' + steps + '</ol><p class="notice"><strong>Safety first.</strong> ' + e(guide.safety) + '</p><h2>Local acceptance is still your check</h2><p><strong>' + e(location.label) + '</strong> — ' + e(location.text) + '</p><h2>Inputs & selected baseline</h2><table><thead><tr><th>Input / reference</th><th>Value</th><th>Basis</th></tr></thead><tbody>' +
    row('Mass, per item', draft.mass + ' kg', 'User input/default assumption, not weighed by the app; only the selected material mass is counted.') + row('Quantity', draft.quantity, 'User input/default assumption') + row('Displacement', draft.displacement + '%', 'Assumed share of an equivalent new material/product purchase replaced; ignored on unmodelled disposal routes.') + row('New price, per item', draft.price + ' ' + draft.currency, 'User assumption, not a quote; currency switch does not convert values.') + row('Route cost, per item', draft.cost + ' ' + draft.currency, 'User assumption, not a quote') + factorRows + '</tbody></table>' + provenance +
    '<h2>Boundary: what the source does and does not mean</h2><p>' + e(reference.boundary) + '</p><p>' + e(reference.exclusions) + '</p><p>' + e(reference.waterNote) + '</p><p>For source-backed carbon: quantity × material mass (kg/item) × published MTCO₂e/US short ton × 1000 / ' + SHORT_TON_KG + ' × displacement / 100. For opt-in illustrative mode, use the assumed kg CO₂e/kg and L/kg factors instead. Spending difference = quantity × (new price × displacement / 100 − route cost). Recycling has no CO₂/water credit and counts only entered costs; unsafe/unidentified items have no metrics. Negative spending is additional cost; a handover concerns the recipient’s displaced purchase, not your income.</p><p class="notice">' + e(boundary) + ' Source current-mix/virgin alternatives and illustrative endpoints are not statistical confidence intervals. Results use at most two significant digits and must not be combined with separate recycling credits. Neither an authoritative source nor a checkmark verifies the user’s displacement assumption.</p>' +
    (draft.notes ? '<h2>Your note</h2><p class="note">' + e(draft.notes) + '</p>' : '') + '<h2>Sources & actual scope</h2><p>EPA WARM supplies only the explicitly selected glass/PET carbon references; NIST supplies unit conversion. Other sources support qualitative guidance/boundaries, not optional illustrative factors or user inputs. No live listings or location tracking.</p><ul>' + sources + '</ul><footer>Exported locally: ' + e(new Date(createdAt).toISOString()) + ' · Model: ' + e(impact.modelVersion) + ' · Route: ' + e(ACTIONS[draft.action]) + '<br>LOCAL_ONLY. Publication/entry are human-gated: fee, new-work/AI rules, eligibility and final prizes remain unresolved. External source links send a request only if you deliberately follow them.</footer></main></body></html>';
}

export function wrapText(value, width = 28, maxLines = 3) {
  const chars = Array.from(String(value).replace(/\s+/g, ' ').trim());
  const lines = [];
  while (chars.length && lines.length < maxLines) {
    let take = Math.min(width, chars.length);
    if (chars.length > width) {
      const lastSpace = chars.slice(0, width + 1).lastIndexOf(' ');
      if (lastSpace > width / 2) take = lastSpace;
    }
    lines.push(chars.splice(0, take).join('').trim());
    while (chars[0] === ' ') chars.shift();
  }
  if (chars.length && lines.length) lines[lines.length - 1] = Array.from(lines[lines.length - 1]).slice(0, Math.max(1, width - 1)).join('') + '…';
  return lines;
}
const svgLines = (value, x, y, width, maxLines, size, colour = '#183d30') => '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + colour + '" font-family="Arial, sans-serif">' + wrapText(value, width, maxLines).map((line, i) => '<tspan x="' + x + '" dy="' + (i ? size * 1.25 : 0) + '">' + e(line) + '</tspan>').join('') + '</text>';

export function buildPoster(input) {
  const draft = checked(input);
  const impact = calculateScenario(draft);
  const guide = getGuide(draft);
  const cat = CATEGORIES[draft.category];
  const name = '<text x="76" y="196" font-size="58" font-family="Georgia, serif" fill="#183d30">' + wrapText(draft.name, 24, 3).map((line, i) => '<tspan x="76" dy="' + (i ? 69 : 0) + '">' + e(line) + '</tspan>').join('') + '</text>';
  const reference = impact.baseline;
  const factors = reference.kind === 'source' ? 'EPA WARM v16 (Dec 2023): ' + reference.rawCarbonText.join(' / ') + ' MTCO2e/US short ton; current / virgin.' : reference.carbon ? 'Factors assumed: ' + reference.carbon.join('–') + ' kg CO2e/kg; ' + reference.water.join('–') + ' L/kg.' : 'No verified environmental baseline selected.';
  const metrics = [[formatRange(impact.carbon), 'kg CO₂e · production scenario'], [formatRange(impact.water), reference.water ? 'L · illustrative water, not a footprint' : 'Water: not modelled; no component or local-water data'], [formatMoney(impact.money, draft.currency), draft.currency + ' · spending difference']].map(([value, label], i) => '<text x="76" y="' + (486 + i * 95) + '" font-family="Georgia, serif" font-size="42" fill="#f6f3eb">' + e(value) + '</text><text x="76" y="' + (519 + i * 95) + '" font-family="Arial,sans-serif" font-size="19" fill="#d9ddd0">' + e(label) + '</text>').join('');
  const steps = guide.steps.map((step, i) => svgLines('0' + (i + 1) + '  ' + step.title, 76, 858 + i * 52, 54, 1, 24)).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-labelledby="title desc"><title id="title">ReLoop local scenario · ' + e(draft.name) + '</title><desc id="desc">' + e(boundary) + ' Not measured savings. The companion HTML report has full guidance, inputs and source citations.</desc><rect width="1080" height="1350" fill="#f6f3eb"/><path d="M915 82a46 46 0 1 0 35 70" fill="none" stroke="#b44726" stroke-width="7"/><path d="m951 116 0 37-36-3" fill="none" stroke="#b44726" stroke-width="7"/><text x="76" y="91" font-size="22" font-family="Arial,sans-serif" fill="#183d30" letter-spacing="3">RELOOP / ANOTHER CHAPTER</text>' + name + svgLines(guide.title + ' · ' + cat.label, 76, 382, 66, 1, 24) + '<rect x="48" y="426" width="984" height="330" rx="6" fill="#183d30"/>' + metrics + svgLines('YOUR THREE-STEP FIELD GUIDE', 76, 804, 60, 1, 17) + steps + '<path d="M76 993h928" stroke="#d9ddd0"/>' + svgLines(reference.kind === 'source' ? 'SOURCE-BACKED REFERENCE — NOT MEASURED SAVINGS' : 'ILLUSTRATIVE OR UNKNOWN — NOT MEASURED SAVINGS', 76, 1035, 72, 1, 18, '#b44726') + svgLines('Mass ' + draft.mass + ' kg/item × ' + draft.quantity + ' item(s) × ' + draft.displacement + '% displacement.', 76, 1070, 84, 1, 18) + svgLines(factors, 76, 1100, 84, 2, 18) + svgLines(reference.kind === 'source' ? (reference.id === 'warm_pet_v16' ? 'PET RESIN ONLY: excludes bottle forming, caps/labels, use and disposal. Not net/marginal savings.' : 'CONTAINER GLASS ONLY: gross production reference. Added reuse burdens, use and disposal excluded.') : impact.reason, 76, 1160, 85, 2, 18) + svgLines(reference.kind === 'source' ? 'Source: EPA WARM v16, Background Ex. 6-1 (PDF p61). NIST short-ton conversion.' : 'Guidance: US EPA. Illustrative factors are author assumptions, not source data.', 76, 1230, 88, 1, 16) + svgLines('Full sources, costs, safety and local checks: companion HTML report. LOCAL_ONLY · ' + impact.modelVersion, 76, 1260, 90, 2, 16) + '</svg>';
}
