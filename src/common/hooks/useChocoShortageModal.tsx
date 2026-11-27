'use client';

import { useConfirmModal } from '@/common/hooks/useConfirmModal';

// 초코가 부족하면 확인 버튼을 막아 둔다
export function useChocoShortageModal() {
  const openConfirm = useConfirmModal();

  return (description: string, chocolateBalance: number) =>
    openConfirm({
      title: '초코가 부족해요',
      description,
      subDescription: (
        <>
          지금은 <strong>초코 {chocolateBalance}개</strong>를 가지고 있어요.
        </>
      ),
      cancelText: '다음에',
      confirmText: '열기',
      confirmDisabled: true,
    });
}
