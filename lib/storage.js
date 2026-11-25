import { LEGACY_MODEL_VERSION, MODEL_VERSION } from './data.js';
import { validateDraft } from './model.js';
export const STORAGE_KEY = 'reloop.shelf.v1';
export const MAX_PLANS = 50;
const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value));

export function isRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
  const legacy = record.modelVersion === LEGACY_MODEL_VERSION;
  const versionValid = legacy ? (record.baseline === undefined || record.baseline === 'illustrative') : record.modelVersion === MODEL_VERSION && typeof record.baseline === 'string' && typeof record.baselineConfirmed === 'boolean';
  return versionValid && typeof record.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(record.id) && validDate(record.createdAt) && validDate(record.updatedAt) && Array.isArray(record.completedSteps) && record.completedSteps.length === 3 && record.completedSteps.every(x => typeof x === 'boolean') && validateDraft(record).ok;
}
export function createRecord(draft, id, now = new Date().toISOString(), existing = null) {
  const validated = validateDraft(draft);
  if (!validated.ok) throw new RangeError('Cannot save an invalid plan.');
  const record = { ...validated.value, id, createdAt: existing?.createdAt ?? now, updatedAt: now, modelVersion: MODEL_VERSION };
  if (!isRecord(record)) throw new RangeError('Invalid record identity or timestamp.');
  return record;
}
export function upsertRecord(entries, record) {
  if (!isRecord(record)) throw new RangeError('Invalid record.');
  const index = entries.findIndex(x => x.id === record.id);
  if (index < 0 && entries.length >= MAX_PLANS) throw new RangeError('Your shelf is full (50 plans). Export or remove a plan before adding another.');
  return index < 0 ? [record, ...entries] : entries.map((entry, i) => i === index ? record : entry);
}
export function loadShelf(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { mode: 'persistent', entries: [], message: 'Saved on this browser only.' };
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || !Array.isArray(parsed.entries) || parsed.entries.length > MAX_PLANS || !parsed.entries.every(isRecord) || new Set(parsed.entries.map(x => x.id)).size !== parsed.entries.length) throw new Error('Unsupported shelf');
    return { mode: 'persistent', entries: parsed.entries, message: 'Saved on this browser only.' };
  } catch (error) {
    const unavailable = error?.name === 'SecurityError' || error?.name === 'QuotaExceededError' || error?.code === 'STORAGE_UNAVAILABLE';
    return { mode: unavailable ? 'unavailable' : 'corrupt', entries: [], message: unavailable ? 'Browser storage unavailable. Plans can stay in this tab, but will not survive a reload.' : 'Saved shelf could not be read. Original data is untouched; saving is blocked until you confirm a reset.' };
  }
}
export function saveShelf(storage, entries) {
  if (!Array.isArray(entries) || entries.length > MAX_PLANS || !entries.every(isRecord) || new Set(entries.map(x => x.id)).size !== entries.length) return { ok: false, mode: 'invalid', message: 'Invalid shelf; nothing was written.' };
  const previous = loadShelf(storage);
  if (previous.mode === 'corrupt') return { ok: false, mode: 'corrupt', message: previous.message };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, entries }));
    return { ok: true, mode: 'persistent', message: 'Plan saved on this browser. Photos are not stored.' };
  } catch {
    return { ok: false, mode: 'unavailable', message: 'Storage failed. Kept in this tab only; download a report before leaving.' };
  }
}
export function clearShelf(storage) {
  try { storage.removeItem(STORAGE_KEY); return { ok: true, mode: 'persistent' }; }
  catch { return { ok: false, mode: 'unavailable' }; }
}
