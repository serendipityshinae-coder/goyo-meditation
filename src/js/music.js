import { TIME_SLOTS, MEDITATION_PLAYLISTS, getPlaylistsByDuration } from '../data/content.js';
import { loadData, updateData } from './storage.js';
import { getTimerState, startTimer, setDuration } from './timer.js';

let selectedPlaylistId = null;
let currentDuration = 10;
let isPlaying = false;
let homePlayingSlotId = null;

function getIframe() {
  return document.getElementById('music-iframe');
}

function getPlaylist(playlistId) {
  return MEDITATION_PLAYLISTS.find((p) => p.id === playlistId) ?? null;
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function buildEmbedUrl(youtubeId) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1`;
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

function loadIframe(youtubeId) {
  const iframe = getIframe();
  const wrap = document.getElementById('music-player-wrap');
  if (!iframe) return;
  iframe.src = buildEmbedUrl(youtubeId);
  if (wrap) wrap.hidden = false;
  isPlaying = true;
}

function clearIframe() {
  const iframe = getIframe();
  const wrap = document.getElementById('music-player-wrap');
  if (iframe) iframe.src = '';
  if (wrap) wrap.hidden = true;
  isPlaying = false;
}

function updateStatus(message) {
  const status = document.getElementById('music-status');
  if (status) status.textContent = message;
}

function updateHomeStatus(message) {
  const el = document.getElementById('home-audio-status');
  if (el) el.textContent = message;
}

function markHomeCardPlaying(slotId) {
  document.querySelectorAll('[data-home-theme]').forEach((btn) => {
    btn.classList.toggle('home-theme-card--playing', btn.dataset.homeTheme === slotId);
  });
  homePlayingSlotId = slotId;
}

export function playHomeAmbient(slotId) {
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  if (!slot?.ambientYoutubeId) return;

  clearIframe();
  loadIframe(slot.ambientYoutubeId);
  markHomeCardPlaying(slotId);
  updateHomeStatus(`♪ ${slot.label} 테마 음악 재생 중`);
}

export function stopHomeAmbient() {
  if (!homePlayingSlotId) return;
  clearIframe();
  markHomeCardPlaying(null);
  homePlayingSlotId = null;
  updateHomeStatus('');
}

function renderPlaylistCards(duration = currentDuration) {
  const container = document.getElementById('playlist-list');
  if (!container) return;

  currentDuration = duration;
  const playlists = getPlaylistsByDuration(duration);

  container.innerHTML = playlists
    .map((playlist) => {
      const isSelected = playlist.id === selectedPlaylistId;
      return `
        <article class="content-card playlist-card ${isSelected ? 'playlist-card--selected' : ''}" data-playlist-id="${playlist.id}">
          <div class="content-card__thumb-wrap">
            <img
              class="content-card__thumb"
              src="${getThumbnailUrl(playlist.youtubeId)}"
              alt=""
              loading="lazy"
              referrerpolicy="no-referrer"
            />
            <button
              type="button"
              class="content-card__play playlist-card__select"
              data-playlist-select="${playlist.id}"
              aria-label="${playlist.title} 시작"
            >
              시작
            </button>
          </div>
          <div class="content-card__body">
            <span class="content-card__type">${playlist.type} · ${playlist.duration}분</span>
            <h3 class="content-card__title">${playlist.title}</h3>
            <p class="content-card__meta playlist-card__desc">${formatDescription(playlist.description)}</p>
          </div>
        </article>
      `;
    })
    .join('');

  container.querySelectorAll('[data-playlist-select]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMeditationWithPlaylist(btn.dataset.playlistSelect);
    });
  });

  container.querySelectorAll('.playlist-card').forEach((card) => {
    card.addEventListener('click', () => {
      startMeditationWithPlaylist(card.dataset.playlistId);
    });
  });
}

export function startMeditationWithPlaylist(playlistId) {
  if (isTimerActive()) return;

  const playlist = getPlaylist(playlistId);
  if (!playlist) return;

  stopHomeAmbient();
  selectedPlaylistId = playlistId;
  updatePreference('lastPlaylistId', playlistId);

  setDuration(playlist.duration);
  renderPlaylistCards(playlist.duration);

  startTimer();
  loadIframe(playlist.youtubeId);
  updateStatus(`♪ ${playlist.title} — 타이머와 함께 재생 중`);
}

export function initMusic(initialDuration = 10) {
  currentDuration = initialDuration;
  renderPlaylistCards(initialDuration);
}

export function renderPlaylistsForDuration(minutes) {
  if (isTimerActive()) return;
  selectedPlaylistId = null;
  renderPlaylistCards(minutes);
  updateStatus(`${minutes}분 플레이리스트 — 원하는 항목을 선택하세요`);
}

export function isMusicEnabled() {
  return Boolean(selectedPlaylistId) || Boolean(homePlayingSlotId);
}

export function playMusic() {
  if (!selectedPlaylistId) return;
  const playlist = getPlaylist(selectedPlaylistId);
  if (!playlist) return;
  loadIframe(playlist.youtubeId);
  updateStatus(`♪ ${playlist.title} 재생 중`);
}

export function pauseMusic() {
  clearIframe();
  if (selectedPlaylistId) {
    const playlist = getPlaylist(selectedPlaylistId);
    updateStatus(`${playlist?.title ?? ''} — 일시정지됨`);
  }
}

export function stopMusic() {
  clearIframe();
  if (selectedPlaylistId && !isTimerActive()) {
    const playlist = getPlaylist(selectedPlaylistId);
    updateStatus(`${playlist?.title ?? ''} — 선택됨 (다시 시작하려면 플레이리스트를 누르세요)`);
  }
}

export function syncMusicWithTimer(state) {
  const isActive = state === 'running' || state === 'paused';

  document.querySelectorAll('[data-playlist-select], .playlist-card, [data-duration]').forEach((el) => {
    el.style.pointerEvents = isActive ? 'none' : '';
    el.style.opacity = isActive ? '0.65' : '';
  });

  if (!selectedPlaylistId) return;

  if (state === 'running') {
    if (!isPlaying) playMusic();
  } else if (state === 'paused') {
    pauseMusic();
  } else if (state === 'idle' || state === 'completed') {
    selectedPlaylistId = null;
    clearIframe();
    renderPlaylistCards(currentDuration);
    updateStatus(`${currentDuration}분 플레이리스트 — 원하는 항목을 선택하세요`);
  }
}
