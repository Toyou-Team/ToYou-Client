const pad = (value: number) => String(value).padStart(2, '0');

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// 오후 09:33
export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = date.getHours();

  return `${hours < 12 ? '오전' : '오후'} ${pad(hours % 12 || 12)}:${pad(date.getMinutes())}`;
};

// 2026년 09월 03일
export const formatDay = (isoString: string) => {
  const date = new Date(isoString);

  return `${date.getFullYear()}년 ${pad(date.getMonth() + 1)}월 ${pad(date.getDate())}일`;
};

// 오늘이면 시각, 어제면 '어제', 그 이전이면 9월 4일
export const formatRelativeDay = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  if (isSameDay(date, today)) return formatTime(isoString);
  if (isSameDay(date, yesterday)) return '어제';

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// 3일 후 사라져요! / 5시간 후 사라져요! / 20분 후 사라져요!
export const formatExpiresIn = (isoString: string) => {
  const remaining = new Date(isoString).getTime() - Date.now();

  if (remaining >= DAY) return `${Math.ceil(remaining / DAY)}일 후 사라져요!`;
  if (remaining >= HOUR) return `${Math.ceil(remaining / HOUR)}시간 후 사라져요!`;

  return `${Math.max(1, Math.ceil(remaining / (60 * 1000)))}분 후 사라져요!`;
};
