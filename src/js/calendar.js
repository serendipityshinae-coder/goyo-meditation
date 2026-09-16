import { getMonthRecords } from './records.js';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function renderCalendar(container, year, month, onDateSelect) {
  if (!container) return;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const monthRecords = Object.fromEntries(getMonthRecords(year, month));
  const todayKey = formatTodayKey();

  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'calendar__header';
  header.innerHTML = `
    <button type="button" class="calendar__nav" id="calendar-prev" aria-label="이전 달">‹</button>
    <h3 class="calendar__title">${year}년 ${month + 1}월</h3>
    <button type="button" class="calendar__nav" id="calendar-next" aria-label="다음 달">›</button>
  `;
  container.appendChild(header);

  const weekdays = document.createElement('div');
  weekdays.className = 'calendar__weekdays';
  WEEKDAY_LABELS.forEach((label) => {
    const cell = document.createElement('span');
    cell.className = 'calendar__weekday';
    cell.textContent = label;
    weekdays.appendChild(cell);
  });
  container.appendChild(weekdays);

  const grid = document.createElement('div');
  grid.className = 'calendar__grid';
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', `${year}년 ${month + 1}월 명상 기록`);

  for (let i = 0; i < startOffset; i += 1) {
    const empty = document.createElement('span');
    empty.className = 'calendar__day calendar__day--empty';
    empty.setAttribute('aria-hidden', 'true');
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = monthRecords[dateKey];
    const minutes = record?.totalMinutes ?? 0;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar__day';
    btn.dataset.date = dateKey;
    btn.setAttribute('role', 'gridcell');
    btn.setAttribute('aria-label', `${month + 1}월 ${day}일`);

    if (dateKey === todayKey) btn.classList.add('calendar__day--today');
    if (minutes >= 1) {
      btn.classList.add('calendar__day--meditated');
      if (minutes >= 20) btn.classList.add('calendar__day--meditated-high');
      else if (minutes >= 10) btn.classList.add('calendar__day--meditated-mid');
    }

    btn.innerHTML = `<span class="calendar__day-number">${day}</span>`;
    btn.addEventListener('click', () => onDateSelect?.(dateKey, record));
    grid.appendChild(btn);
  }

  container.appendChild(grid);

  header.querySelector('#calendar-prev')?.addEventListener('click', () => {
    onDateSelect?.('nav', { direction: -1 });
  });
  header.querySelector('#calendar-next')?.addEventListener('click', () => {
    onDateSelect?.('nav', { direction: 1 });
  });
}

function formatTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
