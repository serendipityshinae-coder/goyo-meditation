import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/components.css';
import './styles/animations.css';

import { TIME_SLOTS, STORAGE_NOTICE } from './data/content.js';
import { checkStorageAvailable, isStorageAvailable, loadData } from './js/storage.js';
import {
  getActiveTimeSlot,
  applyBackground,
  updateTimeSlotUI,
  clearBackgroundOverride,
} from './js/timeSlot.js';
import {
  initTimer,
  setDuration,
  startTimer,
  pauseTimer,
  restartTimer,
  completeEarly,
  hideCompletionOverlay,
  triggerCompletionSound,
  showCompletionFeedback,
} from './js/timer.js';
import {
  getLastDuration,
  getRecordForDate,
  formatDateKey,
  getMonthStats,
} from './js/records.js';
import { getChallengeProgress, getChallengeMessage, formatMinutes } from './js/challenge.js';
import { renderCalendar } from './js/calendar.js';
import { initYouTube } from './js/youtube.js';
import { initAccessibility, isReduceMotionEnabled } from './js/accessibility.js';
import { initNavigation } from './js/navigation.js';
import { initHome, updateHomePreview } from './js/home.js';
import { initMusic, syncMusicWithTimer } from './js/music.js';

let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();

function refreshRecordsUI() {
  const now = new Date();
  const stats = getMonthStats(calendarYear, calendarMonth);
  const progress = getChallengeProgress(now);
  const todayRecord = getRecordForDate(formatDateKey(now));

  const monthTotal = document.getElementById('month-total');
  const monthDays = document.getElementById('month-days');
  const challengeCount = document.getElementById('challenge-count');
  const challengeMessage = document.getElementById('challenge-message');
  const todayStatus = document.getElementById('today-status');
  const challengeDots = document.getElementById('challenge-dots');

  if (monthTotal) monthTotal.textContent = formatMinutes(stats.totalMinutes);
  if (monthDays) monthDays.textContent = `${stats.dayCount}일`;
  if (challengeCount) challengeCount.textContent = `${progress.completedCount} / 7`;
  if (challengeMessage) challengeMessage.textContent = getChallengeMessage(progress);
  if (todayStatus) {
    todayStatus.textContent = todayRecord && todayRecord.totalMinutes >= 1
      ? `오늘 ${formatMinutes(todayRecord.totalMinutes)} 명상했어요.`
      : '오늘 아직 기록이 없어요.';
  }

  if (challengeDots) {
    challengeDots.innerHTML = progress.days
      .map((dayKey) => {
        const done = progress.completedDays.includes(dayKey);
        const isToday = dayKey === formatDateKey(now);
        return `<span class="challenge-dot ${done ? 'challenge-dot--done' : ''} ${isToday ? 'challenge-dot--today' : ''}" aria-label="${dayKey}${done ? ' 완료' : ''}"></span>`;
      })
      .join('');
  }

  renderCalendar(document.getElementById('calendar'), calendarYear, calendarMonth, handleCalendarAction);
}

function handleCalendarAction(dateKey, payload) {
  if (dateKey === 'nav') {
    calendarMonth += payload.direction;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear += 1;
    } else if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear -= 1;
    }
    refreshRecordsUI();
    return;
  }

  const detail = document.getElementById('calendar-detail');
  if (!detail) return;

  if (payload && payload.totalMinutes >= 1) {
    const [y, m, d] = dateKey.split('-');
    detail.textContent = `${y}년 ${Number(m)}월 ${Number(d)}일 — ${formatMinutes(payload.totalMinutes)} 명상`;
  } else {
    const [y, m, d] = dateKey.split('-');
    detail.textContent = `${y}년 ${Number(m)}월 ${Number(d)}일 — 기록 없음`;
  }
}

function refreshBackgroundUI() {
  const data = loadData();
  const slot = getActiveTimeSlot();
  const isManual = Boolean(data.preferences.backgroundOverride);
  applyBackground(slot, isReduceMotionEnabled());
  updateTimeSlotUI(slot, isManual);

  const greeting = document.getElementById('greeting');
  if (greeting) greeting.textContent = slot.greeting;

  if (data.preferences.backgroundOverride) {
    updateHomePreview(data.preferences.backgroundOverride);
  }
}

function showStorageWarning() {
  const banner = document.getElementById('storage-warning');
  if (banner) banner.hidden = isStorageAvailable();
}

function bindEvents() {
  document.querySelectorAll('[data-duration]').forEach((btn) => {
    btn.addEventListener('click', () => setDuration(Number(btn.dataset.duration)));
  });

  document.getElementById('timer-start')?.addEventListener('click', startTimer);
  document.getElementById('timer-pause')?.addEventListener('click', pauseTimer);
  document.getElementById('timer-restart')?.addEventListener('click', restartTimer);
  document.getElementById('timer-complete-early')?.addEventListener('click', completeEarly);

  document.getElementById('completion-close')?.addEventListener('click', () => {
    hideCompletionOverlay();
    refreshRecordsUI();
  });
  document.getElementById('play-completion-sound')?.addEventListener('click', triggerCompletionSound);

  document.getElementById('auto-background-btn')?.addEventListener('click', () => {
    clearBackgroundOverride();
    refreshBackgroundUI();
    updateHomePreview(getActiveTimeSlot().id);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && event.target.id === 'timer-pause' && !event.target.hidden) {
      event.preventDefault();
      pauseTimer();
    }
  });

  TIME_SLOTS.forEach((slot) => {
    const img = new Image();
    img.src = slot.localImage || slot.image;
  });
}

function init() {
  checkStorageAvailable();
  showStorageWarning();

  const notice = document.getElementById('storage-notice');
  if (notice) notice.textContent = STORAGE_NOTICE;

  const lastDuration = getLastDuration();
  setDuration(lastDuration);
  document.querySelectorAll('[data-duration]').forEach((btn) => {
    btn.setAttribute('aria-pressed', Number(btn.dataset.duration) === lastDuration ? 'true' : 'false');
  });

  initAccessibility(() => refreshBackgroundUI());
  initNavigation();
  initHome(() => refreshBackgroundUI());
  initMusic();
  refreshBackgroundUI();

  initTimer({
    onComplete: () => refreshRecordsUI(),
    onStateChange: (state) => syncMusicWithTimer(state),
  });

  initYouTube((minutes) => {
    showCompletionFeedback(minutes);
    refreshRecordsUI();
  });

  refreshRecordsUI();
  bindEvents();
}

init();
