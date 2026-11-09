import { sendGTMEvent } from '@next/third-parties/google';

import type { DeliverySlot } from '@/common/apis/push';

// GA4 이벤트 명세서 v1. 개인정보·편지 내용은 보내지 않는다

export type ScreenName = 'home' | 'letter-box' | 'write-letter' | 'mypage';
export type LoginMethod = 'kakao' | 'apple';

export type AnalyticsEvent =
  | { event: 'login' | 'sign_up'; method: LoginMethod }
  | { event: 'terms_agree'; marketing_opt_in: boolean }
  | { event: 'onboarding_step_view'; step_name: string; step_index: number }
  | {
      event: 'choco_badge_click' | 'choco_notify_click' | 'choco_insufficient' | 'letter_write_start';
      screen_name: ScreenName;
    }
  | { event: 'letterbox_view'; unread_count: number }
  | { event: 'letter_open' | 'letter_more_request'; choco_spent: number }
  | { event: 'letter_send' | 'reply_send'; char_count: number }
  | { event: 'chat_room_open' | 'block_user' }
  | { event: 'notification_permission_result'; result: 'granted' | 'denied' | 'later' }
  | { event: 'push_open'; delivery_slot: DeliverySlot }
  | { event: 'report_submit' | 'account_delete'; reason: string };

const isBrowser = () => typeof window !== 'undefined';

export const trackEvent = (data: AnalyticsEvent) => {
  if (isBrowser()) sendGTMEvent(data);
};

// 로그아웃하면 undefined
export const setAnalyticsUserId = (userId: string | undefined) => {
  if (isBrowser()) sendGTMEvent({ user_id: userId });
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
