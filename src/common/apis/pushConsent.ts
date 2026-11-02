import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { request } from './client';

export interface PushConsentState {
  agreed: boolean;
  /** 동의한 시각(ISO). 미동의면 null */
  agreedAt: string | null;
}

// 광고성 정보(앱 푸시)·야간 수신 동의. 기기 알림 권한(iOS 설정)과는 별개
export interface PushConsents {
  marketingPush: PushConsentState;
  nightPush: PushConsentState;
}

export interface UpdatePushConsentsPayload {
  marketingPushAgreed?: boolean;
  nightPushAgreed?: boolean;
}

export interface UpdatedPushConsents extends PushConsents {
  /** 처리 시각(ISO). 동의·철회 처리 결과 안내에 표시 */
  processedAt: string;
}

export const PUSH_CONSENTS_QUERY_KEY = ['push-consents'] as const;

// 알림 수신 동의 조회
export const getPushConsents = () => request<PushConsents>('get', '/api/v1/push-consents');

export const usePushConsentsQuery = () =>
  useQuery({
    queryKey: PUSH_CONSENTS_QUERY_KEY,
    queryFn: getPushConsents,
  });

// 보낸 항목만 바꾼다. 광고성을 끄면 서버가 야간도 함께 끈다
export const patchPushConsents = (payload: UpdatePushConsentsPayload) =>
  request<UpdatedPushConsents>('patch', '/api/v1/push-consents', payload);

export const useUpdatePushConsentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPushConsents,
    onSuccess: ({ marketingPush, nightPush }) => {
      queryClient.setQueryData<PushConsents>(PUSH_CONSENTS_QUERY_KEY, { marketingPush, nightPush });
    },
  });
};
