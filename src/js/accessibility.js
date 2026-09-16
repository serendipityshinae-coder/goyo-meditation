import { loadData, updateData } from './storage.js';
import { applyBackground, getActiveTimeSlot } from './timeSlot.js';

export function initAccessibility(onSettingsChange) {
  const toggle = document.getElementById('reduce-motion-toggle');
  const data = loadData();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceMotion = data.preferences.reduceMotion || prefersReduced;

  if (toggle) {
    toggle.checked = reduceMotion;
    toggle.addEventListener('change', () => {
      updateData((d) => ({
        ...d,
        preferences: { ...d.preferences, reduceMotion: toggle.checked },
      }));
      document.documentElement.classList.toggle('reduce-motion', toggle.checked);
      applyBackground(getActiveTimeSlot(), toggle.checked);
      onSettingsChange?.({ reduceMotion: toggle.checked });
    });
  }

  document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  return { reduceMotion };
}

export function isReduceMotionEnabled() {
  const data = loadData();
  return (
    data.preferences.reduceMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
