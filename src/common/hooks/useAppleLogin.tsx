'use client';

import { useAppleLoginMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { useAccountUnavailable } from '@/common/hooks/useAccountUnavailable';
import { useAlertModal } from '@/common/hooks/useAlertModal';
import { type AppleAuthorization, useAppleAuthorization } from '@/common/hooks/useAppleAuthorization';
import { useSignInResult } from '@/common/hooks/useSignInResult';

const MESSAGE = {
  SIGNUP_UNAVAILABLE: ['지금은 Apple로 새로 가입할 수 없어요', '카카오로 시작해 주세요.'],
  FAILED: ['Apple 로그인을 완료하지 못했어요', '다시 시도해 주세요.'],
  RETRY: ['로그인 중 문제가 생겼어요', '다시 시도해 주세요.'],
  APPLE_DOWN: ['Apple 로그인이 잠시 원활하지 않아요', '잠시 후 다시 시도해 주세요.'],
} as const;

export function useAppleLogin() {
  const openAlert = useAlertModal();
  const { mutateAsync: login } = useAppleLoginMutation();
  const handleSignInResult = useSignInResult();
  const handleAccountUnavailable = useAccountUnavailable();

  const openMessage = (key: keyof typeof MESSAGE) => {
    const [title, description] = MESSAGE[key];
    openAlert({ title, description });
  };

  const loginToServer = async (payload: { identityToken: string; nonce: string }) => {
    try {
      if (!(await handleSignInResult(await login(payload), 'apple'))) openMessage('SIGNUP_UNAVAILABLE');
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      if (code === AUTH_ERROR_CODE.ACCOUNT_UNAVAILABLE) {
        handleAccountUnavailable(error as Error);
        return;
      }

      openMessage(code === AUTH_ERROR_CODE.APPLE_UNAVAILABLE ? 'APPLE_DOWN' : 'RETRY');
    }
  };

  const handleResult = async (result: AppleAuthorization) => {
    if (result.status === 'CANCELED') return;

    if (result.status === 'FAILED') {
      openMessage('FAILED');
      return;
    }

    if (result.status === 'SUCCESS' && result.identityToken && result.nonce) {
      await loginToServer({ identityToken: result.identityToken, nonce: result.nonce });
      return;
    }

    openMessage('RETRY');
  };

  const { mode, isDisabled, authorize } = useAppleAuthorization({ onResult: handleResult });

  return {
    // 애플 로그인을 지원하지 않는 앱 웹뷰는 버튼을 숨긴다
    isVisible: mode !== 'unsupported',
    isDisabled,
    signIn: authorize,
  };
}
