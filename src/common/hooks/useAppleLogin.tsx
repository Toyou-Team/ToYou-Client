'use client';

import { useCallback, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AppleWebAttempt,
  getAppleLoginMode,
  isAppleCancelError,
  parseAppleAppResult,
  prepareAppleWebAttempt,
  requestAppleAppSignIn,
  signInWithAppleWeb,
} from '@/common/apis/appleSignIn';
import { useAppleLoginMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { kakaoProfileStore, registrationTokenStore, setTokens } from '@/common/apis/token';
import { useAccountStatusCheck } from '@/common/hooks/useAccountStatusCheck';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

const MESSAGE = {
  SIGNUP_UNAVAILABLE: ['지금은 Apple로 새로 가입할 수 없어요', '카카오로 시작해 주세요.'],
  FAILED: ['Apple 로그인을 완료하지 못했어요', '다시 시도해 주세요.'],
  RETRY: ['로그인 중 문제가 생겼어요', '다시 시도해 주세요.'],
  APPLE_DOWN: ['Apple 로그인이 잠시 원활하지 않아요', '잠시 후 다시 시도해 주세요.'],
} as const;

const subscribe = () => () => {};

export function useAppleLogin() {
  const router = useRouter();
  const { open } = useModal();
  const { mutateAsync: login } = useAppleLoginMutation();
  const checkAccountStatus = useAccountStatusCheck();

  // 서버 렌더링에서는 실행 환경을 알 수 없어 null
  const mode = useSyncExternalStore(subscribe, getAppleLoginMode, () => null);
  const [isPending, setIsPending] = useState(false);
  const [webPhase, setWebPhase] = useState<'preparing' | 'ready' | 'failed'>('preparing');
  const attemptRef = useRef<AppleWebAttempt | null>(null);
  const waitingAppRef = useRef(false);

  const alert = (key: keyof typeof MESSAGE) => {
    const [title, description] = MESSAGE[key];
    open(({ close }) => (
      <Modal title={title} description={description} confirmText="확인" onConfirm={close} onClose={close} />
    ));
  };

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
    if (mode === 'web') prepareWebAttempt();
  }, [mode, prepareWebAttempt]);

  // 응답 처리는 카카오 로그인과 같다
  const loginToServer = async (payload: { identityToken: string; nonce: string }) => {
    try {
      const result = await login(payload);

      switch (result.status) {
        case 'SIGNED_IN':
          setTokens(result);
          await checkAccountStatus(() => router.replace('/home'));
          return;
        case 'SIGNUP_REQUIRED':
          registrationTokenStore.set(result.registrationToken);
          kakaoProfileStore.set(result.kakaoProfile);
          router.replace('/signup/terms');
          return;
        case 'SIGNUP_UNAVAILABLE':
          alert('SIGNUP_UNAVAILABLE');
      }
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      if (code === AUTH_ERROR_CODE.ACCOUNT_UNAVAILABLE) {
        router.replace('/?blocked=restricted');
        return;
      }

      alert(code === AUTH_ERROR_CODE.APPLE_UNAVAILABLE ? 'APPLE_DOWN' : 'RETRY');
    }
  };

  const handleAppResult = useEffectEvent(async (data: unknown) => {
    const result = parseAppleAppResult(data);
    if (!result || !waitingAppRef.current) return;
    waitingAppRef.current = false;

    if (result.status === 'SUCCESS') {
      if (result.identityToken && result.nonce) {
        await loginToServer({ identityToken: result.identityToken, nonce: result.nonce });
      } else {
        alert('RETRY');
      }
    } else if (result.status === 'FAILED') {
      alert('FAILED');
    }

    setIsPending(false);
  });

  useEffect(() => {
    if (mode !== 'app') return;

    const listener = (event: MessageEvent) => handleAppResult(event.data);
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [mode]);

  // 클릭 직후 비동기 작업 없이 팝업을 띄운다
  const signInWeb = async (attempt: AppleWebAttempt) => {
    setIsPending(true);

    try {
      const { authorization } = await signInWithAppleWeb();

      if (authorization.state === attempt.state && authorization.id_token) {
        await loginToServer({ identityToken: authorization.id_token, nonce: attempt.nonce });
      } else {
        alert('RETRY');
      }
    } catch (error) {
      if (!isAppleCancelError(error)) alert('FAILED');
    } finally {
      setIsPending(false);
      resetWebAttempt();
    }
  };

  const signIn = () => {
    if (mode === 'app') {
      waitingAppRef.current = true;
      setIsPending(true);
      requestAppleAppSignIn();
      return;
    }

    // SDK 로드 실패
    if (!attemptRef.current) {
      alert('RETRY');
      resetWebAttempt();
      return;
    }

    signInWeb(attemptRef.current);
  };

  return {
    // 애플 로그인을 지원하지 않는 앱 웹뷰는 버튼을 숨긴다
    isVisible: mode !== 'unsupported',
    isDisabled: mode === null || isPending || (mode === 'web' && webPhase === 'preparing'),
    signIn,
  };
}
