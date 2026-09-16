import { MUSIC_THEMES } from '../data/content.js';
import { loadData, updateData } from './storage.js';
import { getTimerState } from './timer.js';

let selectedThemeId = null;
let isPlaying = false;

function getIframe() {
  return document.getElementById('music-iframe');
}

function getTheme(themeId) {
  return MUSIC_THEMES.find((t) => t.id === themeId) ?? null;
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function buildEmbedUrl(youtubeId) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&controls=0`;
}

function updatePreference(key, value) {
  updateData((data) => ({
    ...data,
    preferences: { ...data.preferences, [key]: value },
  }));
}

function isTimerActive() {
  const state = getTimerState();
  return state === 'running' || state === 'paused';
}

function formatDescription(text) {
  return text.replace(/\n/g, '<br />');
}

function renderPlaylistCards() {
  const container = document.getElementById('playlist-list');
  if (!container) return;

  container.innerHTML = MUSIC_THEMES.map((theme) => {
    const isSelected = theme.id === selectedThemeId;
    return `
      <article class="content-card playlist-card ${isSelected ? 'playlist-card--selected' : ''}" data-playlist-id="${theme.id}">
        <div class="content-card__thumb-wrap">
          <img
            class="content-card__thumb"
            src="${getThumbnailUrl(theme.youtubeId)}"
            alt=""
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <button
            type="button"
            class="content-card__play playlist-card__select"
            data-playlist-select="${theme.id}"
            aria-pressed="${isSelected ? 'true' : 'false'}"
            aria-label="${theme.title} 플레이리스트 ${isSelected ? '선택됨' : '선택'}"
          >
            ${isSelected ? '선택됨' : '선택'}
          </button>
        </div>
        <div class="content-card__body">
          <span class="content-card__type">${theme.type} · ${theme.label} 테마</span>
          <h3 class="content-card__title">${theme.title}</h3>
          <p class="content-card__meta playlist-card__desc">${formatDescription(theme.description)}</p>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('[data-playlist-select]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isTimerActive()) return;
      selectPlaylist(btn.dataset.playlistSelect);
    });
  });

  container.querySelectorAll('.playlist-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (isTimerActive()) return;
      selectPlaylist(card.dataset.playlistId);
    });
  });
}

function selectPlaylist(themeId) {
  if (selectedThemeId === themeId) {
    selectedThemeId = null;
    updatePreference('musicTheme', null);
    stopMusic();
    updateStatus('플레이리스트 선택이 해제되었습니다.');
  } else {
    selectedThemeId = themeId;
    updatePreference('musicTheme', themeId);
    const theme = getTheme(themeId);
    updateStatus(`${theme.label} 테마가 선택되었습니다. 명상 시작 시 재생됩니다.`);
  }

  renderPlaylistCards();
}

function updateStatus(message) {
  const status = document.getElementById('music-status');
  if (status) status.textContent = message;
}

export function initMusic() {
  const data = loadData();
  selectedThemeId = data.preferences.musicTheme ?? null;
  renderPlaylistCards();

  if (selectedThemeId) {
    const theme = getTheme(selectedThemeId);
    if (theme) updateStatus(`${theme.label} 테마가 선택되었습니다.`);
  }
}

export function isMusicEnabled() {
  return Boolean(selectedThemeId);
}

export function getSelectedThemeId() {
  return selectedThemeId;
}

export function playMusic() {
  if (!selectedThemeId) return;

  const iframe = getIframe();
  const wrap = document.getElementById('music-player-wrap');
  const theme = getTheme(selectedThemeId);
  if (!iframe || !theme) return;

  iframe.src = buildEmbedUrl(theme.youtubeId);
  if (wrap) wrap.hidden = false;
  isPlaying = true;
  updateStatus(`${theme.label} 테마 음악 재생 중`);
}

export function pauseMusic() {
  const iframe = getIframe();
  if (iframe) iframe.src = '';
  isPlaying = false;

  if (selectedThemeId) {
    const theme = getTheme(selectedThemeId);
    updateStatus(`${theme?.label ?? ''} 테마 — 일시정지됨`);
  }
}

export function stopMusic() {
  const iframe = getIframe();
  const wrap = document.getElementById('music-player-wrap');
  if (iframe) iframe.src = '';
  if (wrap) wrap.hidden = true;
  isPlaying = false;
}

export function syncMusicWithTimer(state) {
  const isActive = state === 'running' || state === 'paused';

  document.querySelectorAll('[data-playlist-select], .playlist-card').forEach((el) => {
    el.style.pointerEvents = isActive ? 'none' : '';
    el.style.opacity = isActive ? '0.65' : '';
  });

  if (!selectedThemeId) return;

  if (state === 'running') {
    if (!isPlaying) playMusic();
  } else if (state === 'paused') {
    pauseMusic();
  } else if (state === 'idle' || state === 'completed') {
    stopMusic();
    const theme = getTheme(selectedThemeId);
    if (theme) updateStatus(`${theme.label} 테마가 선택되었습니다.`);
  }
}
