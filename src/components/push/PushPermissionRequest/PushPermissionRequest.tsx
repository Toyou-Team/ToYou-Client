'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/common/analytics/gtm';
import {
  isLoggedIn,
  isPushAppSupported,
  parsePushPermissionResult,
  parsePushTokenResult,
  requestPushPermission,
  requestPushToken,
} from '@/common/apis/push';

// 홈에 들어올 때마다 앱에 알림 권한을 요청한다 (기획: 가입 후 홈 진입 시 동의 창).
// iOS 권한 창은 처음 한 번만 뜨고, 그 뒤로는 창 없이 현재 상태만 돌아와 서버 토큰이 최신으로 유지된다.
export function PushPermissionRequest() {
  useEffect(() => {
    if (!isPushAppSupported() || !isLoggedIn()) return;

    // iOS 권한 창이 뜬 경우(NOT_DETERMINED)만 응답을 보낸다
    let isAsking = false;
    const listener = (event: MessageEvent) => {
      if (parsePushPermissionResult(event.data) === 'NOT_DETERMINED') {
        isAsking = true;
        return;
      }

      const result = parsePushTokenResult(event.data);
      if (!isAsking || !result || result.status === 'FAILED') return;

      isAsking = false;
      trackEvent({
        event: 'notification_permission_result',
        result: result.status === 'GRANTED' ? 'granted' : 'denied',
      });
    };

    window.addEventListener('message', listener);
    requestPushPermission();
    requestPushToken();
    return () => window.removeEventListener('message', listener);
  }, []);

  return null;
}
