import { sendGTMEvent } from '@next/third-parties/google';

import type { Gender } from '@/common/apis/auth';

// GA4 이벤트 명세서 v1. 개인정보·편지 내용은 보내지 않는다

export type ScreenName = 'home' | 'letter-box' | 'write-letter' | 'mypage';
export type LoginMethod = 'kakao' | 'apple';
type AnalyticsGender = Lowercase<Gender>;

export type AnalyticsEvent =
  | { event: 'login'; method: LoginMethod }
  | { event: 'sign_up'; method: LoginMethod; gender?: AnalyticsGender }
  | {
      event: 'onboarding_step_view';
      step_name: 'terms' | 'verify' | 'nickname' | 'receive_gender' | 'profile_image';
      step_index: number;
    }
  | { event: 'choco_badge_click' | 'choco_notify_click'; screen_name: ScreenName }
  | { event: 'tab_click'; tab_name: ScreenName }
  | { event: 'letter_send'; attach_type: 'none' | 'image' | 'music' | 'both' };

const isBrowser = () => typeof window !== 'undefined';

export const trackEvent = (data: AnalyticsEvent) => {
  if (isBrowser()) sendGTMEvent(data);
};

// 성별 미설정이면 undefined
export const toAnalyticsGender = (gender?: Gender | null) => gender?.toLowerCase() as AnalyticsGender | undefined;

// 로그아웃하면 user 없이 호출해 둘 다 지운다
export const setAnalyticsUser = (user?: { id: string; gender?: Gender | null }) => {
  if (isBrowser()) sendGTMEvent({ user_id: user?.id, gender: toAnalyticsGender(user?.gender) });
};

const SCREEN_NAMES: Record<string, ScreenName> = {
  home: 'home',
  'letter-box': 'letter-box',
  mypage: 'mypage',
};

// 마지막으로 본 탭. 편지 쓰기·편지 상세처럼 탭이 아닌 화면에서는 들어오기 전 탭을 쓴다
let currentScreen: ScreenName = 'home';

export const rememberScreen = (pathname: string) => {
  currentScreen = SCREEN_NAMES[pathname.split('/')[1]] ?? currentScreen;
};

export const getScreenName = () => currentScreen;
