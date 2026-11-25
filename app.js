import { ACTIONS, CATEGORIES, CONDITIONS, CURRENCIES, MODEL_VERSION, REGIONS, SOURCES } from './lib/data.js';
import { calculateScenario, formatMoney, formatNumber, formatRange, getGuide, getLocationAdvice, getBaseline, matchesBaseline, suggestCategory, validateDraft } from './lib/model.js';
import { buildPoster, buildReport, filenameFor } from './lib/report.js';
import { clearShelf, createRecord, loadShelf, saveShelf, upsertRecord } from './lib/storage.js';
import { BASELINES, SHORT_TON_KG } from './lib/baselines.js';

const $ = id => document.getElementById(id);
const node = (tag, className, value) => { const element = document.createElement(tag); if (className) element.className = className; if (value !== undefined) element.textContent = value; return element; };
const form = $('item-form');
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { throw Object.assign(new Error('Unavailable'), { name: 'SecurityError' }); }, setItem() { throw new Error('Unavailable'); }, removeItem() { throw new Error('Unavailable'); } }; }
let shelf = loadShelf(storage);
let active = null;
let currentId = null;
let dirty = false;
let unsaved = true;
let hint = null;
let photoUrl = null;
let photoToken = 0;
let toastTimer;
let pendingAction = null;

function populateOptions(id, values) {
  for (const [value, item] of Object.entries(values)) { const option = node('option', '', typeof item === 'string' ? item : item.label); option.value = value; $(id).append(option); }
}
populateOptions('category', CATEGORIES);
populateOptions('baseline', BASELINES);
populateOptions('condition', CONDITIONS);
populateOptions('action', ACTIONS);
populateOptions('region', REGIONS);
populateOptions('currency', Object.fromEntries(Object.keys(CURRENCIES).map(code => [code, code + ' (' + CURRENCIES[code] + ')'])));
for (const [value, label] of Object.entries(ACTIONS)) {
  const button = node('button', '', label); button.type = 'button'; button.dataset.action = value; button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    if (!active || dirty) return;
    active.action = value; active.completedSteps = [false, false, false]; $('action').value = value; unsaved = true; renderPlan(); message('Route changed. Save to keep this version.');
  });
  $('route-options').append(button);
}
for (const [key, item] of Object.entries(CATEGORIES)) {
  const row = node('tr');
  for (const value of [item.label, item.mass, item.carbon?.join('–') ?? 'Not assigned', item.water?.join('–') ?? 'Not assigned', item.price + ' / ' + item.cost]) row.append(node('td', '', value));
  row.dataset.category = key; $('assumption-table').append(row);
}
for (const source of SOURCES) {
  const li = node('li'); const link = node('a', '', source.title + ' ↗'); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  li.append(link, node('p', '', source.scope)); $('source-list').append(li);
}

