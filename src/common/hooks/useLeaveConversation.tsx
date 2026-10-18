'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import {
  CONVERSATIONS_QUERY_KEY,
  removeConversationFromCache,
  useLeaveConversationMutation,
} from '@/common/apis/conversation';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

// 나가기 확인 모달을 띄우고, 확인하면 대화방을 나간 뒤 편지함 목록으로 이동
export function useLeaveConversation() {
  const router = useRouter();
  const { open } = useModal();
  const queryClient = useQueryClient();
  const { mutate: leave, isPending, isSuccess, error } = useLeaveConversationMutation();

  const isNotFound = (err: Error | null) => err instanceof ApiError && err.status === HTTP_STATUS_CODE.NOT_FOUND;
  const hasLeft = isSuccess || isNotFound(error);

  const leaveAndGoToLetterBox = (conversationId: string) => {
    leave(conversationId, {
      onSuccess: () => {
        removeConversationFromCache(queryClient, conversationId);
        router.replace('/letter-box');
      },
      onError: (error) => {
        if (isNotFound(error)) {
          removeConversationFromCache(queryClient, conversationId);
          queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY, exact: true });
          router.replace('/letter-box');
          return;
        }

        open(({ close }) => (
          <Modal
            title="대화방을 나가지 못했어요"
            description={error.message}
            confirmText="확인"
            onConfirm={close}
            onClose={close}
          />
        ));
      },
    });
  };

  const openLeaveConfirm = (conversationId: string, partnerNickname: string) => {
    if (isPending) return;

    open(({ close }) => (
      <Modal
        title="대화방을 나갈까요?"
        description={`나가면 ${partnerNickname} 님과 주고받은 편지를\n다시 볼 수 없어요.`}
        cancelText="취소"
        confirmText="나가기"
        onConfirm={() => {
          close();
          leaveAndGoToLetterBox(conversationId);
        }}
        onClose={close}
      />
    ));
  };

  return { openLeaveConfirm, hasLeft };
}
