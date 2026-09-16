import { TIME_SLOTS } from '../data/content.js';
import { loadData, updateData } from './storage.js';

export function getCurrentHour(date = new Date()) {
  return date.getHours();
}

export function getTimeSlotByHour(hour) {
  return (
    TIME_SLOTS.find((slot) => slot.hours.includes(hour)) ??
    TIME_SLOTS.find((slot) => slot.id === 'night')
  );
}

export function getActiveTimeSlot(date = new Date()) {
  const data = loadData();
  if (data.preferences.backgroundOverride) {
    return (
      TIME_SLOTS.find((slot) => slot.id === data.preferences.backgroundOverride) ??
      getTimeSlotByHour(getCurrentHour(date))
    );
  }
  return getTimeSlotByHour(getCurrentHour(date));
}

export function setBackgroundOverride(slotId) {
  updateData((data) => ({
    ...data,
    preferences: {
      ...data.preferences,
      backgroundOverride: slotId,
    },
  }));
}

export function clearBackgroundOverride() {
  updateData((data) => ({
    ...data,
    preferences: {
      ...data.preferences,
      backgroundOverride: null,
    },
  }));
}

export function getBackgroundImageUrl(slot) {
  return slot.localImage || slot.image;
}

function setBackgroundImage(bgEl, slot) {
  const localUrl = slot.localImage;
  const remoteUrl = slot.image;

  if (!localUrl) {
    bgEl.style.backgroundImage = `url("${remoteUrl}")`;
    return;
  }

  const img = new Image();
  img.onload = () => {
    bgEl.style.backgroundImage = `url("${localUrl}")`;
  };
  img.onerror = () => {
    bgEl.style.backgroundImage = `url("${remoteUrl}")`;
  };
  img.src = localUrl;
}

export function applyBackground(slot, reduceMotion = false) {
  const bgEl = document.getElementById('background');
  if (!bgEl) return;

  setBackgroundImage(bgEl, slot);
  bgEl.classList.toggle('background--animate', !reduceMotion);
  bgEl.dataset.slot = slot.id;
}

export function updateTimeSlotUI(slot, isManualOverride) {
  const greetingEl = document.getElementById('greeting');
  const autoBtn = document.getElementById('auto-background-btn');

  if (greetingEl) greetingEl.textContent = slot.greeting;
  if (autoBtn) autoBtn.hidden = !isManualOverride;

  document.querySelectorAll('[data-home-theme]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.homeTheme === slot.id ? 'true' : 'false');
  });
}
