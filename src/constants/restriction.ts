import type { AccountSanction } from '@/common/apis/auth';

export const SANCTION_STAGE_LABEL: Record<AccountSanction['stage'], string> = {
  1: '1차: 3일 이용 제한',
  2: '2차: 7일 이용 제한',
  3: '3차: 1년 이용 제한',
};
