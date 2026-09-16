# 고요 — 명상 웹앱

시간대에 맞는 자연 배경, 명상 타이머, 기록 달력, 7일 챌린지, YouTube 명상 콘텐츠를 제공하는 반응형 웹앱입니다.

## 실행 방법

Node.js가 설치되어 있다면:

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

## 빌드 및 배포

```bash
npm run build
npm run preview
```

`dist/` 폴더를 GitHub Pages, Netlify, Vercel 등 정적 호스팅에 배포할 수 있습니다.

## 주요 기능

- 5/10/20분 명상 타이머 (일시정지, 복구, 조기 완료)
- 시간대별 배경 자동/수동 전환
- localStorage 기반 명상 기록 및 월간 달력
- 7일 마음 챌린지
- YouTube 명상 콘텐츠 재생 및 수동 완료 기록
- 움직임 줄이기 접근성 옵션

## 문서

- [기획안.md](./기획안.md)
- [소스.md](./소스.md)
- [SOURCES.md](./SOURCES.md)
