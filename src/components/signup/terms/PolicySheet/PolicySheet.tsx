'use client';

import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import * as styles from './policySheet.css';

interface PolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function PolicySheet({ isOpen, onClose, title, content }: PolicySheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerAction={
        <button type="button" className={styles.closeText} onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className={styles.scrollArea}>
        <p className={styles.content}>{content}</p>
      </div>
    </BottomSheet>
  );
}
