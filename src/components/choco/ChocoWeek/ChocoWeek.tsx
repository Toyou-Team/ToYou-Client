import clsx from 'clsx';

import type { ChocolateCalendarDay, ChocolateSummary } from '@/common/apis/chocolate';

import * as styles from './chocoWeek.css';

type Box = 'empty' | 'dot' | 'outlined' | 'filled' | 'dashed' | 'dashedStrong' | 'muted' | 'struck';

interface ChocoWeekProps {
  summary: Pick<ChocolateSummary, 'joinedAt' | 'week' | 'firstLetterWrittenAt' | 'firstLetterBonusAmount'>;
}

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const FUTURE_LABELS = ['내일', '모레'];

// 2026-10-19 → 10.19
const formatMonthDay = (date: string) => date.slice(5).replace('-', '.');

const toKoreanDate = (isoString: string) => new Date(isoString).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

const getDayBox = (
  day: ChocolateCalendarDay,
  summary: ChocoWeekProps['summary'],
  joinedDate: string,
  daysFromToday: number,
): { box: Box; value?: string; label?: string } => {
  // 가입일과 첫 편지일이 같으면 첫 편지로 보여준다
  const bonus = day.firstLetterBonusGrantedAmount;
  if (bonus > 0) return { box: day.isToday ? 'filled' : 'outlined', value: `+${bonus}`, label: '첫 편지' };
  if (day.date < joinedDate) return { box: 'empty' };
  if (day.date === joinedDate) return { box: 'dot', label: '가입' };
  // 첫 편지 전에는 오늘 받을 수 있는 첫 편지 초코를 보여준다
  if (day.isToday && !summary.firstLetterWrittenAt)
    return { box: 'dashedStrong', value: `+${summary.firstLetterBonusAmount}`, label: '오늘' };
  if (!day.dailyEligible) return { box: 'empty' };

  if (day.isFuture)
    return { box: 'dashed', value: `+${day.scheduledDailyAmount}`, label: FUTURE_LABELS[daysFromToday - 1] };

  const { grantedAmount, remainingAmount, expiredAmount } = day.daily;
  if (expiredAmount > 0) return { box: 'struck', value: `${grantedAmount}`, label: '소멸' };
  if (remainingAmount > 0) return { box: 'filled', value: `+${grantedAmount}`, label: '오늘' };

  return day.isToday
    ? { box: 'outlined', value: `+${grantedAmount}`, label: '모두 사용' }
    : { box: 'muted', value: `${grantedAmount}`, label: '사용' };
};

export function ChocoWeek({ summary }: ChocoWeekProps) {
  const { startDate, endDate, days } = summary.week;
  const joinedDate = toKoreanDate(summary.joinedAt);
  const todayIndex = days.findIndex(({ isToday }) => isToday);

  return (
    <section className={styles.week}>
      <div className={styles.weekHeader}>
        <h3 className={styles.weekTitle}>THIS WEEK</h3>
        <span className={styles.weekTitle}>
          {formatMonthDay(startDate)} — {formatMonthDay(endDate)}
        </span>
      </div>

      <ol className={styles.days}>
        {days.map((day, index) => {
          const { box, value, label } = getDayBox(day, summary, joinedDate, index - todayIndex);
          const isFaded = day.isFuture || day.date < joinedDate;

          return (
            <li key={day.date} className={clsx(styles.day, isFaded && styles.faded, day.isToday && styles.today)}>
              <span className={styles.weekday}>{WEEKDAYS[index]}</span>
              <span className={styles.date}>{Number(day.date.slice(8))}</span>
              <span className={styles.box({ box })}>{value}</span>
              <span className={styles.label}>{label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
