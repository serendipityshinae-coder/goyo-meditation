import { DURATION_OPTIONS } from '../data/content.js';
import { updateData, loadData } from './storage.js';

export function formatDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addMeditationRecord(minutes, date = new Date()) {
  if (minutes < 1) return null;

  const dateKey = formatDateKey(date);
  return updateData((data) => {
    const existing = data.records[dateKey] ?? { totalMinutes: 0, sessionCount: 0 };
    return {
      ...data,
      records: {
        ...data.records,
        [dateKey]: {
          totalMinutes: existing.totalMinutes + minutes,
          sessionCount: existing.sessionCount + 1,
        },
      },
    };
  });
}

export function getRecordForDate(dateKey) {
  const data = loadData();
  return data.records[dateKey] ?? null;
}

export function getTodayRecord() {
  return getRecordForDate(formatDateKey());
}

export function getMonthRecords(year, month) {
  const data = loadData();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return Object.entries(data.records).filter(([key]) => key.startsWith(prefix));
}

export function getMonthStats(year, month) {
  const entries = getMonthRecords(year, month);
  let totalMinutes = 0;
  let dayCount = 0;

  entries.forEach(([, record]) => {
    totalMinutes += record.totalMinutes;
    if (record.totalMinutes >= 1) dayCount += 1;
  });

  return { totalMinutes, dayCount };
}

export function saveLastDuration(minutes) {
  updateData((data) => ({
    ...data,
    preferences: {
      ...data.preferences,
      lastDuration: minutes,
    },
  }));
}

export function getLastDuration() {
  const saved = loadData().preferences.lastDuration ?? 10;
  return DURATION_OPTIONS.includes(saved) ? saved : 10;
}
