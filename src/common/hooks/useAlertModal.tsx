'use client';

import { useCallback, type ReactNode } from 'react';

import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

interface AlertOptions {
  title: string;
  description?: ReactNode;
  // 확인 버튼을 눌렀을 때만 실행
  onConfirm?: () => void;
  // 확인·ESC 어느 쪽으로 닫아도 실행
  onClose?: () => void;
}

// 확인 버튼 하나짜리 안내 모달
export function useAlertModal() {
  const { open } = useModal();

  return useCallback(
    ({ title, description, onConfirm, onClose }: AlertOptions) =>
      open(({ close }) => {
        const handleClose = () => {
          close();
          onClose?.();
        };

        return (
          <Modal
            title={title}
            description={description}
            confirmText="확인"
            onConfirm={() => {
              handleClose();
              onConfirm?.();
            }}
            onClose={handleClose}
          />
        );
      }),
    [open],
  );
}