function toast(value) { $('toast').textContent = value; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4200); }
function message(value) { $('plan-message').textContent = value; }
function readDraft() {
  return { name: $('name').value, category: $('category').value, confirmed: $('confirmed').checked, baseline: $('baseline').value, baselineConfirmed: $('baseline-confirmed').checked, condition: $('condition').value, action: $('action').value, region: $('region').value, city: $('city').value, quantity: $('quantity').value, mass: $('mass').value, price: $('price').value, cost: $('cost').value, currency: $('currency').value, displacement: $('displacement').value, notes: $('notes').value, completedSteps: active?.completedSteps ?? [false, false, false] };
}
function updateBaselineSelection(reset = false) {
  if (reset) $('baseline-confirmed').checked = false;
  for (const option of $('baseline').options) {
    const reference = BASELINES[option.value];
    option.disabled = reference.kind === 'source' && !matchesBaseline(option.value, $('name').value, $('category').value);
  }
  const current = $('baseline').selectedOptions[0];
  if (current?.disabled) { $('baseline').value = 'none'; $('baseline-confirmed').checked = false; }
  const reference = getBaseline({ category: $('category').value || 'unknown', baseline: $('baseline').value });
  $('baseline-confirmation').hidden = reference.kind !== 'source';
  $('baseline-confirmation-text').textContent = reference.confirmation ?? '';
  $('baseline-help').textContent = reference.kind === 'source' ? reference.boundary + ' ' + reference.waterNote : reference.kind === 'illustrative' ? 'Opt-in illustrative factors only: author assumptions, not public data. Mass, prices and displacement are also your assumptions.' : 'Default: no environmental number without a defensible reference. Identify a glass jar/bottle or PET bottle/container to enable its published material pathway; selection and boundary confirmation are still required.';
}
function updateHint() {
  hint = suggestCategory($('name').value);
  $('use-hint').hidden = !hint;
  $('use-hint').textContent = hint ? 'Use keyword hint: ' + CATEGORIES[hint].label : '';
  $('name-hint').textContent = hint ? 'Keyword hint: ' + CATEGORIES[hint].label + '. This is typed-text matching, not AI or a safety assessment.' : 'No reliable keyword hint. Choose the material category yourself.';
}
function setDefaults(category) {
  const item = Object.hasOwn(CATEGORIES, category) ? CATEGORIES[category] : CATEGORIES.unknown;
  for (const key of ['mass', 'price', 'cost']) $(key).value = item[key];
  $('defaults-summary').textContent = 'ASSUMED EXAMPLE · ' + item.label + ' · ' + item.mass + ' kg/item · new ' + item.price + ' / cost ' + item.cost + ' ' + $('currency').value + '. Not measured or quoted.';
}
function clearErrors() {
  $('form-error').hidden = true; $('form-error').textContent = '';
  for (const element of form.querySelectorAll('[aria-invalid]')) element.removeAttribute('aria-invalid');
  $('displacement').removeAttribute('aria-invalid');
}
function displayErrors(errors) {
  clearErrors(); $('form-error').textContent = Object.values(errors).join(' '); $('form-error').hidden = false;
  if (Object.keys(errors).some(key => ['quantity', 'mass', 'price', 'cost', 'notes'].includes(key))) $('scenario-inputs').open = true;
  for (const key of Object.keys(errors)) $(key)?.setAttribute('aria-invalid', 'true');
  $(Object.keys(errors)[0])?.focus();
}
function enableActions() {
  const allowed = Boolean(active) && !dirty;
  $('save-plan').disabled = !allowed || shelf.mode === 'corrupt';
  $('export-report').disabled = !allowed; $('export-poster').disabled = !allowed;
  $('displacement').disabled = !allowed || !calculateScenario(active).displacementEnabled;
  for (const button of $('route-options').querySelectorAll('button')) button.disabled = !allowed;
  for (const checkbox of $('guide-steps').querySelectorAll('input')) checkbox.disabled = !allowed;
  $('save-plan').textContent = currentId ? 'Update saved plan' : 'Save to my shelf';
  $('make-plan').textContent = active ? 'Update my plan →' : 'Make my plan →';
  $('plan-state').textContent = dirty ? 'Previous plan · update to apply edits' : unsaved ? (currentId ? 'Unsaved update' : 'Unsaved plan') : shelf.mode === 'persistent' ? 'Saved on this browser' : 'Kept in this tab only';
}
function markDirty(key) {
  if (!active) return;
  dirty = true; unsaved = true;
  if (['name', 'category', 'condition', 'action'].includes(key)) active.completedSteps = [false, false, false];
  for (const id of ['carbon-value', 'water-value', 'money-value']) { $(id).textContent = '—'; $(id).classList.remove('unmodelled'); }
  $('scenario-reason').textContent = 'Inputs changed. Update the plan before using its guidance or exporting a scenario.';
  message('You have unapplied edits. Choose “Update my plan” to use them.'); enableActions();
}
function sourceLink(id, sourceId) {
  const source = SOURCES.find(item => item.id === sourceId) ?? SOURCES[1]; $(id).href = source.url;
}
function renderImpact() {
  if (!active) return;
  const impact = calculateScenario(active); const reference = impact.baseline;
  const values = { 'carbon-value': formatRange(impact.carbon), 'water-value': formatRange(impact.water), 'money-value': formatMoney(impact.money, active.currency) };
  for (const [id, value] of Object.entries(values)) { $(id).textContent = value; $(id).classList.toggle('unmodelled', value === 'Not modelled'); }
  $('money-unit').textContent = active.currency + ' · assumed difference, not income';
  $('displacement').value = active.displacement; $('displacement-output').textContent = impact.displacementEnabled ? active.displacement + '%' : 'n/a';
  $('scenario-reason').textContent = impact.reason;
  const content = node('div', 'factor-table');
  const items = ['Model: ' + impact.modelVersion + ' · ' + reference.status, 'Mass: ' + active.mass + ' kg/item × quantity ' + active.quantity + ' × displacement ' + active.displacement + '% · user inputs'];
  if (reference.kind === 'source') items.push('Published: ' + reference.published + ' · ' + reference.sourcePage, 'Original carbon values: ' + reference.rawCarbonText.join(' / ') + ' ' + reference.rawUnit + ' · current mix / 100% virgin.', 'Conversion: original factor × 1000 kg CO₂e/MT ÷ ' + SHORT_TON_KG + ' kg/US short ton; × displaced material mass.', reference.rangeNote);
  else if (reference.carbon) items.push('Carbon: ' + reference.carbon.join('–') + ' kg CO₂e/kg · illustrative assumption.');
  else items.push('No environmental factor selected. CO₂e remains unknown.');
  if (reference.water) items.push('Water: ' + reference.water.join('–') + ' L/kg · uncalibrated author assumption, not a footprint.');
  else items.push('Water: not modelled. No green/blue/grey components, scarcity impacts or local tap-water savings.');
  items.push(reference.boundary, reference.exclusions, 'New price: ' + active.price + ' ' + active.currency + '/item; route cost: ' + active.cost + ' ' + active.currency + '/item · your assumptions, not quotes.');
  for (const value of items) content.append(node('p', '', value));
  if (reference.kind === 'source') { const source = SOURCES.find(item => item.id === reference.sourceId); const link = node('a', 'text-link', 'Published EPA table (opens externally only if chosen) ↗'); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(link); }
  $('baseline-badge').textContent = reference.kind === 'source' ? 'SOURCE-BACKED · EPA WARM v16' : reference.kind === 'illustrative' ? 'ILLUSTRATIVE ASSUMPTIONS' : 'NO VERIFIED BASELINE';
  $('carbon-label').textContent = reference.kind === 'source' ? 'MATERIAL PRODUCTION REFERENCE' : 'PRODUCTION CARBON SCENARIO';
  $('carbon-unit').textContent = reference.kind === 'source' ? 'kg CO₂e · current-mix / virgin alternatives' : 'kg CO₂e · gross illustrative scenario';
  $('water-unit').textContent = reference.water ? 'L · uncalibrated assumption, not a footprint' : 'no verified water/component factor';
  $('factor-values').replaceChildren(content); enableActions();
}
function renderPlan() {
  if (!active) return;
  const guide = getGuide(active); const location = getLocationAdvice(active);
  $('plan-empty').hidden = true; $('plan-content').hidden = false;
  $('plan-heading').textContent = active.name; $('plan-subtitle').textContent = 'Three practical steps. A category you confirmed—not a photo verdict.';
  $('plan-category').textContent = CATEGORIES[active.category].label;
  $('plan-route-intro').textContent = guide.title + ' · ' + guide.intro;
  for (const button of $('route-options').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.action === active.action));
  const list = guide.steps.map((step, index) => {
    const li = node('li', active.completedSteps[index] ? 'completed' : ''); li.append(node('span', 'step-number', '0' + (index + 1)));
    const copy = node('div'); copy.append(node('h3', '', step.title), node('p', '', step.body));
    const label = node('label', 'check-row step-check'); const checkbox = node('input'); checkbox.type = 'checkbox'; checkbox.checked = active.completedSteps[index]; checkbox.setAttribute('aria-label', 'Mark step ' + (index + 1) + ' done');
    checkbox.addEventListener('change', () => { if (dirty) return; active.completedSteps[index] = checkbox.checked; li.classList.toggle('completed', checkbox.checked); unsaved = true; message('Checkmark noted by you; not independently verified. Save to keep it.'); enableActions(); });
    label.append(checkbox, node('span', '', 'Done, according to me')); copy.append(label); li.append(copy); return li;
  });
  $('guide-steps').replaceChildren(...list);
  $('safety-text').textContent = guide.safety; sourceLink('safety-source', guide.sourceIds[0]);
  $('location-label').textContent = location.label; $('location-text').textContent = location.text; sourceLink('location-source', location.sourceId);
  renderImpact();
}
function renderShelf() {
  $('nav-count').textContent = '(' + shelf.entries.length + ')';
  $('storage-status').textContent = shelf.message;
  $('storage-status').classList.toggle('storage-warning', shelf.mode !== 'persistent');
  $('shelf-empty').hidden = shelf.entries.length > 0;
  $('reset-shelf').disabled = shelf.entries.length === 0 && shelf.mode !== 'corrupt';
  const rows = shelf.entries.map(entry => {
    const li = node('li'); const info = node('div', 'history-info');
    const open = node('button', 'history-name', entry.name); open.type = 'button'; open.setAttribute('aria-label', 'Open saved plan for ' + entry.name); open.addEventListener('click', () => openPlan(entry.id));
    const completed = entry.completedSteps.filter(Boolean).length;
    info.append(open, node('p', 'history-meta', ACTIONS[entry.action] + ' · ' + CATEGORIES[entry.category].label + ' · ' + getBaseline(entry).label + ' · ' + entry.displacement + '% assumed displacement · ' + completed + '/3 steps marked done'));
    const remove = node('button', 'history-delete', 'Remove'); remove.type = 'button'; remove.setAttribute('aria-label', 'Remove saved plan for ' + entry.name);
    remove.addEventListener('click', () => confirmAction('Remove this saved plan?', '“' + entry.name + '” will be removed from this browser’s ReLoop shelf. Export it first if you want a copy.', 'Yes, remove plan', () => removePlan(entry.id)));
    li.append(info, remove); return li;
  });
  $('history-list').replaceChildren(...rows);
  if (active) enableActions();
}
function openPlan(id) {
  const entry = shelf.entries.find(item => item.id === id); if (!entry) return;
  active = { ...entry, completedSteps: [...entry.completedSteps] }; currentId = id; dirty = false; unsaved = false; clearErrors(); clearPhoto(false);
  for (const key of ['name', 'category', 'condition', 'action', 'region', 'city', 'quantity', 'mass', 'price', 'cost', 'currency', 'displacement', 'notes']) $(key).value = entry[key];
  $('confirmed').checked = true; $('baseline').value = entry.baseline ?? 'illustrative'; $('baseline-confirmed').checked = entry.baselineConfirmed === true; updateHint(); updateBaselineSelection(); $('defaults-summary').textContent = 'YOUR SAVED INPUTS · mass/prices/displacement remain user assumptions; environmental provenance follows the selected baseline.';
  $('photo-status').textContent = 'Photos are not stored with saved plans. Add another local preview if useful.';
  renderPlan(); message('Saved plan opened locally. Edit and update it without making a duplicate.'); $('plan-heading').focus({ preventScroll: true }); $('plan-panel').scrollIntoView({ block: 'start' });
}
function removePlan(id) {
  const next = shelf.entries.filter(item => item.id !== id); const result = saveShelf(storage, next);
  if (result.mode === 'corrupt') { shelf.mode = result.mode; shelf.message = result.message; renderShelf(); toast(result.message); return; }
  shelf = { mode: result.mode, entries: next, message: result.ok ? 'Plan removed from this browser. Other site data was not touched.' : 'Removed from this tab only. Browser storage could not be updated; older saved data may reappear on reload.' };
  if (currentId === id) { currentId = null; unsaved = true; }
  renderShelf(); toast(shelf.message);
}
function confirmAction(title, description, label, action) {
  $('dialog-title').textContent = title; $('dialog-description').textContent = description; $('dialog-confirm').textContent = label; pendingAction = action;
  $('confirm-dialog').returnValue = 'cancel'; $('confirm-dialog').showModal();
}
$('confirm-dialog').addEventListener('close', () => { const action = pendingAction; pendingAction = null; if ($('confirm-dialog').returnValue === 'confirm') action?.(); });

