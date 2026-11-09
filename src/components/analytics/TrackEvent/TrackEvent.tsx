'use client';

import { useEffect, useEffectEvent } from 'react';

import { type AnalyticsEvent, trackEvent } from '@/common/analytics/gtm';

// 서버 컴포넌트 화면의 진입 이벤트용
export function TrackEvent(props: AnalyticsEvent) {
  const send = useEffectEvent(() => trackEvent(props));

  useEffect(() => {
    send();
  }, []);

  return null;
}
