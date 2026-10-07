import type { Restriction } from '@/types/restrictionTypes';

// TODO: 투유 카카오톡 채널 주소가 나오면 교체
export const KAKAO_CHANNEL_URL = 'https://pf.kakao.com';

// TODO: 이용 제한 조회 API 가 생기면 교체
export const MOCK_RESTRICTION: Restriction = {
  id: 'R-2026-0012',
  reason: '욕설 · 비하 · 혐오 표현',
  level: '1차: 3일 이용 제한',
  releaseAt: '2026-10-11T19:25:00+09:00',
};
