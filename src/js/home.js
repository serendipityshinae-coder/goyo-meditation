import { TIME_SLOTS } from '../data/content.js';
import { setBackgroundOverride, applyBackground, getActiveTimeSlot } from './timeSlot.js';
import { isReduceMotionEnabled } from './accessibility.js';
import { loadData } from './storage.js';

function getImageUrl(slot) {
  return slot.localImage || slot.image;
}

export function initHome(onThemeSelect) {
  renderThemeCards(onThemeSelect);
  updateHomePreview(getActiveTimeSlot().id);
}

function renderThemeCards(onThemeSelect) {
  const grid = document.getElementById('home-theme-grid');
  if (!grid) return;

  grid.innerHTML = TIME_SLOTS.map(
    (slot) => `
      <button type="button" class="home-theme-card" data-home-theme="${slot.id}" aria-pressed="false">
        <img
          class="home-theme-card__img"
          src="${getImageUrl(slot)}"
          alt=""
          loading="lazy"
          onerror="this.src='${slot.image}'"
        />
        <span class="home-theme-card__overlay">
          <span class="home-theme-card__label">${slot.label}</span>
          <span class="home-theme-card__desc">${slot.description.replace(/\n/g, '<br />')}</span>
        </span>
      </button>
    `
  ).join('');

  const data = loadData();
  const activeId = data.preferences.backgroundOverride ?? getActiveTimeSlot().id;

  grid.querySelectorAll('[data-home-theme]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.homeTheme === activeId ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const slotId = btn.dataset.homeTheme;
      setBackgroundOverride(slotId);
      applyBackground(
        TIME_SLOTS.find((s) => s.id === slotId),
        isReduceMotionEnabled()
      );
      updateHomePreview(slotId);
      grid.querySelectorAll('[data-home-theme]').forEach((b) => {
        b.setAttribute('aria-pressed', b.dataset.homeTheme === slotId ? 'true' : 'false');
      });
      onThemeSelect?.(slotId);
    });
  });

  updateHomePreview(activeId);
}

export function updateHomePreview(slotId) {
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  if (!slot) return;

  const preview = document.getElementById('home-preview');
  const greeting = document.getElementById('home-greeting');
  const label = document.getElementById('home-preview-label');

  if (preview) {
    preview.style.backgroundImage = `url("${getImageUrl(slot)}")`;
  }
  if (greeting) greeting.textContent = slot.greeting;
  if (label) label.textContent = slot.label;
}
