'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

import {
  deletePushToken,
  isLoggedIn,
  isPushAppSupported,
  parsePushTokenResult,
  putPushToken,
} from '@/common/apis/push';

// 앱이 보낸 푸시 토큰 결과를 서버에 반영한다.
// 홈의 권한 요청 결과뿐 아니라 토큰이 바뀌거나 iOS 설정에서 알림을 껐다 켠 뒤 앱으로 돌아올 때도 앱이 먼저 보낸다.
export function PushTokenSync() {
  // 결과가 연달아 와도 도착한 순서대로 반영한다 (허용 → 거절이 뒤집히지 않게)
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const handleMessage = useEffectEvent((data: unknown) => {
    const result = parsePushTokenResult(data);
    // 로그아웃 상태에서는 서버에 등록할 세션이 없다. 다음 로그인 후 홈에서 다시 요청한다
    if (!result || result.status === 'FAILED' || !isLoggedIn()) return;

    const sync = (): Promise<unknown> =>
      result.status === 'GRANTED'
        ? putPushToken({ token: result.token, platform: result.platform })
        : deletePushToken();
    // 실패해도 화면에는 알리지 않는다. 다음 홈 진입·앱 복귀 때 다시 맞춰진다
    queue.current = queue.current.then(sync).catch(() => undefined);
  });

  useEffect(() => {
    if (!isPushAppSupported()) return;

    const listener = (event: MessageEvent) => handleMessage(event.data);
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return null;
}
