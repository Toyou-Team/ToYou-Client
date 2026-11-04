// app: iOS 앱 카카오톡(카카오 SDK) 로그인 · redirect: 카카오 로그인 페이지로 이동
export type KakaoLoginMode = 'app' | 'redirect';

export const getKakaoLoginMode = (): KakaoLoginMode =>
  window.ReactNativeWebView && window.TOYOU_APP?.kakaoSignIn === true ? 'app' : 'redirect';

export type KakaoAppResult =
  | { type: 'KAKAO_SIGN_IN_RESULT'; status: 'SUCCESS'; accessToken?: string }
  | { type: 'KAKAO_SIGN_IN_RESULT'; status: 'CANCELED' | 'FAILED' };

export const requestKakaoAppSignIn = () =>
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'KAKAO_SIGN_IN_REQUEST' }));

// 앱이 보낸 JSON 문자열 중 카카오 로그인 결과만 꺼낸다
export const parseKakaoAppResult = (data: unknown): KakaoAppResult | null => {
  if (typeof data !== 'string') return null;

  try {
    const message = JSON.parse(data) as Partial<KakaoAppResult>;
    return message.type === 'KAKAO_SIGN_IN_RESULT' ? (message as KakaoAppResult) : null;
  } catch {
    return null;
  }
};
