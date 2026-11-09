'use client';

import { useRouter } from 'next/navigation';

import { trackEvent } from '@/common/analytics/gtm';
import { useAppleLoginMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { kakaoProfileStore, loginProviderStore, registrationTokenStore, setTokens } from '@/common/apis/token';
import { useAccountStatusCheck } from '@/common/hooks/useAccountStatusCheck';
import { useAccountUnavailable } from '@/common/hooks/useAccountUnavailable';
import { type AppleAuthorization, useAppleAuthorization } from '@/common/hooks/useAppleAuthorization';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

const MESSAGE = {
  SIGNUP_UNAVAILABLE: ['지금은 Apple로 새로 가입할 수 없어요', '카카오로 시작해 주세요.'],
  FAILED: ['Apple 로그인을 완료하지 못했어요', '다시 시도해 주세요.'],
  RETRY: ['로그인 중 문제가 생겼어요', '다시 시도해 주세요.'],
  APPLE_DOWN: ['Apple 로그인이 잠시 원활하지 않아요', '잠시 후 다시 시도해 주세요.'],
} as const;

export function useAppleLogin() {
  const router = useRouter();
  const { open } = useModal();
  const { mutateAsync: login } = useAppleLoginMutation();
  const checkAccountStatus = useAccountStatusCheck();
  const handleAccountUnavailable = useAccountUnavailable();

  const alert = (key: keyof typeof MESSAGE) => {
    const [title, description] = MESSAGE[key];
    open(({ close }) => (
      <Modal title={title} description={description} confirmText="확인" onConfirm={close} onClose={close} />
    ));
  };

  // 응답 처리는 카카오 로그인과 같다
  const loginToServer = async (payload: { identityToken: string; nonce: string }) => {
    try {
      const result = await login(payload);
      if (result.status !== 'SIGNUP_UNAVAILABLE') trackEvent({ event: 'login', method: 'apple' });

      switch (result.status) {
        case 'SIGNED_IN':
          loginProviderStore.set('APPLE');
          setTokens(result);
          await checkAccountStatus(() => router.replace('/home'));
          return;
        case 'SIGNUP_REQUIRED':
          loginProviderStore.set('APPLE');
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
        handleAccountUnavailable(error as Error);
        return;
      }

      alert(code === AUTH_ERROR_CODE.APPLE_UNAVAILABLE ? 'APPLE_DOWN' : 'RETRY');
    }
  };

  const handleResult = async (result: AppleAuthorization) => {
    if (result.status === 'CANCELED') return;

    if (result.status === 'FAILED') {
      alert('FAILED');
      return;
    }

    if (result.status === 'SUCCESS' && result.identityToken && result.nonce) {
      await loginToServer({ identityToken: result.identityToken, nonce: result.nonce });
      return;
    }

    alert('RETRY');
  };

  const { mode, isDisabled, authorize } = useAppleAuthorization({ onResult: handleResult });

  return {
    // 애플 로그인을 지원하지 않는 앱 웹뷰는 버튼을 숨긴다
    isVisible: mode !== 'unsupported',
    isDisabled,
    signIn: authorize,
  };
}
