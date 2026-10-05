import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from './client';
import { KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY } from './oAuth';
import { clearTokens } from './token';

export type Gender = 'MALE' | 'FEMALE';
export type ReceiveGender = 'MALE' | 'FEMALE' | 'ALL';

// SIGNED_IN 공통 구조 (카카오 로그인·가입 완료 응답이 같은 형식)
export interface SignedInResult {
  status: 'SIGNED_IN';
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}

// 카카오 로그인 시작 · state 검증

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const STATE_KEY = 'toyou_kakao_oauth_state';

// 카카오 로그인 화면으로 이동
export const startKakaoLogin = () => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
    state,
  });

  // 외부(카카오)로 나가는 전체 페이지 이동
  window.location.href = `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

// 콜백에서 받은 state 가 우리가 보낸 값과 같은지 확인 (확인 후 폐기)
export const consumeKakaoState = (received: string | null) => {
  const saved = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return received != null && received === saved;
};

export interface KakaoProfileSuggestion {
  suggestedNickname?: string;
  profileImageUrl?: string;
  gender?: Gender;
}

export type KakaoAuthResult =
  | SignedInResult
  | { status: 'SIGNUP_REQUIRED'; registrationToken: string; kakaoProfile: KakaoProfileSuggestion }
  | { status: 'SIGNUP_UNAVAILABLE'; reason: 'AGE_VERIFICATION_UNAVAILABLE' };

// 카카오 로그인 콜백
export const postKakaoLogin = (authorizationCode: string) =>
  request<KakaoAuthResult>(
    'post',
    '/api/v1/auth/kakao',
    {
      authorizationCode,
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    },
    { auth: false },
  );

export const useKakaoLoginMutation = () => useMutation({ mutationFn: postKakaoLogin });

export interface SignupPayload {
  registrationToken: string;
  nickname: string;
  receiveGender: ReceiveGender;
  useKakaoProfileImage: boolean;
  gender?: Gender;
}

// 회원가입
export const postSignup = (payload: SignupPayload) =>
  request<SignedInResult>('post', '/api/v1/auth/signup', payload, { auth: false });

export const useSignupMutation = () => useMutation({ mutationFn: postSignup });

// 로그아웃
export const postLogout = async () => {
  try {
    await request<void>('post', '/api/v1/auth/logout');
  } finally {
    clearTokens();
  }
};

// 회원 탈퇴 (성공 시 토큰 삭제)
export const deleteAccount = async () => {
  await request<void>('delete', '/api/v1/auth/account');
  clearTokens();
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({ mutationFn: postLogout, onSettled: () => queryClient.clear() });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({ mutationFn: deleteAccount, onSuccess: () => queryClient.clear() });
};
