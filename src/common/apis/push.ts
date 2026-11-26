import { parseAppMessage, postAppMessage } from './appBridge';
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
export const requestPushToken = () => postAppMessage('PUSH_TOKEN_REQUEST');

export const parsePushTokenResult = (data: unknown) => {
  const message = parseAppMessage<PushTokenResult>(data, 'PUSH_TOKEN_RESULT');
  if (message?.status === 'GRANTED') return typeof message.token === 'string' ? message : null;
  return message?.status === 'DENIED' || message?.status === 'FAILED' ? message : null;
};

// 기기 알림 권한. NOT_DETERMINED 는 아직 iOS 권한 창에 답하지 않은 상태
export type PushPermission = 'GRANTED' | 'DENIED' | 'NOT_DETERMINED';

const PUSH_PERMISSIONS: unknown[] = ['GRANTED', 'DENIED', 'NOT_DETERMINED'] satisfies PushPermission[];

// 권한 창 없이 현재 상태만 묻는다. 앱은 백그라운드에서 돌아올 때도 결과를 보낸다
export const requestPushPermission = () => postAppMessage('PUSH_PERMISSION_REQUEST');

export const parsePushPermissionResult = (data: unknown) => {
  const permission = parseAppMessage<{ type: 'PUSH_PERMISSION_RESULT'; permission?: unknown }>(
    data,
    'PUSH_PERMISSION_RESULT',
  )?.permission;
  return PUSH_PERMISSIONS.includes(permission) ? (permission as PushPermission) : null;
};

// iOS 설정의 to you 화면을 연다. 사용자가 그 안에서 '알림'을 한 번 더 눌러 켠다
export const openNotificationSettings = () => postAppMessage('OPEN_NOTIFICATION_SETTINGS');

// Access Token 은 새로고침하면 사라지므로 Refresh Token 으로 로그인 여부를 본다
export const isLoggedIn = () => refreshTokenStore.get() !== null;

// 현재 기기 토큰 등록. 같은 값을 다시 보내도 안전하다
export const putPushToken = (payload: { token: string; platform: PushPlatform }) =>
  request<{ registered: true }>('put', '/api/v1/push-token', payload);

// 현재 기기 토큰 삭제. 등록된 토큰이 없어도 성공한다
export const deletePushToken = () => request<{ removed: true }>('delete', '/api/v1/push-token');
