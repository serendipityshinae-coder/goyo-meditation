import { YOUTUBE_VIDEOS, DURATION_OPTIONS } from '../data/content.js';
import { addMeditationRecord } from './records.js';

let currentVideo = null;

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getFallbackThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

export function renderVideoCards(container, onComplete) {
  if (!container) return;

  container.innerHTML = '';

  YOUTUBE_VIDEOS.forEach((video) => {
    const card = document.createElement('article');
    card.className = 'content-card';
    card.innerHTML = `
      <div class="content-card__thumb-wrap">
        <img
          class="content-card__thumb"
          src="${getThumbnailUrl(video.id)}"
          alt=""
          loading="eager"
          referrerpolicy="no-referrer"
          onerror="this.src='${getFallbackThumbnailUrl(video.id)}'"
        />
        <button type="button" class="content-card__play" data-video-id="${video.id}" aria-label="${video.title} 재생">
          재생
        </button>
      </div>
      <div class="content-card__body">
        <span class="content-card__type">${video.type}</span>
        <h3 class="content-card__title">${video.title}</h3>
        <p class="content-card__meta">${video.duration} · ${video.channel}${video.language ? ` · ${video.language}` : ''}</p>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('[data-video-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const video = YOUTUBE_VIDEOS.find((v) => v.id === btn.dataset.videoId);
      if (video) openVideoModal(video, onComplete);
    });
  });
}

export function openVideoModal(video, onComplete) {
  if (!navigator.onLine) {
    checkOnlineStatus(document.getElementById('content-section'));
    return;
  }

  currentVideo = video;
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const title = document.getElementById('video-modal-title');
  const error = document.getElementById('video-error');
  const completeSection = document.getElementById('video-complete-section');

  if (!modal || !iframe) return;

  if (title) title.textContent = video.title;
  if (error) error.hidden = true;
  if (completeSection) completeSection.hidden = false;

  iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
  modal.hidden = false;
  document.body.classList.add('modal-open');

  const durationSelect = document.getElementById('video-complete-minutes');
  if (durationSelect) {
    durationSelect.innerHTML = DURATION_OPTIONS.map(
      (m) => `<option value="${m}" ${m === video.defaultMinutes ? 'selected' : ''}>${m}분</option>`
    ).join('');
  }

  modal.dataset.onComplete = 'true';
  modal._onComplete = onComplete;
}

export function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  if (iframe) iframe.src = '';
  if (modal) modal.hidden = true;
  document.body.classList.remove('modal-open');
  currentVideo = null;
}

export function handleVideoComplete() {
  const select = document.getElementById('video-complete-minutes');
  const minutes = Number(select?.value ?? currentVideo?.defaultMinutes ?? 10);
  const modal = document.getElementById('video-modal');

  if (minutes >= 1) {
    addMeditationRecord(minutes);
    modal?._onComplete?.(minutes);
    closeVideoModal();
    return true;
  }
  return false;
}

export function showVideoError() {
  const error = document.getElementById('video-error');
  const link = document.getElementById('video-external-link');
  if (error) error.hidden = false;
  if (link && currentVideo) {
    link.href = `https://www.youtube.com/watch?v=${currentVideo.id}`;
    link.hidden = false;
  }
}

export function checkOnlineStatus(container) {
  const offlineMsg = document.getElementById('content-offline');
  if (!offlineMsg) return;

  if (!navigator.onLine) {
    offlineMsg.hidden = false;
    container?.classList.add('content-section--offline');
  } else {
    offlineMsg.hidden = true;
    container?.classList.remove('content-section--offline');
  }
}

export function initYouTube(onComplete) {
  const container = document.getElementById('content-list');
  renderVideoCards(container, onComplete);
  checkOnlineStatus(document.getElementById('content-section'));

  window.addEventListener('online', () => checkOnlineStatus(document.getElementById('content-section')));
  window.addEventListener('offline', () => checkOnlineStatus(document.getElementById('content-section')));

  document.getElementById('video-modal-close')?.addEventListener('click', closeVideoModal);
  document.getElementById('video-modal-backdrop')?.addEventListener('click', closeVideoModal);
  document.getElementById('video-complete-btn')?.addEventListener('click', handleVideoComplete);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}
