'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useIdentityVerificationCompleteMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { registrationTokenStore, setTokens } from '@/common/apis/token';

const FAILED_PATH = '/signup/verify/failed';

// 값 있는 항목만 쿼리로 전달
const withQuery = (path: string, params: Record<string, string | null | undefined>) => {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();
  return query ? `${path}?${query}` : path;
};

// KG이니시스 인증 후 서버가 보내는 주소. 결과는 완료 API 응답 기준
export default function SignupVerifyCallbackPage() {
  const router = useRouter();
  // 재호출 시 NOT_PENDING 오류라 한 번만 호출
  const started = useRef(false);
  const { mutate: completeVerification } = useIdentityVerificationCompleteMutation();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const verificationId = searchParams.get('verificationId');
    const registrationToken = registrationTokenStore.get();

    if (!registrationToken) {
      router.replace('/');
      return;
    }
    // 취소·실패·시간 초과
    if (!verificationId || searchParams.get('status') !== 'SUCCESS') {
      router.replace(FAILED_PATH);
      return;
    }

    completeVerification(
      { verificationId, registrationToken },
      {
        onSuccess: (result) => {
          setTokens(result);
          registrationTokenStore.clear();
          // TODO: 온보딩 API 전환 시 온보딩 첫 화면으로 이동
          router.replace('/signup/nickname');
        },
        onError: (error) => {
          const apiError = error instanceof ApiError ? error : undefined;
          const details = apiError?.details;

          switch (apiError?.code) {
            case AUTH_ERROR_CODE.AGE_RESTRICTED:
              router.replace('/signup/verify/underage');
              return;
            case AUTH_ERROR_CODE.ACCOUNT_EXISTS:
              router.replace(
                withQuery('/signup/verify/existing-account', {
                  provider: details?.provider,
                  maskedEmail: details?.maskedEmail,
                  joinedAt: details?.joinedAt,
                }),
              );
              return;
            case AUTH_ERROR_CODE.REJOIN_RESTRICTED:
              router.replace(
                withQuery('/signup/verify/unavailable', {
                  withdrawnAt: details?.withdrawnAt,
                  rejoinAvailableAt: details?.rejoinAvailableAt,
                }),
              );
              return;
            case AUTH_ERROR_CODE.REGISTRATION_TOKEN_INVALID:
              router.replace('/');
              return;
            default:
              router.replace(FAILED_PATH);
          }
        },
      },
    );
  }, [router, completeVerification]);

  return null;
}
