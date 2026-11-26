'use client';

import { useEffect, useEffectEvent } from 'react';

export function useAppMessage(onMessage: (data: unknown) => void, enabled = true) {
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MessageEvent) => handleMessage(event.data);
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [enabled]);
}
