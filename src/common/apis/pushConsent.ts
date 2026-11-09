import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { request } from './client';

export interface PushConsentState {
  agreed: boolean;
  /** 동의한 시각(ISO). 미동의면 null */
  agreedAt: string | null;
}

// 서비스(정보성)·광고성·야간 알림 설정. 기기 알림 권한(iOS 설정)과는 별개
export interface PushConsents {
  servicePush: { enabled: boolean };
  marketingPush: PushConsentState;
  nightPush: PushConsentState;
}

export interface UpdatePushConsentsPayload {
  servicePushEnabled?: boolean;
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

const applyConsentChange = (
  { servicePush, marketingPush, nightPush }: PushConsents,
  { servicePushEnabled, marketingPushAgreed, nightPushAgreed }: UpdatePushConsentsPayload,
): PushConsents => ({
  servicePush: { enabled: servicePushEnabled ?? servicePush.enabled },
  marketingPush: { ...marketingPush, agreed: marketingPushAgreed ?? marketingPush.agreed },
  nightPush: { ...nightPush, agreed: marketingPushAgreed === false ? false : (nightPushAgreed ?? nightPush.agreed) },
});

const UPDATE_PUSH_CONSENTS_KEY = ['update-push-consents'];

interface UpdatePushConsentsCallbacks {
  onUpdated: (before: PushConsents, after: UpdatedPushConsents) => void;
  onFailed: () => void;
}

// 누르면 바로 반영하고, 요청은 순서대로 보낸다 (광고성 동의 → 야간 동의가 뒤집히지 않게)
export const useUpdatePushConsentsMutation = ({ onUpdated, onFailed }: UpdatePushConsentsCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_PUSH_CONSENTS_KEY,
    scope: { id: 'push-consents' },
    mutationFn: patchPushConsents,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: PUSH_CONSENTS_QUERY_KEY });

      const before = queryClient.getQueryData<PushConsents>(PUSH_CONSENTS_QUERY_KEY);
      if (before) queryClient.setQueryData(PUSH_CONSENTS_QUERY_KEY, applyConsentChange(before, payload));

      return { before };
    },
    onSuccess: (result, _payload, { before }) => {
      const { servicePush, marketingPush, nightPush } = result;

      // 뒤에 남은 요청이 있으면 화면이 되돌아가지 않게 마지막 응답만 반영
      if (queryClient.isMutating({ mutationKey: UPDATE_PUSH_CONSENTS_KEY }) === 1) {
        queryClient.setQueryData<PushConsents>(PUSH_CONSENTS_QUERY_KEY, { servicePush, marketingPush, nightPush });
      }
      if (before) onUpdated(before, result);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: PUSH_CONSENTS_QUERY_KEY });
      onFailed();
    },
  });
};
