import { parseAppMessage, postAppMessage } from './appBridge';

// app: iOS 앱 카카오톡(카카오 SDK) 로그인 · redirect: 카카오 로그인 페이지로 이동
export type KakaoLoginMode = 'app' | 'redirect';

export const getKakaoLoginMode = (): KakaoLoginMode =>
  window.ReactNativeWebView && window.TOYOU_APP?.kakaoSignIn === true ? 'app' : 'redirect';

export type KakaoAppResult =
  | { type: 'KAKAO_SIGN_IN_RESULT'; status: 'SUCCESS'; accessToken?: string }
  | { type: 'KAKAO_SIGN_IN_RESULT'; status: 'CANCELED' | 'FAILED' };

export const requestKakaoAppSignIn = () => postAppMessage('KAKAO_SIGN_IN_REQUEST');

export const parseKakaoAppResult = (data: unknown) => parseAppMessage<KakaoAppResult>(data, 'KAKAO_SIGN_IN_RESULT');
