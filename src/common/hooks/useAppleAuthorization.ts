'use client';

import { useCallback, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from 'react';

import {
  type AppleWebAttempt,
  getAppleLoginMode,
  isAppleCancelError,
  parseAppleAppResult,
  prepareAppleWebAttempt,
  requestAppleAppSignIn,
  signInWithAppleWeb,
} from '@/common/apis/appleSignIn';

export type AppleAuthorization =
  | { status: 'SUCCESS'; identityToken?: string; nonce?: string; authorizationCode?: string }
  // INVALID: SDK 미준비·state 불일치
  | { status: 'CANCELED' | 'FAILED' | 'INVALID' };

interface UseAppleAuthorizationOptions {
  enabled?: boolean;
  onResult: (result: AppleAuthorization) => void | Promise<void>;
}

const subscribe = () => () => {};

// iOS 앱은 네이티브, 일반 웹은 Apple JS 팝업으로 인증한다
export function useAppleAuthorization({ enabled = true, onResult }: UseAppleAuthorizationOptions) {
  // 서버 렌더링에서는 실행 환경을 알 수 없어 null
  const mode = useSyncExternalStore(subscribe, getAppleLoginMode, () => null);
  const [isPending, setIsPending] = useState(false);
  const [webPhase, setWebPhase] = useState<'preparing' | 'ready' | 'failed'>('preparing');
  const attemptRef = useRef<AppleWebAttempt | null>(null);
  const waitingAppRef = useRef(false);

  const prepareWebAttempt = useCallback(
    () =>
      prepareAppleWebAttempt().then(
        (attempt) => {
          attemptRef.current = attempt;
          setWebPhase('ready');
        },
        () => setWebPhase('failed'),
      ),
    [],
  );

  // 재시도할 때마다 새 nonce·state 로 준비한다
  const resetWebAttempt = () => {
    attemptRef.current = null;
    setWebPhase('preparing');
    prepareWebAttempt();
  };

  useEffect(() => {
    if (enabled && mode === 'web') prepareWebAttempt();
  }, [enabled, mode, prepareWebAttempt]);

  const handleAppResult = useEffectEvent(async (data: unknown) => {
    const result = parseAppleAppResult(data);
    if (!result || !waitingAppRef.current) return;
    waitingAppRef.current = false;

    if (result.status === 'SUCCESS') {
      await onResult({
        status: 'SUCCESS',
        identityToken: result.identityToken,
        nonce: result.nonce,
        authorizationCode: result.authorizationCode,
      });
    } else {
      await onResult({ status: result.status });
    }

    setIsPending(false);
  });

  useEffect(() => {
    if (!enabled || mode !== 'app') return;

    const listener = (event: MessageEvent) => handleAppResult(event.data);
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [enabled, mode]);

  // 클릭 직후 비동기 작업 없이 팝업을 띄운다
  const authorizeWeb = async (attempt: AppleWebAttempt) => {
    setIsPending(true);

    try {
      const { authorization } = await signInWithAppleWeb();

      await onResult(
        authorization.state === attempt.state
          ? {
              status: 'SUCCESS',
              identityToken: authorization.id_token,
              nonce: attempt.nonce,
              authorizationCode: authorization.code,
            }
          : { status: 'INVALID' },
      );
    } catch (error) {
      await onResult({ status: isAppleCancelError(error) ? 'CANCELED' : 'FAILED' });
    } finally {
      setIsPending(false);
      resetWebAttempt();
    }
  };

  const authorize = () => {
    if (mode === 'app') {
      waitingAppRef.current = true;
      setIsPending(true);
      requestAppleAppSignIn();
      return;
    }

    if (mode !== 'web') {
      onResult({ status: 'FAILED' });
      return;
    }

    if (!attemptRef.current) {
      onResult({ status: 'INVALID' });
      resetWebAttempt();
      return;
    }

    authorizeWeb(attemptRef.current);
  };

  return {
    mode,
    isDisabled: mode === null || isPending || (mode === 'web' && webPhase === 'preparing'),
    authorize,
  };
}
