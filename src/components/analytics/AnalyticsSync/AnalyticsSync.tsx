'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { rememberScreen, setAnalyticsUser } from '@/common/analytics/gtm';
import { getProfile, PROFILE_QUERY_KEY } from '@/common/apis/profile';
import { isLoggedIn } from '@/common/apis/push';

// user_id 를 다른 이벤트보다 먼저 보내려고 Providers 맨 앞에 둔다
export function AnalyticsSync() {
  const pathname = usePathname();

  // 앱을 열 때와 로그인 후 화면 이동 시 프로필을 받아 user_id·성별 전송
  const { data: profile } = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: getProfile, enabled: isLoggedIn() });
  const id = profile?.id;
  const gender = profile?.gender;

  useEffect(() => {
    if (id) setAnalyticsUser({ id, gender });
  }, [id, gender]);

  useEffect(() => {
    rememberScreen(pathname);
  }, [pathname]);

  return null;
}
