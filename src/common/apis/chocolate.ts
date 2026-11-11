import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { request } from './client';
import { syncChocolateBalance } from './profile';

export interface ChocolateDaily {
  grantedAmount: number;
  usedAmount: number;
  expiredAmount: number;
  remainingAmount: number;
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
  // 기한 없는 초코 전체 (첫 편지/알림 신청 선물 등 합산)
  permanentBalance: number;
  // 첫 편지 선물의 남은 양
  firstLetterBonusRemainingAmount: number;
  expiringBalance: number;
  expiringAmount: number;
  nextExpirationAt: string | null;
  joinedAt: string;
  firstLetterWrittenAt: string | null;
  nextDailyGrantAt: string | null;
  firstLetterBonusAmount: number;
  dailyGrantAmount: number;
  todayDaily: ChocolateDaily;
  chargeAlert: {
    // 광고성 수신 동의를 철회하면 false 로 돌아간다. 지급 이력과는 별개
    requested: boolean;
    requestedAt: string | null;
    giftAmount: number;
    giftRemainingAmount: number;
  };
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

export interface ChargeAlertResult {
  requestedAt: string;
  // 이번 요청으로 실제 지급한 양. 이미 보상받은 계정은 0
  grantedAmount: number;
  balance: number;
}

// 충전 알림 신청
export const postChargeAlert = () => request<ChargeAlertResult>('post', '/api/v1/chocolates/charge-alert');

export const useChargeAlertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChargeAlert,
    onSuccess: ({ balance }) => {
      syncChocolateBalance(queryClient, balance);
      queryClient.invalidateQueries({ queryKey: CHOCOLATE_SUMMARY_QUERY_KEY });
    },
  });
};
