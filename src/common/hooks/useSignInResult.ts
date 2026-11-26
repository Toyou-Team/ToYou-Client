'use client';

import { useRouter } from 'next/navigation';

import { type LoginMethod, trackEvent } from '@/common/analytics/gtm';
import { type AppleAuthResult, getSignedInPath, type KakaoAuthResult } from '@/common/apis/auth';
import { kakaoProfileStore, loginProviderStore, registrationTokenStore, setTokens } from '@/common/apis/token';
import { useAccountStatusCheck } from '@/common/hooks/useAccountStatusCheck';

// 카카오/애플 로그인 응답 처리. 가입 불가면 false (안내 문구가 화면마다 달라서)
export function useSignInResult() {
  const router = useRouter();
  const checkAccountStatus = useAccountStatusCheck();

  return async (result: KakaoAuthResult | AppleAuthResult, method: LoginMethod) => {
    if (method === 'kakao') loginProviderStore.clear();
    if (result.status === 'SIGNUP_UNAVAILABLE') return false;

    trackEvent({ event: 'login', method });
    if (method === 'apple') loginProviderStore.set('APPLE');

    if (result.status === 'SIGNED_IN') {
      setTokens(result);
      await checkAccountStatus(() => router.replace(getSignedInPath(result)));
    } else {
      registrationTokenStore.set(result.registrationToken);
      kakaoProfileStore.set(result.kakaoProfile);
      router.replace('/signup/terms');
    }
    return true;
  };
}
