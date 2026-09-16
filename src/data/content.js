export const TIME_SLOTS = [
  {
    id: 'dawn',
    label: '새벽',
    hours: [4, 5, 6],
    greeting: '고요한 시간 속에서 나를 바라봐요.',
    description: '안개 낀 호수와\n고요한 새벽 공기',
    image:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80',
    localImage: '/assets/backgrounds/background-dawn.jpg',
    ambientYoutubeId: 'Nd7e4SNjGBM',
  },
  {
    id: 'morning',
    label: '아침',
    hours: [7, 8, 9, 10],
    greeting: '오늘의 첫 호흡을 천천히 시작해요.',
    description: '햇살이 비치는 숲과\n상쾌한 시작',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80',
    localImage: '/assets/backgrounds/background-morning.jpg',
    ambientYoutubeId: 'nMfmwGoLl0w',
  },
  {
    id: 'day',
    label: '낮',
    hours: [11, 12, 13, 14, 15, 16],
    greeting: '잠시 멈추고 호흡으로 돌아와요.',
    description: '푸른 숲과\n잔잔한 호수',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80',
    localImage: '/assets/backgrounds/background-day.jpg',
    ambientYoutubeId: 'lFcxdS2_YAM',
  },
  {
    id: 'sunset',
    label: '저녁',
    hours: [17, 18, 19],
    greeting: '오늘의 긴장을 천천히 내려놓아요.',
    description: '노을지는 산과\n따뜻한 하루의 마무리',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80',
    localImage: '/assets/backgrounds/background-sunset.jpg',
    ambientYoutubeId: 'lE6I8YY11y8',
  },
  {
    id: 'night',
    label: '밤',
    hours: [20, 21, 22, 23, 0, 1, 2, 3],
    greeting: '하루의 생각을 잠시 쉬게 해요.',
    description: '별이 빛나는 어두운 숲과\n깊은 휴식',
    image:
      'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=2400&q=80',
    localImage: '/assets/backgrounds/background-night.jpg',
    ambientYoutubeId: 'rDy2L2OEkMM',
  },
];

/** 명상 탭 전용 — 시간별 3개씩, 추천 콘텐츠와 ID 중복 없음 */
export const MEDITATION_PLAYLISTS = [
  {
    id: '5-breath',
    duration: 5,
    title: '5분 호흡 명상',
    description: '짧게 숨을 고르며\n마음을 가다듬어요',
    type: '호흡·가이드',
    youtubeId: 'inpok4MKVLM',
    theme: 'morning',
  },
  {
    id: '5-calm',
    duration: 5,
    title: '5분 마음 안정',
    description: '바쁜 하루 속\n잠깐의 쉼표',
    type: '가이드 명상',
    youtubeId: '9HNt6kp0JN8',
    theme: 'day',
  },
  {
    id: '5-nature',
    duration: 5,
    title: '5분 자연 소리',
    description: '숲의 소리와 함께\n짧게 명상해요',
    type: '자연 소리',
    youtubeId: 'Nd7e4SNjGBM',
    theme: 'morning',
  },
  {
    id: '10-forest',
    duration: 10,
    title: '숲속 10분 명상',
    description: '숲의 소리와 함께\n천천히 호흡해요',
    type: '자연 소리·가이드',
    youtubeId: '4S3yJkGWM4E',
    theme: 'morning',
  },
  {
    id: '10-calm',
    duration: 10,
    title: '10분 마음 가라앉히기',
    description: '복잡한 생각을\n내려놓는 시간',
    type: '가이드 명상',
    youtubeId: 'KKNKgQTJn0c',
    theme: 'day',
  },
  {
    id: '10-anxiety',
    duration: 10,
    title: '10분 불안 완화',
    description: '긴장된 마음을\n부드럽게 풀어요',
    type: '가이드 명상',
    youtubeId: 'O-6f5wQXSu8',
    theme: 'sunset',
  },
  {
    id: '15-stress',
    duration: 15,
    title: '15분 스트레스 해소',
    description: '몸과 마음의\n긴장을 내려놓아요',
    type: '가이드 명상',
    youtubeId: 'itZMM5gCboo',
    theme: 'sunset',
  },
  {
    id: '15-body',
    duration: 15,
    title: '15분 바디 스캔',
    description: '몸의 감각에\n천천히 집중해요',
    type: '바디 스캔',
    youtubeId: 'ZToicYcHIOU',
    theme: 'night',
  },
  {
    id: '15-deep',
    duration: 15,
    title: '15분 깊은 이완',
    description: '고요 속으로\n더 깊이 들어가요',
    type: '가이드 명상',
    youtubeId: 'Jyy0ra2WcQQ',
    theme: 'night',
  },
];

