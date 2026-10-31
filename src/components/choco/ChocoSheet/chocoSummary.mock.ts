import type { ChocolateCalendarDay, ChocolateDaily, ChocolateSummary } from '@/common/apis/chocolate';

// TODO: 초코 조회 API(GET /api/v1/chocolates/summary) 연결 후 삭제

const daily = (granted: number, used: number, expired: number): ChocolateDaily => ({
  requestedAmount: granted,
  grantedAmount: granted,
  usedAmount: used,
  expiredAmount: expired,
  remainingAmount: granted - used - expired,
  discardedAmount: 0,
});

const day = (date: string, overrides: Partial<ChocolateCalendarDay>): ChocolateCalendarDay => ({
  date,
  isToday: false,
  isFuture: false,
  dailyEligible: true,
  scheduledDailyAmount: 20,
  daily: daily(0, 0, 0),
  firstLetterBonusGrantedAmount: 0,
  usedAmount: 0,
  ...overrides,
});

const nextMidnight = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();

// 월요일에 가입하고 첫 편지를 쓴 경우 (시안 A)
export const chocoSummaryMock: ChocolateSummary = {
  serverTime: new Date().toISOString(),
  timeZone: 'Asia/Seoul',
  balance: 60,
  maximumBalance: 60,
  permanentBalance: 40,
  expiringBalance: 20,
  expiringAmount: 20,
  nextExpirationAt: nextMidnight,
  joinedAt: '2026-10-19T03:00:00.000Z',
  firstLetterWrittenAt: '2026-10-19T03:00:00.000Z',
  nextDailyGrantAt: nextMidnight,
  firstLetterBonusAmount: 40,
  dailyGrantAmount: 20,
  todayDaily: daily(20, 0, 0),
  week: {
    startDate: '2026-10-19',
    endDate: '2026-10-25',
    days: [
      day('2026-10-19', { dailyEligible: false, scheduledDailyAmount: 0, firstLetterBonusGrantedAmount: 40 }),
      day('2026-10-20', { daily: daily(20, 20, 0) }),
      day('2026-10-21', { daily: daily(20, 20, 0) }),
      day('2026-10-22', { daily: daily(20, 0, 20) }),
      day('2026-10-23', { isToday: true, daily: daily(20, 0, 0) }),
      day('2026-10-24', { isFuture: true }),
      day('2026-10-25', { isFuture: true }),
    ],
  },
};
