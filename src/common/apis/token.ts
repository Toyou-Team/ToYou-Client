import type { Gender, KakaoProfileSuggestion, ReceiveGender } from './auth';

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
  gender?: Gender;
  receiveGender?: ReceiveGender;
  useKakaoProfileImage?: boolean;
  /** 뒤로가기 시 미리보기 복원용. API 로는 전송하지 않는다 (카카오 URL 또는 업로드 이미지 data URL) */
  profileImagePreview?: string;
}

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

export const setTokens = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  accessTokenStore.set(accessToken);
  refreshTokenStore.set(refreshToken);
};

export const clearTokens = () => {
  accessTokenStore.clear();
  refreshTokenStore.clear();
  registrationTokenStore.clear();
  kakaoProfileStore.clear();
  signupDraftStore.clear();
};
