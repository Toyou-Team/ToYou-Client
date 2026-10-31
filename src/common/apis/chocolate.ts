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
