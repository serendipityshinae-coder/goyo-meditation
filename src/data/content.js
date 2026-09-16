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
  },
];

export const MUSIC_THEMES = [
  {
    id: 'dawn',
    label: '새벽',
    title: '고요한 새벽 숲',
    description: '고요한 피아노와\n새벽 공기',
    type: '자연 소리·명상음악',
    youtubeId: 'Nd7e4SNjGBM',
    slotId: 'dawn',
  },
  {
    id: 'morning',
    label: '아침',
    title: '아침 숲의 호흡',
    description: '숲속 새소리와\n부드러운 멜로디',
    type: '자연 소리·가이드',
    youtubeId: '4S3yJkGWM4E',
    slotId: 'morning',
  },
  {
    id: 'day',
    label: '낮',
    title: '낮의 고요',
    description: '마음을 가라앉히는\n잔잔한 선율',
    type: '가이드 명상',
    youtubeId: 'KKNKgQTJn0c',
    slotId: 'day',
  },
  {
    id: 'sunset',
    label: '저녁',
    title: '저녁 노을의 쉼',
    description: '긴장을 풀어주는\n따뜻한 음악',
    type: '가이드 명상',
    youtubeId: 'O-6f5wQXSu8',
    slotId: 'sunset',
  },
  {
    id: 'night',
    label: '밤',
    title: '밤하늘 아래',
    description: '깊은 잠을 위한\n편안한 명상음악',
    type: '수면·명상음악',
    youtubeId: 'aEqlQvczMJQ',
    slotId: 'night',
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

export const DURATION_OPTIONS = [5, 10, 20];

export const YOUTUBE_VIDEOS = [
  {
    id: '4S3yJkGWM4E',
    title: '숲의 소리와 함께하는 10분 명상',
    type: '자연 소리·가이드 명상',
    duration: '약 10분',
    channel: 'Goodful',
    language: '영어 가이드',
    recommendedSlots: ['morning', 'day'],
    defaultMinutes: 10,
  },
  {
    id: 'KKNKgQTJn0c',
    title: '복잡한 마음을 가라앉히는 10분',
    type: '가이드 명상',
    duration: '약 10분',
    channel: 'Great Meditation',
    language: '영어 가이드',
    recommendedSlots: ['day', 'sunset'],
    defaultMinutes: 10,
  },
  {
    id: 'O-6f5wQXSu8',
    title: '불안한 마음을 위한 10분',
    type: '가이드 명상',
    duration: '약 10분',
    channel: 'Goodful',
    language: '영어 가이드',
    recommendedSlots: ['day', 'sunset'],
    defaultMinutes: 10,
  },
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
    id: 'Nd7e4SNjGBM',
    title: '깊은 휴식을 위한 숲의 음악',
    type: '자연 소리·명상음악',
    duration: '장시간',
    channel: 'Music for Body and Spirit',
    language: null,
    recommendedSlots: ['dawn', 'sunset', 'night'],
    defaultMinutes: 20,
  },
];

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
