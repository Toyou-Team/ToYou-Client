import { HTTP_STATUS_CODE } from './constants/http';
import { API_BASE_URL } from './oAuth';
import { clearTokens, refreshTokenStore, setTokens } from './token';

interface RefreshResponse {
  data: { accessToken: string; refreshToken: string };
}

// 동시에 여러 요청이 401 을 받아도 refresh 는 하나만 실행하고 나머지는 그 결과를 기다린다.
let inflight: Promise<void> | null = null;

const REFRESH_LOCK = 'toyou_refresh';

// 한 번 쓴 refresh token 은 다시 쓸 수 없어서 다른 탭과도 겹치지 않게 차례로 실행
const runExclusive = async (task: () => Promise<void>) => {
  if (navigator.locks) await navigator.locks.request(REFRESH_LOCK, task);
  else await task();
};

/**
 * Refresh Token 으로 새 Access/Refresh Token 을 발급받아 교체한다.
 * 실패하면 throw. Refresh Token 이 무효일 때만 로그인 토큰을 삭제하고, 진행 중인 가입 정보는 지우지 않는다.
 * client 를 거치지 않고 순수 fetch 사용 (401 인터셉터 무한루프 방지).
 */
export function reissueToken(): Promise<void> {
  if (inflight) return inflight;

  const reissuing = runExclusive(async () => {
    const refreshToken = refreshTokenStore.get();

    if (!refreshToken) {
      clearTokens();
      throw new Error('NO_REFRESH_TOKEN');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      if (response.status === HTTP_STATUS_CODE.UNAUTHORIZED) clearTokens();
      throw new Error('REISSUE_FAILED');
    }

    const json = (await response.json()) as RefreshResponse;
    setTokens(json.data);
  }).finally(() => {
    inflight = null;
  });

  inflight = reissuing;
  return reissuing;
}

/**
 * 앱 시작·새로고침 시 로그인 복원.
 * refresh token 이 있으면 갱신을 시도한다.
 * @returns 로그인 상태면 true, 아니면 false
 */
export async function restoreSession(): Promise<boolean> {
  if (!refreshTokenStore.get()) return false;

  try {
    await reissueToken();
    return true;
  } catch {
    return false;
  }
}
