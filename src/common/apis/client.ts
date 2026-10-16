import ky, { HTTPError } from 'ky';

import { API_BASE_URL } from './oAuth';

import { HTTP_ERROR_MESSAGE, HTTP_STATUS_CODE } from './constants/http';
import { reissueToken } from './refresh';
import { accessTokenStore, clearTokens } from './token';

interface ApiResponse<T> {
  data: T;
}

// 공통 오류 형식: { error: { code, message, requestId, details } }
interface ErrorPayload {
  error?: { code?: string; message?: string; requestId?: string };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    readonly requestId?: string,
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

    // 401 이면 에러 코드와 상관없이 재발급 후 원 요청을 한 번만 다시 보낸다
    if (status === HTTP_STATUS_CODE.UNAUTHORIZED && auth) {
      if (!retried && (await tryReissueToken())) return dispatch<T>(method, path, body, options, true);

      // 재발급에 실패했거나 새 토큰으로도 401 이면 다시 로그인
      clearTokens();
      redirectToLogin();
    }

    throw new ApiError(status, message, code, requestId);
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
