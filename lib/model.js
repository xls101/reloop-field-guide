import { ACTIONS, CATEGORIES, CONDITIONS, CURRENCIES, GUIDANCE, LEGACY_MODEL_VERSION, MODEL_VERSION, REGIONS } from './data.js';
import { BASELINES, SHORT_TON_KG } from './baselines.js';

export function escapeHtml(value) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const text = value => String(value ?? '').trim();
const choice = (map, value) => typeof value === 'string' && Object.hasOwn(map, value);
const finite = value => (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && Number.isFinite(Number(value));

export function matchesBaseline(baselineId, name, category) {
  const baseline = BASELINES[baselineId];
  if (!Object.hasOwn(BASELINES, baselineId) || baseline.kind !== 'source' || baseline.category !== category) return false;
  const value = text(name).normalize('NFKC').toLowerCase();
  if (baselineId === 'warm_glass_v16') return /\bglass\b/.test(value) && /\b(jar|bottle|container)\b/.test(value) && !/\b(window|mirror|ceramic|porcelain|drinking|crystal|fiberglass|fibreglass|tempered|borosilicate|pyrex|plate|cup|mug|lead)\b/.test(value);
  if (baselineId === 'warm_pet_v16') return /\b(pet|polyethylene terephthalate)\b/.test(value) && /\b(bottle|container|jar)\b/.test(value) && !/\b(petg|mixed|multilayer|composite|polyester|non-pet)\b/.test(value);
  return false;
}

export function validateDraft(input = {}) {
  const errors = {};
  const name = text(input.name).replace(/\s+/g, ' ');
  const city = text(input.city).replace(/\s+/g, ' ');
  const notes = text(input.notes);
  if (name.length < 2 || name.length > 100) errors.name = 'Use an item name between 2 and 100 characters.';
  if (city.length > 80) errors.city = 'Keep the locality under 80 characters.';
  if (notes.length > 500) errors.notes = 'Keep your note under 500 characters.';
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(name + city + notes)) errors.name = 'Remove unsupported control characters.';
  for (const [key, map] of Object.entries({ category: CATEGORIES, action: ACTIONS, condition: CONDITIONS, region: REGIONS, currency: CURRENCIES })) {
    if (!choice(map, input[key])) errors[key] = 'Choose a valid ' + key + '.';
  }
  const baseline = input.baseline ?? (input.modelVersion === LEGACY_MODEL_VERSION ? 'illustrative' : 'none');
  if (!choice(BASELINES, baseline)) errors.baseline = 'Choose a valid environmental baseline.';
  if (choice(BASELINES, baseline) && BASELINES[baseline].kind === 'source') {
    if (!matchesBaseline(baseline, name, input.category)) errors.baseline = 'This source does not defensibly match the named material. Use no verified baseline, or identify container glass / PET resin explicitly.';
    if (input.baselineConfirmed !== true) errors['baseline-confirmed'] = 'Confirm the exact source material, counted mass and reference boundary yourself.';
  }
  if (input.confirmed !== true) errors.confirmed = 'Confirm the material category yourself; a keyword hint is not classification.';
  const value = { name, city, notes, category: input.category, action: input.action, condition: input.condition, region: input.region, currency: input.currency, confirmed: input.confirmed === true, baseline, baselineConfirmed: choice(BASELINES, baseline) && BASELINES[baseline].kind === 'source' && input.baselineConfirmed === true, modelVersion: input.modelVersion === LEGACY_MODEL_VERSION ? LEGACY_MODEL_VERSION : MODEL_VERSION };
  const bounds = { quantity: [1, 100, true], mass: [0.001, 1000, false], price: [0, 1000000, false], cost: [0, 1000000, false], displacement: [0, 100, true] };
  for (const [key, [min, max, integer]] of Object.entries(bounds)) {
    const number = Number(input[key]);
    if (!finite(input[key]) || number < min || number > max || (integer && !Number.isInteger(number))) errors[key] = 'Use ' + (integer ? 'a whole number' : 'a number') + ' from ' + min + ' to ' + max + ' for ' + key + '.';
    value[key] = number;
  }
  value.completedSteps = Array.isArray(input.completedSteps) && input.completedSteps.length === 3 && input.completedSteps.every(x => typeof x === 'boolean') ? [...input.completedSteps] : [false, false, false];
  return { ok: Object.keys(errors).length === 0, errors, value };
}

