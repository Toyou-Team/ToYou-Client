/**
 * 토큰 저장 정책
 * - Access Token: 메모리에만 (새로고침하면 사라짐)
 * - Refresh Token: localStorage
 * - 가입 플로우용 임시 값: sessionStorage
 */
const isBrowser = () => typeof window !== 'undefined';

let accessToken: string | null = null;

export const accessTokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
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

// 카카오 인증은 됐지만 가입 미완료인 유저가 가입 플로우 동안 들고 다니는 임시 토큰
export const registrationTokenStore = webStore(() => window.sessionStorage, 'toyou_registration_token');

// SIGNUP_REQUIRED 시 받은 카카오 프로필 추천값 (가입 플로우 기본값)
const KAKAO_PROFILE_KEY = 'toyou_kakao_profile';

export const kakaoProfileStore = {
  get: (): unknown => {
    if (!isBrowser()) return null;
    const raw = window.sessionStorage.getItem(KAKAO_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set: (profile: unknown) => {
    if (isBrowser()) window.sessionStorage.setItem(KAKAO_PROFILE_KEY, JSON.stringify(profile));
  },
  clear: () => {
    if (isBrowser()) window.sessionStorage.removeItem(KAKAO_PROFILE_KEY);
  },
};

export const setTokens = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  accessTokenStore.set(accessToken);
  refreshTokenStore.set(refreshToken);
};

export const clearTokens = () => {
  accessTokenStore.clear();
  refreshTokenStore.clear();
  registrationTokenStore.clear();
  kakaoProfileStore.clear();
};
