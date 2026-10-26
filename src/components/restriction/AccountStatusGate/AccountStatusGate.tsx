'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { accountStatusQueryOptions } from '@/common/apis/auth';
import { restoreSession } from '@/common/apis/refresh';
import { useAccountStatusCheck } from '@/common/hooks/useAccountStatusCheck';
import { RestrictionSheet } from '@/components/restriction/RestrictionSheet/RestrictionSheet';
import { getRestrictionPath } from '@/constants/restriction';

export const ACCOUNT_SUSPENDED_EVENT = 'toyou:account-suspended';

// 앱 시작 시 제재 확인 + 403 제재 응답에 안내 시트
export function AccountStatusGate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const checkAccountStatus = useAccountStatusCheck();
  // 동시에 여러 번 막혀도 시트는 하나
  const isSheetOpen = useRef(false);
  // 모달 컨테이너 안에선 시트가 찌그러져 직접 렌더
  const [sheet, setSheet] = useState<{ releaseAt: string | null } | null>(null);

  const onStart = useEffectEvent(async () => {
    const isLoggedIn = await restoreSession();
    if (isLoggedIn && !window.location.pathname.startsWith('/restriction')) checkAccountStatus();
  });

  const onSuspended = useEffectEvent(async () => {
    if (isSheetOpen.current) return;
    isSheetOpen.current = true;

    const sanction = await queryClient
      .fetchQuery(accountStatusQueryOptions)
      .then((status) => status.sanction)
      .catch(() => null);

    // 영구 정지는 시트 대신 안내 화면으로
    if (sanction?.type === 'PERMANENT') {
      isSheetOpen.current = false;
      router.replace(getRestrictionPath(sanction));
      return;
    }

    setSheet({ releaseAt: sanction?.endsAt ?? null });
  });

  const closeSheet = () => {
    isSheetOpen.current = false;
    setSheet(null);
  };

  useEffect(() => {
    onStart();
  }, []);

  useEffect(() => {
    const handleSuspended = () => onSuspended();

    window.addEventListener(ACCOUNT_SUSPENDED_EVENT, handleSuspended);
    return () => window.removeEventListener(ACCOUNT_SUSPENDED_EVENT, handleSuspended);
  }, []);

  return <RestrictionSheet isOpen={sheet !== null} onClose={closeSheet} releaseAt={sheet?.releaseAt ?? null} />;
}
