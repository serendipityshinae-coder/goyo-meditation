import { STORAGE_KEY } from '../data/content.js';

const DEFAULT_DATA = {
  records: {},
  preferences: {
    lastDuration: 10,
    backgroundOverride: null,
    reduceMotion: false,
    musicTheme: null,
  },
  activeTimer: null,
};

let storageAvailable = true;

export function checkStorageAvailable() {
  try {
    const testKey = '__goyo_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

export function isStorageAvailable() {
  return storageAvailable;
}

export function loadData() {
  if (!storageAvailable) return structuredClone(DEFAULT_DATA);

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_DATA),
      ...parsed,
      preferences: {
        ...DEFAULT_DATA.preferences,
        ...parsed.preferences,
      },
      records: parsed.records ?? {},
    };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  if (!storageAvailable) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}

export function updateData(updater) {
  const data = loadData();
  const next = typeof updater === 'function' ? updater(data) : { ...data, ...updater };
  saveData(next);
  return next;
}
