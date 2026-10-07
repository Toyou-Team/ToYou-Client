'use client';

import { useRouter } from 'next/navigation';

import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import { formatDateTime } from '@/utils/date';

import * as styles from './restrictionSheet.css';

interface RestrictionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  releaseAt: string;
}

export function RestrictionSheet({ isOpen, onClose, releaseAt }: RestrictionSheetProps) {
  const router = useRouter();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="지금은 이용할 수 없는 기능이에요">
      <div className={styles.content}>
        <p className={styles.description}>
          <strong className={styles.releaseAt}>{formatDateTime(releaseAt)}</strong>부터
          <br />
          다시 이용할 수 있어요.
        </p>

        <div className={styles.buttonWrapper}>
          <Button type="button" onClick={() => router.push('/restriction')}>
            제한 내용 보기
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
