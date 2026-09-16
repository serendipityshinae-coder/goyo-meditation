import { CHALLENGE_MESSAGES } from '../data/content.js';
import { formatDateKey, getRecordForDate } from './records.js';

export function getLast7Days(date = new Date()) {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(date);
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function getChallengeProgress(date = new Date()) {
  const days = getLast7Days(date);
  const completedDays = days.filter((key) => {
    const record = getRecordForDate(key);
    return record && record.totalMinutes >= 1;
  });

  const todayKey = formatDateKey(date);
  const todayDone = completedDays.includes(todayKey);
  const completedCount = completedDays.length;

  return {
    days,
    completedDays,
    completedCount,
    todayDone,
    isComplete: completedCount >= 7,
  };
}

export function getChallengeMessage(progress) {
  if (progress.isComplete) return CHALLENGE_MESSAGES.complete;
  if (progress.todayDone && progress.completedCount >= 3) return CHALLENGE_MESSAGES.streak3;
  if (progress.todayDone) return CHALLENGE_MESSAGES.todayDone;
  if (progress.completedCount === 0) return CHALLENGE_MESSAGES.empty;
  if (!progress.todayDone && progress.completedCount > 0) return CHALLENGE_MESSAGES.missed;
  return CHALLENGE_MESSAGES.empty;
}

export function formatMinutes(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}분`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}
