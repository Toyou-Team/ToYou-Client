import { useQuery, useQueryClient } from '@tanstack/react-query';

import { request } from './client';
import { syncChocolateBalance } from './profile';

export interface ChocolateDaily {
  requestedAmount: number;
  grantedAmount: number;
  usedAmount: number;
  expiredAmount: number;
  remainingAmount: number;
  // 잔액 상한으로 지급하지 못한 수량
  discardedAmount: number;
}

export interface ChocolateCalendarDay {
  // YYYY-MM-DD (한국 시간)
  date: string;
  isToday: boolean;
  isFuture: boolean;
  // 첫 편지 작성 다음 날부터 true
  dailyEligible: boolean;
  scheduledDailyAmount: number;
  daily: ChocolateDaily;
  firstLetterBonusGrantedAmount: number;
  usedAmount: number;
}

export interface ChocolateSummary {
  serverTime: string;
  timeZone: string;
  balance: number;
  maximumBalance: number;
  // 기한 없는 초코 잔액 (첫 편지 선물 등)
  permanentBalance: number;
  expiringBalance: number;
  expiringAmount: number;
  nextExpirationAt: string | null;
  joinedAt: string;
  firstLetterWrittenAt: string | null;
  nextDailyGrantAt: string | null;
  firstLetterBonusAmount: number;
  dailyGrantAmount: number;
  todayDaily: ChocolateDaily;
  week: {
    startDate: string;
    endDate: string;
    days: ChocolateCalendarDay[];
  };
}

export const CHOCOLATE_SUMMARY_QUERY_KEY = ['chocolates', 'summary'] as const;

// 내 초코 조회 (잔액, 오늘 초코, 이번 주 기록)
export const getChocolateSummary = () => request<ChocolateSummary>('get', '/api/v1/chocolates/summary');

// 시트를 열 때마다 새로 조회하고, 헤더 배지 잔액도 맞춘다
export const useChocolateSummaryQuery = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: CHOCOLATE_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const summary = await getChocolateSummary();
      syncChocolateBalance(queryClient, summary.balance);
      return summary;
    },
  });
};
