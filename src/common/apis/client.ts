import ky, { HTTPError } from 'ky';

import { API_BASE_URL } from './oAuth';

import { AUTH_ERROR_CODE } from './constants/error-code';
import { HTTP_ERROR_MESSAGE, HTTP_STATUS_CODE } from './constants/http';
import { reissueToken } from './refresh';
import { accessTokenStore, clearTokens, refreshTokenStore } from './token';

interface ApiResponse<T> {
  data: T;
}

// 공통 오류 형식: { error: { code, message, requestId, details } }
interface ErrorDetails {
  // 탈퇴 후 재가입 제한 (AUTH_ACCOUNT_UNAVAILABLE)
  rejoinAvailableAt?: string;
  sanctionReasonTitle?: string | null;
  // 금칙어 (CONTENT_FORBIDDEN_WORD)
  forbiddenWords?: string[];
  // 입력값 오류 (VALIDATION_ERROR)
  fields?: { field: string; messages: string[] }[];
}

interface ErrorPayload {
  error?: { code?: string; message?: string; requestId?: string; details?: ErrorDetails };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    readonly requestId?: string,
    readonly details?: ErrorDetails,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  // Authorization 헤더 첨부 + 401 자동 갱신 대상 여부 (기본 true)
  auth?: boolean;
  headers?: Record<string, string>;
  // ky 기본값은 GET 이 429·5xx 로 실패하면 2번 자동 재시도
  retry?: number;
  // 한 번만 쓸 수 있는 값을 보내는 요청은 재발급 후 같은 요청을 다시 보내지 않는다 (기본 true)
  retryAfterRefresh?: boolean;
}

const client = ky.create({
  timeout: 10_000,
  hooks: {
    beforeRequest: [
      ({ request, options }) => {
        if (options.context.auth === false) return;

        const token = accessTokenStore.get();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

const redirectToLogin = () => {
  // 인터셉터에서 호출되므로 훅을 못 쓴다. 인증 실패 시 모든 상태를 리셋하는 전체 페이지 이동.
  if (typeof window !== 'undefined') window.location.href = '/';
};

const tryReissueToken = () =>
  reissueToken().then(
    () => true,
    () => false,
  );

async function dispatch<T>(
  method: Method,
  path: string,
  body: unknown,
  options: RequestOptions,
  retried: boolean,
): Promise<T> {
  const auth = options.auth ?? true;

  // 새로고침 직후 Access Token 이 없으면 로그인 복원이 끝난 뒤 요청한다
  if (auth && !accessTokenStore.get() && refreshTokenStore.get()) await tryReissueToken();

  try {
    const response = await client(`${API_BASE_URL}${path}`, {
      method,
      headers: options.headers,
      context: { auth },
      ...(options.retry === undefined ? {} : { retry: options.retry }),
      ...(body === undefined ? {} : body instanceof FormData ? { body } : { json: body }),
    });

    if (response.status === HTTP_STATUS_CODE.NO_CONTENT) return undefined as T;

    const parsed = (await response.json().catch(() => null)) as ApiResponse<T> | null;
    return parsed?.data as T;
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      throw new ApiError(HTTP_STATUS_CODE.NETWORK_ERROR, HTTP_ERROR_MESSAGE[HTTP_STATUS_CODE.NETWORK_ERROR]);
    }

    const { status } = error.response;
    // ky v2 는 에러 응답 body 를 미리 읽어 error.data 에 담아 둔다 (response.json() 은 이미 소비돼 실패함)
    const payload = error.data as ErrorPayload | undefined;
    const code = payload?.error?.code;
    const message = payload?.error?.message || HTTP_ERROR_MESSAGE[status] || `요청에 실패했습니다. (${status})`;
    const requestId = payload?.error?.requestId;

    if (status === HTTP_STATUS_CODE.UNAUTHORIZED && auth) {
      // Access Token 만료·무효일 때만 재발급 후 원 요청을 한 번만 다시 보낸다
      const isReissued = code === AUTH_ERROR_CODE.TOKEN_INVALID && !retried && (await tryReissueToken());

      if (isReissued && options.retryAfterRefresh !== false) {
        return dispatch<T>(method, path, body, options, true);
      }

      // 재발급이 서버/네트워크 문제로 실패했으면 토큰이 남아 있어 로그인을 유지한다
      if (!isReissued && (retried || !refreshTokenStore.get())) {
        clearTokens();
        redirectToLogin();
      }
    }

    throw new ApiError(status, message, code, requestId, payload?.error?.details);
  }
}

export function request<T>(method: Method, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  return dispatch<T>(method, path, body, options, false);
}

// 응답을 못 받은 경우(네트워크·5xx)만 같은 요청으로 한 번 재시도
export const retryOnce = (failureCount: number, error: Error) =>
  failureCount < 1 &&
  error instanceof ApiError &&
  (error.status === HTTP_STATUS_CODE.NETWORK_ERROR || error.status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
