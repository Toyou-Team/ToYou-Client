'use client';

import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';

interface ImageActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeImage: () => void;
  onDeleteImage: () => void;
}

export function ImageActionSheet({ isOpen, onClose, onChangeImage, onDeleteImage }: ImageActionSheetProps) {
  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        { label: '사진 변경', onClick: onChangeImage },
        { label: '사진 삭제', onClick: onDeleteImage, isDanger: true },
      ]}
      closeText="닫기"
    />
  );
}