export function hazardFor(name, condition = 'good') {
  const value = text(name).toLowerCase();
  if (/\b(batter(?:y|ies)|power bank|swollen|leaking cell)\b/.test(value)) return { code: 'battery', message: 'Battery safety comes first. No DIY battery repair, general-waste or curbside-recycling advice is appropriate here.', source: 'EPA_BATTERIES' };
  if (/\b(paint|solvent|pesticide|chemical|bleach|fuel|gas cylinder|propane|aerosol|medicine|medication|sharps|needle)\b/.test(value)) return { code: 'hazardous', message: 'This may need a hazardous-waste or medicine take-back route. Do not open, mix, empty into drains, or donate it without specialist advice.', source: 'EPA_RECYCLE' };
  if (/\b(mould\w*|moldy|mold|infested|contaminated|asbestos)\b/.test(value)) return { code: 'contaminated', message: 'Contamination makes an ordinary reuse or donation plan inappropriate. Seek local specialist advice before handling.', source: 'EPA_RECYCLE' };
  if (/\b(cracked|broken|chipped)\s+(glass|jar|bottle)\b/.test(value)) return { code: 'glass', message: 'Damaged glass is not a safe reuse or food-container repair project. Ask your local program how to contain and dispose of it.', source: 'EPA_RECYCLE' };
  if (condition === 'unsafe') return { code: 'uncertain', message: 'You marked this item possibly unsafe. Identify the risk with a qualified professional or local authority before use or donation.', source: 'EPA_RECYCLE' };
  return null;
}

// Conservative typed-text keyword hints. Photos and filenames never reach this function.
export function suggestCategory(name) {
  const value = text(name).normalize('NFKC').toLowerCase();
  if (hazardFor(value)) return 'unknown';
  const patterns = {
    textile: /\b(t[ -]?shirt|tee|shirt|jeans|denim|coat|jacket|jumper|sweater|trousers|dress|towel|textile|tablecloth|clothing)\b/,
    electronics: /\b(phone|smartphone|laptop|computer|tablet|headphones|earbuds|speaker|charger|keyboard|monitor|electronic)\b/,
    furniture: /\b(chair|desk|table|sofa|cabinet|stool|furniture|bookcase)\b/,
    glass: /\bglass\b|\b(jam jar|mason jar)\b/,
    plastic: /\b(plastic|lunchbox|storage box)\b/,
    paper: /\b(book|paperback|notebook|newspaper|cardboard|paper|magazine)\b/
  };
  const hits = Object.entries(patterns).filter(([, pattern]) => pattern.test(value)).map(([category]) => category);
  return hits.length === 1 ? hits[0] : null;
}

export function getGuide(draft) {
  const hazard = hazardFor(draft.name, draft.condition);
  const category = CATEGORIES[draft.category];
  const g = GUIDANCE[draft.category];
  if (!choice(CATEGORIES, draft.category) || !g || !category || !choice(ACTIONS, draft.action)) throw new RangeError('Unknown guide category or action.');
  if (hazard) {
    return { title: 'Take the safe route first', intro: hazard.message, sourceIds: [hazard.source], safety: hazard.message, steps: [
      { title: 'Pause ordinary reuse', body: 'Keep the item out of use and away from children or pets. Do not dismantle it, charge a damaged battery, or try an improvised repair.' },
      { title: 'Ask a specialist', body: 'Contact the manufacturer or local waste authority with the item type and condition. Follow their handling instructions; if there is immediate heat, smoke, a leak or fire, use local emergency advice.' },
      { title: 'Confirm a safe handover', body: 'Arrange only an accepted specialist collection or take-back route. Do not put it in a guessed bin or pass it on as usable.' }
    ] };
  }
  let fix = g.fix;
  if (draft.category === 'textile' && /\b(jeans|denim)\b/i.test(draft.name)) fix = 'Patch a small denim tear from the inside with suitable fabric and stitching. Avoid a repair where the surrounding denim is badly worn; a tailor can assess it.';
  if (draft.category === 'electronics' && /\blaptop\b/i.test(draft.name)) fix = 'Back up your laptop, install supported software updates and check the maker’s diagnostics. A qualified service should handle internal faults or battery work.';
  if (draft.category === 'furniture' && /\bchair\b/i.test(draft.name)) fix = 'Keep the chair unused until stable. Tighten accessible fasteners with the correct tool; a cracked frame or loose load-bearing joint needs professional assessment.';
  let steps;
  if (draft.action === 'repair') steps = [{ title: 'Inspect before you fix', body: g.check }, { title: 'Make a small, safe repair', body: fix }, { title: 'Check it, then keep it', body: g.test }];
  if (draft.action === 'reuse') steps = [{ title: 'Check the starting point', body: g.check }, { title: 'Give it a useful new role', body: g.reuse }, { title: 'Replace a real need', body: 'Try the new role before buying an alternative. Only count displacement if this useful item actually replaces something you would otherwise buy.' }];
  if (draft.action === 'donate') steps = [{ title: 'Prepare it honestly', body: g.donation }, { title: 'Find a willing recipient', body: 'Contact a local charity, repair group or person first. Ask about acceptance, opening hours and collection; this app has not looked up live listings.' }, { title: 'Make the handover useful', body: 'Disclose condition, agree a safe pickup and include relevant parts or care instructions. Donation is not automatically a displaced new purchase.' }];
  if (draft.action === 'recycle') steps = [{ title: 'Prepare the right material', body: g.recycle }, { title: 'Check the local stream', body: 'Confirm this exact item, material and condition with the local program. A material label does not mean the item is accepted where you live.' }, { title: 'Use a confirmed collection', body: 'Follow the confirmed preparation and drop-off instructions. Recycling outcomes are not modelled here because local processing data are missing.' }];
  return { title: ACTIONS[draft.action], intro: category.label + ' · ' + CONDITIONS[draft.condition], steps, safety: g.safety, sourceIds: [g.source, 'EPA_RECYCLE'] };
}

