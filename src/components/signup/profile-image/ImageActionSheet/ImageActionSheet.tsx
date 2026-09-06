'use client';

import clsx from 'clsx';

import * as styles from './imageActionSheet.css';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';

interface ImageActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeImage: () => void;
  onDeleteImage: () => void;
}

export function ImageActionSheet({ isOpen, onClose, onChangeImage, onDeleteImage }: ImageActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className={styles.actionList}>
        <button type="button" className={styles.actionButton} onClick={onChangeImage}>
          사진 변경
        </button>

        <button type="button" className={clsx(styles.actionButton, styles.deleteButton)} onClick={onDeleteImage}>
          사진 삭제
        </button>

        <button type="button" className={styles.actionButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </BottomSheet>
  );
}