form.addEventListener('submit', event => {
  event.preventDefault(); const result = validateDraft(readDraft());
  if (!result.ok) { displayErrors(result.errors); return; }
  clearErrors(); active = result.value; dirty = false; unsaved = true; renderPlan(); message('Prepared locally. These are guidance and illustrative scenarios—not verified results.');
  $('plan-heading').focus({ preventScroll: true }); $('plan-panel').scrollIntoView({ block: 'start' });
});
form.addEventListener('input', event => {
  const key = event.target.id;
  if (key === 'photo') return;
  if (key === 'name') { $('confirmed').checked = false; updateHint(); updateBaselineSelection(true); }
  markDirty(key);
});
$('category').addEventListener('change', () => { $('confirmed').checked = false; setDefaults($('category').value); updateBaselineSelection(true); markDirty('category'); });
$('baseline').addEventListener('change', () => updateBaselineSelection(true));
$('currency').addEventListener('change', () => { $('defaults-summary').textContent = 'Currency changed to ' + $('currency').value + '. Values are unchanged; no exchange-rate conversion is performed.'; });
$('use-hint').addEventListener('click', () => { if (!hint) return; $('category').value = hint; $('confirmed').checked = false; setDefaults(hint); updateBaselineSelection(true); markDirty('category'); $('confirmed').focus(); });
for (const button of document.querySelectorAll('[data-example]')) button.addEventListener('click', () => {
  $('name').value = CATEGORIES[button.dataset.example].example; $('confirmed').checked = false; updateHint(); updateBaselineSelection(true); markDirty('name'); $('name').focus();
});
$('displacement').addEventListener('input', () => { if (!active || dirty) return; active.displacement = Number($('displacement').value); unsaved = true; renderImpact(); message('Displacement changed. Save to keep this assumption.'); });
$('save-plan').addEventListener('click', () => {
  if (!active || dirty || shelf.mode === 'corrupt') return;
  try {
    const existing = shelf.entries.find(entry => entry.id === currentId);
    const record = createRecord(active, currentId ?? crypto.randomUUID(), new Date().toISOString(), existing);
    const next = upsertRecord(shelf.entries, record); const result = saveShelf(storage, next);
    if (result.mode === 'corrupt') { shelf.mode = 'corrupt'; shelf.message = result.message; renderShelf(); message(result.message); return; }
    shelf = { entries: next, mode: result.mode, message: result.message }; currentId = record.id; unsaved = false; renderShelf(); message(result.message); toast(result.message);
  } catch (error) { message(error.message); toast(error.message); }
});
$('reset-shelf').addEventListener('click', () => confirmAction('Reset your local shelf?', 'This removes saved ReLoop plans from this browser only. Export what you want to keep first. Your current draft and other site data are not removed.', 'Yes, reset shelf', () => {
  const result = clearShelf(storage);
  if (!result.ok) { toast('Reset failed: browser storage could not be changed. Your stored data was not deliberately overwritten.'); return; }
  shelf = { mode: 'persistent', entries: [], message: 'ReLoop shelf reset after your confirmation. Other site data was not touched.' }; currentId = null; unsaved = true; renderShelf(); toast(shelf.message);
}));
$('start-new').addEventListener('click', () => {
  form.reset(); $('displacement').value = '50'; $('displacement-output').textContent = '50%'; active = null; currentId = null; dirty = false; unsaved = true; clearErrors(); clearPhoto(false);
  $('category').value = ''; $('baseline').value = 'none'; setDefaults('unknown'); updateBaselineSelection(true); $('use-hint').hidden = true; $('name-hint').textContent = 'Plain-text keyword hints only. You choose the category.';
  $('plan-empty').hidden = false; $('plan-content').hidden = true; $('plan-heading').textContent = 'A little care goes a long way.'; $('plan-subtitle').textContent = 'Your practical three-step plan will appear here.'; $('make-plan').textContent = 'Make my plan →';
  for (const id of ['carbon-value', 'water-value', 'money-value']) { $(id).textContent = '—'; $(id).classList.remove('unmodelled'); }
  $('factor-values').replaceChildren(node('p', '', 'No item selected.')); $('scenario-reason').textContent = 'Make a confirmed plan to explore the scenario. No result is pre-filled.'; $('baseline-badge').textContent = 'NO VERIFIED BASELINE';
  for (const id of ['save-plan', 'export-report', 'export-poster', 'displacement']) $(id).disabled = true;
  $('export-status').textContent = ''; $('name').focus(); $('workbench').scrollIntoView({ block: 'start' }); toast('New draft started. Saved shelf kept; the previous unsaved draft and preview were cleared.');
});

