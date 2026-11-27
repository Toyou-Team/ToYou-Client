'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { hasErrorStatus } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import {
  CONVERSATIONS_QUERY_KEY,
  removeConversationFromCache,
  useLeaveConversationMutation,
} from '@/common/apis/conversation';
import { useAlertModal } from '@/common/hooks/useAlertModal';
import { useConfirmModal } from '@/common/hooks/useConfirmModal';

// 나가기 확인 모달을 띄우고, 확인하면 대화방을 나간 뒤 편지함 목록으로 이동
export function useLeaveConversation() {
  const router = useRouter();
  const openAlert = useAlertModal();
  const openConfirm = useConfirmModal();
  const queryClient = useQueryClient();
  const { mutate: leave, isPending, isSuccess, error } = useLeaveConversationMutation();

  const isNotFound = (err: Error | null) => hasErrorStatus(err, HTTP_STATUS_CODE.NOT_FOUND);
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

        openAlert({ title: '대화방을 나가지 못했어요', description: error.message });
      },
    });
  };

  const openLeaveConfirm = (conversationId: string, partnerNickname: string) => {
    if (isPending) return;

    openConfirm({
      title: '대화방을 나갈까요?',
      description: `나가면 ${partnerNickname} 님과 주고받은 편지를\n다시 볼 수 없어요.`,
      cancelText: '취소',
      confirmText: '나가기',
      onConfirm: () => leaveAndGoToLetterBox(conversationId),
    });
  };

  return { openLeaveConfirm, hasLeft };
}
