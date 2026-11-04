import { request } from './client';
import { refreshTokenStore } from './token';

// 앱 ↔ 웹 메시지 계약: ToYou-Server docs/push-notifications.md

export type PushPlatform = 'IOS' | 'ANDROID';

export type PushTokenResult =
  | { type: 'PUSH_TOKEN_RESULT'; status: 'GRANTED'; token: string; platform: PushPlatform }
  | { type: 'PUSH_TOKEN_RESULT'; status: 'DENIED' | 'FAILED' };

// 푸시를 지원하는 iOS 앱 웹뷰에서만 true
export const isPushAppSupported = () => Boolean(window.ReactNativeWebView) && window.TOYOU_APP?.push === true;

// 처음이면 iOS 알림 권한 창이 뜨고, 이미 답한 사용자는 창 없이 결과만 돌아온다
export const requestPushToken = () =>
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'PUSH_TOKEN_REQUEST' }));

// 앱이 보낸 JSON 문자열 중 푸시 토큰 결과만 꺼낸다
export const parsePushTokenResult = (data: unknown): PushTokenResult | null => {
  if (typeof data !== 'string') return null;

  try {
    const message = JSON.parse(data) as Partial<PushTokenResult>;
    if (message.type !== 'PUSH_TOKEN_RESULT') return null;
    if (message.status === 'GRANTED') return typeof message.token === 'string' ? (message as PushTokenResult) : null;
    return message.status === 'DENIED' || message.status === 'FAILED' ? (message as PushTokenResult) : null;
  } catch {
    return null;
  }
};

// Access Token 은 새로고침하면 사라지므로 Refresh Token 으로 로그인 여부를 본다
export const isLoggedIn = () => refreshTokenStore.get() !== null;

// 현재 기기 토큰 등록. 같은 값을 다시 보내도 안전하다
export const putPushToken = (payload: { token: string; platform: PushPlatform }) =>
  request<{ registered: true }>('put', '/api/v1/push-token', payload);

// 현재 기기 토큰 삭제. 등록된 토큰이 없어도 성공한다
export const deletePushToken = () => request<{ removed: true }>('delete', '/api/v1/push-token');
