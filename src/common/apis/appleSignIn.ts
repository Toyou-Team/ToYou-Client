import { parseAppMessage, postAppMessage } from './appBridge';
import { APPLE_WEB_CLIENT_ID, APPLE_WEB_REDIRECT_URI } from './oAuth';

interface AppleSignInResponse {
  authorization: { code: string; id_token?: string; state?: string };
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          redirectURI: string;
          state: string;
          nonce: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
    TOYOU_APP?: { appleSignIn?: boolean; kakaoSignIn?: boolean; push?: boolean; photoPicker?: boolean };
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

// app: iOS 앱 네이티브 로그인 · web: Apple JS 팝업 · unsupported: 애플 로그인을 지원하지 않는 앱 웹뷰
export type AppleLoginMode = 'app' | 'web' | 'unsupported';

export const getAppleLoginMode = (): AppleLoginMode => {
  if (!window.ReactNativeWebView) return 'web';
  return window.TOYOU_APP?.appleSignIn === true ? 'app' : 'unsupported';
};

// iOS 앱

export type AppleAppResult =
  | {
      type: 'APPLE_SIGN_IN_RESULT';
      status: 'SUCCESS';
      identityToken?: string;
      nonce?: string;
      authorizationCode?: string;
    }
  | { type: 'APPLE_SIGN_IN_RESULT'; status: 'CANCELED' | 'FAILED' };

export const requestAppleAppSignIn = () => postAppMessage('APPLE_SIGN_IN_REQUEST');

export const parseAppleAppResult = (data: unknown) => parseAppMessage<AppleAppResult>(data, 'APPLE_SIGN_IN_RESULT');

// 일반 웹

const APPLE_SDK_URL = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

let sdkPromise: Promise<void> | null = null;

// 한 번만 로드하고, 실패하면 다음 시도 때 다시 로드한다
const loadAppleSdk = () => {
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = APPLE_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      sdkPromise = null;
      reject(new Error('Apple SDK load failed'));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
};

const toHex = (buffer: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

export interface AppleWebAttempt {
  nonce: string;
  state: string;
}

// 클릭 후 비동기 작업이 있으면 팝업이 막혀서 nonce·state·init 을 미리 준비한다
export const prepareAppleWebAttempt = async (): Promise<AppleWebAttempt> => {
  await loadAppleSdk();

  const nonce = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const state = crypto.randomUUID();
  const hashedNonce = toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce)));

  window.AppleID?.auth.init({
    clientId: APPLE_WEB_CLIENT_ID,
    redirectURI: APPLE_WEB_REDIRECT_URI,
    state,
    nonce: hashedNonce,
    usePopup: true,
  });

  return { nonce, state };
};

export const signInWithAppleWeb = () => {
  if (!window.AppleID) throw new Error('Apple SDK not loaded');
  return window.AppleID.auth.signIn();
};

// 팝업을 직접 닫거나 취소한 경우
const APPLE_CANCEL_ERRORS = ['user_cancelled_authorize', 'popup_closed_by_user'];

export const isAppleCancelError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  APPLE_CANCEL_ERRORS.includes(String((error as { error?: unknown }).error));