function clearPhoto(announce = true) {
  photoToken += 1; if (photoUrl) URL.revokeObjectURL(photoUrl); photoUrl = null; $('preview-image').removeAttribute('src'); $('photo-preview').hidden = true; $('photo').value = ''; $('photo-name').textContent = '';
  $('photo-status').textContent = announce ? 'Local preview removed. No photo was stored or uploaded.' : '';
}
$('remove-photo').addEventListener('click', () => clearPhoto());
$('photo').addEventListener('change', async () => {
  const file = $('photo').files?.[0]; if (!file) return;
  clearPhoto(false); const token = photoToken; $('confirmed').checked = false; $('baseline-confirmed').checked = false; markDirty('photo');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024 || file.size === 0) { $('photo-status').textContent = 'Preview not loaded. Choose a nonempty JPEG, PNG or WebP up to 8 MB. SVG and other formats are not accepted.'; return; }
  $('photo-status').textContent = 'Decoding a local preview only…'; const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    if (token !== photoToken) { URL.revokeObjectURL(url); return; }
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 30000000) throw new Error('Image dimensions not supported');
    photoUrl = url; $('preview-image').src = url; $('photo-name').textContent = file.name.slice(0, 120); $('photo-preview').hidden = false;
    $('photo-status').textContent = 'Local preview ready. It has NOT been analysed. Confirm the category yourself; the photo will not be saved.';
  } catch { URL.revokeObjectURL(url); if (token === photoToken) $('photo-status').textContent = 'This image could not be decoded or is too large in pixels. Try a smaller valid JPEG, PNG or WebP; no classification occurred.'; }
});
function download(kind) {
  if (!active || dirty) return;
  try {
    const content = kind === 'html' ? buildReport(active) : buildPoster(active);
    const url = URL.createObjectURL(new Blob([content], { type: kind === 'html' ? 'text/html;charset=utf-8' : 'image/svg+xml;charset=utf-8' }));
    const anchor = node('a'); anchor.href = url; anchor.download = filenameFor(active.name, kind); document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    $('export-status').textContent = (kind === 'html' ? 'HTML report' : 'SVG poster') + ' generated locally. Your browser handles the download. No photo or network request is included.';
  } catch (error) { $('export-status').textContent = 'Export failed: ' + error.message; }
}
$('export-report').addEventListener('click', () => download('html'));
$('export-poster').addEventListener('click', () => download('svg'));
window.addEventListener('pagehide', () => { if (photoUrl) URL.revokeObjectURL(photoUrl); });
renderShelf();
updateBaselineSelection();
document.body.dataset.ready = 'true';
if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(() => navigator.serviceWorker.ready).then(() => { $('offline-status').textContent = 'Offline-ready'; document.body.dataset.offlineReady = 'true'; }).catch(() => { $('offline-status').textContent = 'Local-first · cache unavailable'; });
}
