'use client';

import { useEffect } from 'react';

import { isLoggedIn, isPushAppSupported, requestPushToken } from '@/common/apis/push';

// 홈에 들어올 때마다 앱에 알림 권한을 요청한다 (기획: 가입 후 홈 진입 시 동의 창).
// iOS 권한 창은 처음 한 번만 뜨고, 그 뒤로는 창 없이 현재 상태만 돌아와 서버 토큰이 최신으로 유지된다.
export function PushPermissionRequest() {
  useEffect(() => {
    if (isPushAppSupported() && isLoggedIn()) requestPushToken();
  }, []);

  return null;
}
