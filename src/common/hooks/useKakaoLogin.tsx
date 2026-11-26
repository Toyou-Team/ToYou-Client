'use client';

import { useRef, useState, useSyncExternalStore } from 'react';

import { startKakaoLogin, useKakaoTokenLoginMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { getKakaoLoginMode, parseKakaoAppResult, requestKakaoAppSignIn } from '@/common/apis/kakaoSignIn';
import { useAccountUnavailable } from '@/common/hooks/useAccountUnavailable';
import { useAlertModal } from '@/common/hooks/useAlertModal';
import { useAppMessage } from '@/common/hooks/useAppMessage';
import { useSignInResult } from '@/common/hooks/useSignInResult';

const MESSAGE = {
  // 카카오 콜백 페이지와 같은 문구
  SIGNUP_UNAVAILABLE: [
    '가입할 수 없어요',
    '카카오 계정에서 연령 확인에 필요한 출생연도와 생일 정보를 확인할 수 없어 가입할 수 없습니다. 카카오 계정 정보와 개인정보 제공 동의를 확인한 후 다시 시도해 주세요.',
  ],
  AGE_RESTRICTED: ['가입할 수 없어요', '만 14세 이상만 가입할 수 있어요.'],
  FAILED: ['카카오 로그인을 완료하지 못했어요', '다시 시도해 주세요.'],
  KAKAO_DOWN: ['카카오 로그인이 잠시 원활하지 않아요', '잠시 후 다시 시도해 주세요.'],
} as const;

const subscribe = () => () => {};

// iOS 앱은 카카오톡(카카오 SDK), 그 외에는 카카오 로그인 페이지로 이동한다
export function useKakaoLogin() {
  const openAlert = useAlertModal();
  const { mutateAsync: login } = useKakaoTokenLoginMutation();
  const handleSignInResult = useSignInResult();
  const handleAccountUnavailable = useAccountUnavailable();
  // 서버 렌더링에서는 실행 환경을 알 수 없어 null
  const mode = useSyncExternalStore(subscribe, getKakaoLoginMode, () => null);
  const [isPending, setIsPending] = useState(false);
  const waitingAppRef = useRef(false);

  const openMessage = (key: keyof typeof MESSAGE) => {
    const [title, description] = MESSAGE[key];
    openAlert({ title, description });
  };

  const loginToServer = async (accessToken: string) => {
    try {
      if (!(await handleSignInResult(await login(accessToken), 'kakao'))) openMessage('SIGNUP_UNAVAILABLE');
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      // 서버가 앱 로그인을 끈 환경. 토큰을 쓰기 전에 거절되므로 웹 로그인으로 이어간다
      if (code === AUTH_ERROR_CODE.KAKAO_NATIVE_LOGIN_DISABLED) {
        startKakaoLogin();
        return;
      }

      if (code === AUTH_ERROR_CODE.ACCOUNT_UNAVAILABLE) {
        handleAccountUnavailable(error as Error);
        return;
      }

      if (code === AUTH_ERROR_CODE.AGE_RESTRICTED) {
        openMessage('AGE_RESTRICTED');
        return;
      }

      openMessage(code === AUTH_ERROR_CODE.KAKAO_UNAVAILABLE ? 'KAKAO_DOWN' : 'FAILED');
    }
  };

  useAppMessage(async (data) => {
    const result = parseKakaoAppResult(data);
    if (!result || !waitingAppRef.current) return;
    waitingAppRef.current = false;

    if (result.status === 'SUCCESS' && result.accessToken) {
      await loginToServer(result.accessToken);
    } else if (result.status !== 'CANCELED') {
      openMessage('FAILED');
    }

    setIsPending(false);
  }, mode === 'app');

  const signIn = () => {
    if (mode !== 'app') {
      startKakaoLogin();
      return;
    }

    waitingAppRef.current = true;
    setIsPending(true);
    requestKakaoAppSignIn();
  };

  return {
    isDisabled: mode === null || isPending,
    signIn,
  };
}