export function getLocationAdvice(draft) {
  const place = draft.city ? 'For ' + draft.city + ': ' : '';
  if (draft.region === 'us') return { label: 'United States', text: place + 'City, county and hauler rules vary. Confirm the exact material, battery/e-waste and bulky-item streams with your local program. EPA guidance is national context, not local acceptance.', sourceId: 'EPA_RECYCLE' };
  if (draft.region === 'ew') return { label: 'England & Wales', text: place + 'Use your council’s current collection guidance. Bookings, fees, textile acceptance and bulky-item rules vary; GOV.UK’s postcode lookup covers England and Wales only.', sourceId: 'UK_COLLECTIONS' };
  return { label: draft.region === 'other' ? 'Your local authority' : 'Location still to confirm', text: place + 'No local collection has been verified. Ask your municipal authority or licensed program about this exact item and its condition. Rules, opening hours, availability and fees may differ.', sourceId: 'EPA_RECYCLE' };
}

export function getBaseline(draft) {
  const id = draft.baseline ?? (draft.modelVersion === LEGACY_MODEL_VERSION ? 'illustrative' : 'none');
  if (!choice(BASELINES, id)) throw new RangeError('Unknown environmental baseline.');
  const reference = BASELINES[id];
  const category = CATEGORIES[draft.category];
  if (reference.kind === 'source') return { ...reference, id, carbon: reference.rawCarbon.map(factor => factor * 1000 / SHORT_TON_KG), water: null, status: 'SOURCE-BACKED · US EPA WARM v16 (December 2023)', rangeNote: 'Source endpoints are current-mix and 100% virgin alternatives, not a confidence interval. They do not bound every producer or location.' };
  if (reference.kind === 'illustrative') return { ...reference, id, carbon: category?.carbon ?? null, water: category?.water ?? null, status: 'AUTHOR ASSUMPTIONS · not sourced or validated', boundary: 'Illustrative gross production only. All environmental factors are author-set examples, not representative category averages.', exclusions: 'Repair, cleaning, all transport, use, disposal, market response and water scarcity are omitted; not net savings.', waterNote: 'Uncalibrated assumed litres only; no green/blue/grey component or local water saving is calculated.', rangeNote: 'Author-set what-if endpoints, not a confidence interval.' };
  return { ...reference, id, status: 'NO VERIFIED ENVIRONMENTAL BASELINE', boundary: 'No defensible material/product match was selected. Environmental results remain unknown.', exclusions: 'Price, cost, mass and displacement remain user inputs, not environmental measurements.', waterNote: 'No water inventory or component data. Not modelled.', rangeNote: 'No range assigned.' };
}

export function calculateScenario(input) {
  const validated = validateDraft(input);
  if (!validated.ok) throw new RangeError(Object.values(validated.errors).join(' '));
  const draft = validated.value;
  const reference = getBaseline(draft);
  const hazard = hazardFor(draft.name, draft.condition);
  const known = draft.category !== 'unknown';
  const allowed = !hazard && known && draft.action !== 'recycle';
  const displacement = draft.displacement / 100;
  const scale = draft.mass * draft.quantity * displacement;
  const modelled = Boolean(allowed && reference.carbon);
  return {
    modelVersion: draft.modelVersion, modelled, displacementEnabled: allowed,
    baseline: reference,
    reason: hazard ? 'Safety assessment needed; no environmental or spending estimate.' : !known ? 'Unidentified item: no environmental or spending model.' : draft.action === 'recycle' ? 'Recycling needs local processing data; no CO2 or water estimate. Only your entered route cost is shown.' : reference.kind === 'unknown' ? 'No verified environmental baseline selected. CO2 and water are unknown; the spending scenario uses only your price/cost/displacement inputs.' : reference.kind === 'source' ? 'Source-backed WARM production reference × assumed displaced material mass. Gross what-if only: not a measured, net or marginal saving; water is not modelled.' : 'Illustrative gross production displacement, not measured or net savings.',
    carbon: modelled ? reference.carbon.map(factor => factor * scale) : null,
    water: allowed && reference.water ? reference.water.map(factor => factor * scale) : null,
    money: hazard || !known ? null : draft.quantity * ((allowed ? draft.price * displacement : 0) - draft.cost),
    factors: { carbon: reference.carbon, water: reference.water, status: reference.status },
    displacement: allowed ? displacement : 0
  };
}

export const formatNumber = value => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(Object.is(value, -0) ? 0 : value);
export function formatRange(range) {
  if (!range) return 'Not modelled';
  const low = formatNumber(range[0]); const high = formatNumber(range[1]);
  return low + (low === high ? '' : '–' + high);
}
export function formatMoney(value, currency = 'USD') {
  if (value === null) return 'Not modelled';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumSignificantDigits: 2 }).format(Object.is(value, -0) ? 0 : value);
}