/** 추천 명상 콘텐츠 — 명상 플레이리스트와 다른 다양한 영상 */
export const YOUTUBE_VIDEOS = [
  {
    id: 'aEqlQvczMJQ',
    title: '편안한 잠을 위한 10분 명상',
    type: '수면·가이드 명상',
    duration: '약 10분',
    channel: 'Goodful',
    language: '영어 가이드',
    recommendedSlots: ['night'],
    defaultMinutes: 10,
  },
  {
    id: '1ZYbU82GVz4',
    title: '편안한 수면을 위한 명상 음악',
    type: '수면·이완 음악',
    duration: '약 10분',
    channel: 'Peder B. Helland',
    language: '음악',
    recommendedSlots: ['night'],
    defaultMinutes: 10,
  },
  {
    id: '2OEL4P1Rz04',
    title: '깊은 휴식을 위한 명상',
    type: '이완·앰비언트',
    duration: '약 15분',
    channel: 'Soothing Relaxation',
    language: '음악',
    recommendedSlots: ['night', 'sunset'],
    defaultMinutes: 15,
  },
  {
    id: 'j7d5Plai03g',
    title: '매일 10분 마음챙김',
    type: '마음챙김·가이드',
    duration: '약 10분',
    channel: 'Goodful',
    language: '영어 가이드',
    recommendedSlots: ['day', 'morning'],
    defaultMinutes: 10,
  },
  {
    id: '8bBPJ1EEUCc',
    title: '감사와 풍요를 여는 5분',
    type: '감사·가이드 명상',
    duration: '약 5분',
    channel: 'Lavendaire',
    language: '영어 가이드',
    recommendedSlots: ['morning', 'day'],
    defaultMinutes: 5,
  },
  {
    id: '1vx8iUvfyCY',
    title: '집중력을 높이는 명상',
    type: '집중·마음챙김',
    duration: '약 10분',
    channel: 'Headspace',
    language: '영어 가이드',
    recommendedSlots: ['day'],
    defaultMinutes: 10,
  },
  {
    id: 'U9YKY7fdwyg',
    title: '초보자를 위한 10분 명상',
    type: '입문·가이드 명상',
    duration: '약 10분',
    channel: 'Goodful',
    language: '영어 가이드',
    recommendedSlots: ['sunset', 'morning'],
    defaultMinutes: 10,
  },
  {
    id: 'i50ZAs7v9es',
    title: '5분 호흡으로 시작하기',
    type: '호흡·입문',
    duration: '약 5분',
    channel: 'Great Meditation',
    language: '영어 가이드',
    recommendedSlots: ['morning', 'day'],
    defaultMinutes: 5,
  },
];

export const NAV_PAGES = [
  { id: 'home', label: '홈', icon: '⌂' },
  { id: 'meditation', label: '명상', icon: '◎' },
  { id: 'records', label: '나의 기록', icon: '▦' },
  { id: 'content', label: '추천 명상 콘텐츠', icon: '▶' },
];

export const BREATHING_PHRASES = [
  '천천히 들이쉬어요.',
  '잠시 머물러요.',
  '길게 내쉬어요.',
  '몸의 긴장을 내려놓아요.',
];

export const DURATION_OPTIONS = [5, 10, 15];

export function getPlaylistsByDuration(minutes) {
  return MEDITATION_PLAYLISTS.filter((p) => p.duration === minutes);
}

export const STORAGE_KEY = 'goyo-data';

export const STORAGE_NOTICE =
  '로그인 없이 사용하는 동안 명상 기록은 현재 브라우저에만 저장됩니다. 브라우저 데이터를 삭제하거나 다른 기기를 사용하면 기록이 보이지 않을 수 있습니다.';

export const CHALLENGE_MESSAGES = {
  empty: '첫 호흡을 기다리고 있어요.',
  todayDone: '오늘의 고요를 기록했어요.',
  streak3: '3일째 마음을 돌보고 있어요.',
  missed: '하루를 놓쳐도 괜찮아요. 오늘 다시 시작해요.',
  complete: '7일 동안의 여정을 완주했어요.',
};
