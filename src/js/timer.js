import { BREATHING_PHRASES } from '../data/content.js';
import { loadData, updateData, isStorageAvailable } from './storage.js';
import { addMeditationRecord, saveLastDuration } from './records.js';

const STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

let state = STATES.IDLE;
let durationMinutes = 10;
let tickInterval = null;
let breathInterval = null;
let breathIndex = 0;
let onCompleteCallback = null;
let onTickCallback = null;
let onStateChangeCallback = null;

function clearIntervals() {
  if (tickInterval) clearInterval(tickInterval);
  if (breathInterval) clearInterval(breathInterval);
  tickInterval = null;
  breathInterval = null;
}

function getActiveTimer() {
  return loadData().activeTimer;
}

function persistActiveTimer(timer) {
  if (!isStorageAvailable()) return;
  updateData((data) => ({ ...data, activeTimer: timer }));
}

function clearActiveTimer() {
  if (!isStorageAvailable()) return;
  updateData((data) => ({ ...data, activeTimer: null }));
}

function computeRemainingMs(timer, now = Date.now()) {
  if (!timer) return 0;
  const totalMs = timer.durationMinutes * 60 * 1000;
  let elapsed = now - timer.startedAt - (timer.elapsedWhilePaused ?? 0);
  if (timer.pausedAt) {
    elapsed -= now - timer.pausedAt;
  }
  return Math.max(0, totalMs - elapsed);
}

function computeElapsedMinutes(timer, now = Date.now()) {
  if (!timer) return 0;
  const totalMs = timer.durationMinutes * 60 * 1000;
  const remaining = computeRemainingMs(timer, now);
  const elapsedMs = totalMs - remaining;
  return Math.floor(elapsedMs / 60000);
}

export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateBreathPhrase() {
  const el = document.getElementById('breath-guide');
  if (el) el.textContent = BREATHING_PHRASES[breathIndex];
  breathIndex = (breathIndex + 1) % BREATHING_PHRASES.length;
}

function syncUI(remainingMs) {
  const display = document.getElementById('timer-display');
  const circle = document.getElementById('breath-circle');
  if (display) {
    display.textContent = formatTime(Math.ceil(remainingMs / 1000));
  }
  if (circle) {
    circle.classList.toggle('breath-circle--active', state === STATES.RUNNING);
  }
  onTickCallback?.(remainingMs, state);
}

function setControls() {
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const restartBtn = document.getElementById('timer-restart');
  const completeBtn = document.getElementById('timer-complete-early');
  const durationBtns = document.querySelectorAll('[data-duration]');

  const isActive = state === STATES.RUNNING || state === STATES.PAUSED;

  if (startBtn) startBtn.hidden = isActive;
  if (pauseBtn) {
    pauseBtn.hidden = !isActive;
    pauseBtn.textContent = state === STATES.PAUSED ? '이어서 진행' : '일시정지';
  }
  if (restartBtn) restartBtn.hidden = state === STATES.IDLE;
  if (completeBtn) completeBtn.hidden = state === STATES.IDLE || state === STATES.COMPLETED;

  durationBtns.forEach((btn) => {
    btn.disabled = isActive;
  });
}

function handleComplete(wasAuto = true) {
  clearIntervals();
  const timer = getActiveTimer();
  const minutes = wasAuto
    ? (timer?.durationMinutes ?? durationMinutes)
    : Math.max(computeElapsedMinutes(timer), 1);

  clearActiveTimer();
  state = STATES.COMPLETED;

  if (wasAuto) {
    addMeditationRecord(minutes);
    showCompletionFeedback(minutes);
  }

  syncUI(0);
  setControls();
  notifyStateChange();
  onCompleteCallback?.(minutes, wasAuto);
}

function tick() {
  const timer = getActiveTimer();
  if (!timer || timer.pausedAt) return;

  const remaining = computeRemainingMs(timer);
  syncUI(remaining);

  if (remaining <= 0) {
    handleComplete(true);
  }
}

function startBreathCycle() {
  updateBreathPhrase();
  breathInterval = setInterval(updateBreathPhrase, 8000);
}

function notifyStateChange() {
  onStateChangeCallback?.(state);
}

