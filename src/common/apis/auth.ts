import { useMutation } from '@tanstack/react-query';

import { request } from './client';
import { KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY } from './oAuth';

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
  gender?: 'MALE' | 'FEMALE';
}

// POST /api/v1/auth/kakao 응답 (status 로 분기)
export type KakaoAuthResult =
  | { status: 'SIGNED_IN'; accessToken: string; refreshToken: string; user: { id: string } }
  | { status: 'SIGNUP_REQUIRED'; registrationToken: string; kakaoProfile: KakaoProfileSuggestion }
  | { status: 'SIGNUP_UNAVAILABLE'; reason: 'AGE_VERIFICATION_UNAVAILABLE' };

// 카카오 인가 코드를 백엔드에 넘겨 로그인/가입판정
export const postKakaoLogin = (authorizationCode: string) =>
  request<KakaoAuthResult>('post', '/api/v1/auth/kakao', { authorizationCode });

export const useKakaoLoginMutation = () => useMutation({ mutationFn: postKakaoLogin });
