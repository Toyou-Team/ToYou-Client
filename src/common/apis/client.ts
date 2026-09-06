import ky, { HTTPError } from 'ky';

import { API_BASE_URL } from './oAuth';

import { HTTP_ERROR_MESSAGE, HTTP_STATUS_CODE } from './constants/http';
import { accessTokenStore } from './token';

interface ApiResponse<T> {
  data: T;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const client = ky.create({
  timeout: 10_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = accessTokenStore.get();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  try {
    const response = await client(`${API_BASE_URL}${path}`, {
      method,
      ...(body === undefined ? {} : { json: body }),
    });

    if (response.status === HTTP_STATUS_CODE.NO_CONTENT) return undefined as T;

    const parsed = (await response.json().catch(() => null)) as ApiResponse<T> | null;
    return parsed?.data as T;
  } catch (error) {
    if (error instanceof HTTPError) {
      const { status } = error.response;
      const payload = (await error.response.json().catch(() => null)) as { message?: string } | null;
      throw new ApiError(status, payload?.message ?? HTTP_ERROR_MESSAGE[status] ?? '요청에 실패했습니다.');
    }
    throw new ApiError(0, '네트워크 연결을 확인해주세요.');
  }
}
