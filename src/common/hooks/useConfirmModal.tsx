'use client';

import { useCallback, type ReactNode } from 'react';

import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  subDescription?: ReactNode;
  confirmText: string;
  cancelText: string;
  confirmDisabled?: boolean;
  isVertical?: boolean;
  // 확인 버튼을 눌렀을 때 모달을 닫고 실행
  onConfirm?: () => void;
}

// 취소/확인 버튼 두 개짜리 모달
export function useConfirmModal() {
  const { open } = useModal();

  return useCallback(
    ({ onConfirm, ...props }: ConfirmOptions) =>
      open(({ close }) => (
        <Modal
          {...props}
          onConfirm={() => {
            close();
            onConfirm?.();
          }}
          onClose={close}
        />
      )),
    [open],
  );
}
