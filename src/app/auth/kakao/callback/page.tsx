'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { consumeKakaoState, useKakaoLoginMutation } from '@/common/apis/auth';
import { kakaoProfileStore, registrationTokenStore, setTokens } from '@/common/apis/token';

function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const started = useRef(false);
  const { mutate } = useKakaoLoginMutation();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !consumeKakaoState(state)) {
      router.replace('/');
      return;
    }

    mutate(code, {
      onSuccess: (result) => {
        // 기존 회원 → 바로 로그인
        if (result.status === 'SIGNED_IN') {
          setTokens(result);
          router.replace('/home');
          return;
        }

        // 신규 회원 → 임시 토큰 들고 가입 플로우로
        if (result.status === 'SIGNUP_REQUIRED') {
          registrationTokenStore.set(result.registrationToken);
          kakaoProfileStore.set(result.kakaoProfile);
          router.replace('/signup/nickname');
          return;
        }

        // 그 외(SIGNUP_UNAVAILABLE 등) → 가입 불가
        router.replace('/');
      },
      onError: (error) => {
        console.error('[kakao login]', error);
        router.replace('/');
      },
    });
  }, [searchParams, router, mutate]);

  // TODO: 로딩 화면 디자인 나오면 교체
  return <div>Loading..</div>;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <KakaoCallback />
    </Suspense>
  );
}
