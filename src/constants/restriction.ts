import type { AccountSanction } from '@/common/apis/auth';

export const SANCTION_STAGE_LABEL: Record<AccountSanction['stage'], string> = {
  1: '1차: 3일 이용 제한',
  2: '2차: 7일 이용 제한',
  3: '3차: 영구 정지',
};

export const getRestrictionPath = (restriction: AccountSanction | null) =>
  restriction?.type === 'PERMANENT' ? '/restriction/permanent' : '/restriction';
