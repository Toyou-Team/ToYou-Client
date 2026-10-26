'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { accountStatusQueryOptions } from '@/common/apis/auth';
import { getRestrictionPath } from '@/constants/restriction';

// 제재 중이면 이용 제한 화면으로, 아니면 onActive. 조회 실패는 일반 화면으로 (막힌 기능은 403 시트가 안내)
export function useAccountStatusCheck() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async (onActive?: () => void) => {
    const status = await queryClient.fetchQuery(accountStatusQueryOptions).catch(() => null);

    if (status?.restricted) router.replace(getRestrictionPath(status.sanction));
    else onActive?.();
  };
}
