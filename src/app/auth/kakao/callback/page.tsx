'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { consumeKakaoState, useKakaoLoginMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { kakaoProfileStore, registrationTokenStore, setTokens } from '@/common/apis/token';

import * as styles from './callback.css';

const BLOCKED_MESSAGE = {
  AGE_VERIFICATION_UNAVAILABLE:
    '카카오 계정에서 연령 확인에 필요한 출생연도와 생일 정보를 확인할 수 없어 가입할 수 없습니다. 카카오 계정 정보와 개인정보 제공 동의를 확인한 후 다시 시도해 주세요.',
  AGE_RESTRICTED: '만 14세 이상만 가입할 수 있어요.',
};

export default function KakaoCallbackPage() {
  const router = useRouter();
  const started = useRef(false);
  const { mutate } = useKakaoLoginMutation();
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const kakaoError = searchParams.get('error');
    const stateOk = consumeKakaoState(searchParams.get('state'));

    // 로그인 취소 · code 없음 · state 불일치 → 다시 로그인
    if (kakaoError || !code || !stateOk) {
      router.replace('/');
      return;
    }

    mutate(code, {
      onSuccess: (result) => {
        switch (result.status) {
          case 'SIGNED_IN':
            setTokens(result);
            router.replace('/home');
            return;
          case 'SIGNUP_REQUIRED':
            registrationTokenStore.set(result.registrationToken);
            kakaoProfileStore.set(result.kakaoProfile);
            router.replace('/signup/terms');
            return;
          case 'SIGNUP_UNAVAILABLE':
            setBlockedMessage(BLOCKED_MESSAGE.AGE_VERIFICATION_UNAVAILABLE);
        }
      },
      onError: (error) => {
        const code = error instanceof ApiError ? error.code : undefined;
        console.error('[kakao login]', code ?? error.name, error.message);

        if (code === AUTH_ERROR_CODE.AGE_RESTRICTED) {
          setBlockedMessage(BLOCKED_MESSAGE.AGE_RESTRICTED);
          return;
        }

        // 인가 코드 만료·카카오 교환 실패 등 → 다시 로그인할 수 있도록 랜딩으로
        router.replace('/');
      },
    });
  }, [router, mutate]);

  if (blockedMessage) {
    return (
      <div className={styles.blocked}>
        <p className={styles.blockedText}>{blockedMessage}</p>
        <button type="button" className={styles.blockedButton} onClick={() => router.replace('/')}>
          돌아가기
        </button>
      </div>
    );
  }

  return <div className={styles.loading}>Loading..</div>;
}
