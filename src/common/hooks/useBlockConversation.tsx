'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useBlockMutation } from '@/common/apis/conversation';
import { CURRENT_DELIVERY_ROUND_QUERY_KEY } from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

// 차단 확인 모달을 띄우고, 확인하면 차단한 뒤 편지함 목록으로 이동
export function useBlockConversation(conversationId: string) {
  const router = useRouter();
  const { open } = useModal();
  const queryClient = useQueryClient();
  const { mutateAsync: block } = useBlockMutation();

  const blockAndLeave = async () => {
    try {
      await block(conversationId);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== HTTP_STATUS_CODE.NOT_FOUND) {
        open(({ close }) => (
          <Modal
            title="차단하지 못했어요"
            description={error instanceof Error ? error.message : undefined}
            confirmText="확인"
            onConfirm={close}
            onClose={close}
          />
        ));
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY });
    router.replace('/letter-box');
  };

  return () =>
    open(({ close }) => (
      <Modal
        title="이 사용자를 차단할까요?"
        description={
          '차단하면 서로 편지와 대화를 나눌 수 없어요.\n한 번 차단하면 다시 해제할 수 없으니\n신중하게 선택해 주세요.'
        }
        cancelText="취소"
        confirmText="차단"
        onConfirm={() => {
          close();
          blockAndLeave();
        }}
        onClose={close}
      />
    ));
}