export function initTimer({ onComplete, onTick, onStateChange } = {}) {
  onCompleteCallback = onComplete;
  onTickCallback = onTick;
  onStateChangeCallback = onStateChange;

  const saved = getActiveTimer();
  if (saved) {
    durationMinutes = saved.durationMinutes;
    const remaining = computeRemainingMs(saved);
    if (remaining <= 0) {
      handleComplete(true);
    } else if (saved.pausedAt) {
      state = STATES.PAUSED;
      syncUI(remaining);
      setControls();
    } else {
      state = STATES.RUNNING;
      syncUI(remaining);
      setControls();
      tickInterval = setInterval(tick, 1000);
      startBreathCycle();
    }
  } else {
    syncUI(durationMinutes * 60 * 1000);
    setControls();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state === STATES.RUNNING) {
      tick();
    }
  });

  notifyStateChange();
}

export function getSelectedDuration() {
  return durationMinutes;
}

export function setDuration(minutes) {
  if (state !== STATES.IDLE) return;
  durationMinutes = minutes;
  saveLastDuration(minutes);
  syncUI(minutes * 60 * 1000);
  document.querySelectorAll('[data-duration]').forEach((btn) => {
    btn.setAttribute('aria-pressed', Number(btn.dataset.duration) === minutes ? 'true' : 'false');
  });
}

export function startTimer() {
  if (state === STATES.RUNNING) return;

  if (state === STATES.PAUSED) {
    const timer = getActiveTimer();
    if (!timer) return;
    const pauseDuration = Date.now() - timer.pausedAt;
    const updated = {
      ...timer,
      pausedAt: null,
      elapsedWhilePaused: (timer.elapsedWhilePaused ?? 0) + pauseDuration,
    };
    persistActiveTimer(updated);
    state = STATES.RUNNING;
    tickInterval = setInterval(tick, 1000);
    startBreathCycle();
    setControls();
    notifyStateChange();
    return;
  }

  state = STATES.RUNNING;
  breathIndex = 0;
  const timer = {
    startedAt: Date.now(),
    durationMinutes,
    pausedAt: null,
    elapsedWhilePaused: 0,
  };
  persistActiveTimer(timer);
  tickInterval = setInterval(tick, 1000);
  startBreathCycle();
  setControls();
  notifyStateChange();
  tick();
}

export function pauseTimer() {
  if (state === STATES.RUNNING) {
    clearIntervals();
    const timer = getActiveTimer();
    if (timer) {
      persistActiveTimer({ ...timer, pausedAt: Date.now() });
    }
    state = STATES.PAUSED;
    const circle = document.getElementById('breath-circle');
    if (circle) circle.classList.remove('breath-circle--active');
    setControls();
    notifyStateChange();
    return;
  }

  if (state === STATES.PAUSED) {
    startTimer();
  }
}

export function restartTimer() {
  clearIntervals();
  clearActiveTimer();
  state = STATES.IDLE;
  breathIndex = 0;
  syncUI(durationMinutes * 60 * 1000);
  setControls();
  const el = document.getElementById('breath-guide');
  if (el) el.textContent = BREATHING_PHRASES[0];
  notifyStateChange();
}

export function completeEarly() {
  const timer = getActiveTimer();
  const elapsedMinutes = computeElapsedMinutes(timer);

  clearIntervals();
  clearActiveTimer();
  state = STATES.IDLE;

  if (elapsedMinutes >= 1) {
    addMeditationRecord(elapsedMinutes);
    showCompletionFeedback(elapsedMinutes);
    onCompleteCallback?.(elapsedMinutes, false);
  } else {
    showToast('1분 이상 명상해야 기록됩니다.');
  }

  restartTimer();
}

export function showCompletionFeedback(minutes) {
  const overlay = document.getElementById('completion-overlay');
  const message = document.getElementById('completion-message');
  if (message) message.textContent = `${minutes}분의 고요를 기록했어요.`;
  if (overlay) {
    overlay.hidden = false;
    overlay.classList.add('completion-overlay--visible');
  }

  playCompletionSound();
}

export function hideCompletionOverlay() {
  const overlay = document.getElementById('completion-overlay');
  if (overlay) {
    overlay.classList.remove('completion-overlay--visible');
    overlay.hidden = true;
  }
  state = STATES.IDLE;
  restartTimer();
  notifyStateChange();
}

function playCompletionSound() {
  const btn = document.getElementById('play-completion-sound');
  if (btn) btn.hidden = false;
}

export function triggerCompletionSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 528;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
    document.getElementById('play-completion-sound').hidden = true;
  } catch {
    /* audio not available */
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

export function getTimerState() {
  return state;
}
