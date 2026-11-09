'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { rememberScreen, setAnalyticsUserId, trackEvent } from '@/common/analytics/gtm';
import { getProfile, PROFILE_QUERY_KEY } from '@/common/apis/profile';
import { isLoggedIn, parsePushOpened } from '@/common/apis/push';
import { userIdStore } from '@/common/apis/token';

// user_id 를 다른 이벤트보다 먼저 보내려고 Providers 맨 앞에 둔다
export function AnalyticsSync() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn()) return;

    const userId = userIdStore.get();
    if (userId) {
      setAnalyticsUserId(userId);
      return;
    }

    // GA 도입 전에 로그인한 사용자
    queryClient
      .fetchQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: getProfile })
      .then(({ id }) => {
        userIdStore.set(id);
        setAnalyticsUserId(id);
      })
      .catch(() => undefined);
  }, [queryClient]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const deliverySlot = parsePushOpened(event.data);
      if (deliverySlot) trackEvent({ event: 'push_open', delivery_slot: deliverySlot });
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    rememberScreen(pathname);
  }, [pathname]);

  return null;
}
