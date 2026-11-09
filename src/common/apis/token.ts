import { setAnalyticsUserId } from '@/common/analytics/gtm';

import type { KakaoProfileSuggestion, ReceiveGender, WithdrawalReasonPayload } from './auth';

/**
 * 토큰 저장 정책
 * - Access Token: 메모리에만 (새로고침하면 사라짐)
 * - Refresh Token: localStorage
 * - 가입 플로우용 임시 값: sessionStorage
 */
const isBrowser = () => typeof window !== 'undefined';

let accessToken: string | null = null;
const accessTokenListeners = new Set<() => void>();

const changeAccessToken = (token: string | null) => {
  accessToken = token;
  accessTokenListeners.forEach((listener) => listener());
};

export const accessTokenStore = {
  get: () => accessToken,
  set: (token: string) => changeAccessToken(token),
  clear: () => changeAccessToken(null),
  // 로그인/재발급/로그아웃 때마다 호출
  subscribe: (listener: () => void) => {
    accessTokenListeners.add(listener);
    return () => {
      accessTokenListeners.delete(listener);
    };
  },
};

const webStore = (getStorage: () => Storage, key: string) => ({
  get: () => (isBrowser() ? getStorage().getItem(key) : null),
  set: (value: string) => {
    if (isBrowser()) getStorage().setItem(key, value);
  },
  clear: () => {
    if (isBrowser()) getStorage().removeItem(key);
  },
});

export const refreshTokenStore = webStore(() => window.localStorage, 'toyou_refresh_token');

// 애플 계정은 탈퇴할 때 재인증이 필요하다. 서버 응답에 로그인 수단이 없어 로그인할 때 기록한다
export const loginProviderStore = webStore(() => window.localStorage, 'toyou_login_provider');

// GA4 user_id 로 보내는 회원 ID
export const userIdStore = webStore(() => window.localStorage, 'toyou_user_id');

// 카카오 인증은 됐지만 가입 미완료인 유저가 가입 플로우 동안 들고 다니는 임시 토큰
export const registrationTokenStore = webStore(() => window.sessionStorage, 'toyou_registration_token');

// SIGNUP_REQUIRED 시 받은 카카오 프로필 추천값 (가입 플로우 기본값)
const KAKAO_PROFILE_KEY = 'toyou_kakao_profile';

export const kakaoProfileStore = {
  get: (): KakaoProfileSuggestion | null => {
    if (!isBrowser()) return null;
    const raw = window.sessionStorage.getItem(KAKAO_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as KakaoProfileSuggestion) : null;
  },
  set: (profile: KakaoProfileSuggestion) => {
    if (isBrowser()) window.sessionStorage.setItem(KAKAO_PROFILE_KEY, JSON.stringify(profile));
  },
  clear: () => {
    if (isBrowser()) window.sessionStorage.removeItem(KAKAO_PROFILE_KEY);
  },
};

// 가입 스텝 사이 입력값(닉네임·성별 등)을 들고 다니는 임시 저장소
const SIGNUP_DRAFT_KEY = 'toyou_signup_draft';

export interface SignupDraft {
  nickname?: string;
  nicknameError?: string;
  receiveGender?: ReceiveGender;
  marketingPushAgreed?: boolean;
  nightPushAgreed?: boolean;
}

// 탈퇴 사유 화면에서 고른 값을 확인 화면의 탈퇴 요청까지 들고 감
const WITHDRAWAL_REASON_KEY = 'toyou_withdrawal_reason';

export const withdrawalReasonStore = {
  get: (): WithdrawalReasonPayload => {
    if (!isBrowser()) return {};
    const raw = window.sessionStorage.getItem(WITHDRAWAL_REASON_KEY);
    return raw ? (JSON.parse(raw) as WithdrawalReasonPayload) : {};
  },
  set: (payload: WithdrawalReasonPayload) => {
    if (isBrowser()) window.sessionStorage.setItem(WITHDRAWAL_REASON_KEY, JSON.stringify(payload));
  },
  clear: () => {
    if (isBrowser()) window.sessionStorage.removeItem(WITHDRAWAL_REASON_KEY);
  },
};

export const signupDraftStore = {
  get: (): SignupDraft => {
    if (!isBrowser()) return {};
    const raw = window.sessionStorage.getItem(SIGNUP_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SignupDraft) : {};
  },
  patch: (partial: SignupDraft) => {
    if (!isBrowser()) return;
    window.sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify({ ...signupDraftStore.get(), ...partial }));
  },
  clear: () => {
    if (isBrowser()) window.sessionStorage.removeItem(SIGNUP_DRAFT_KEY);
  },
};

// 랜딩에서 서버가 로그인 여부를 알 수 있게 남기는 표시용 쿠키
export const LOGGED_IN_COOKIE = 'toyou_logged_in';

const loggedInCookie = {
  set: () => {
    if (isBrowser()) document.cookie = `${LOGGED_IN_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  },
  clear: () => {
    if (isBrowser()) document.cookie = `${LOGGED_IN_COOKIE}=; path=/; max-age=0`;
  },
};

// user 는 로그인·가입 응답에만 있다
export const setTokens = ({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken: string;
  refreshToken: string;
  user?: { id: string };
}) => {
  accessTokenStore.set(accessToken);
  refreshTokenStore.set(refreshToken);
  loggedInCookie.set();

  if (user) {
    userIdStore.set(user.id);
    setAnalyticsUserId(user.id);
  }
};

// 로그인 토큰만 지운다. 로그인 복원에 실패해도 진행 중인 가입 정보는 남겨 둔다
export const clearTokens = () => {
  accessTokenStore.clear();
  refreshTokenStore.clear();
  loginProviderStore.clear();
  loggedInCookie.clear();
  userIdStore.clear();
  setAnalyticsUserId(undefined);
};

export const clearSignupData = () => {
  registrationTokenStore.clear();
  kakaoProfileStore.clear();
  signupDraftStore.clear();
};
