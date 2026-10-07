'use client';

import type { Restriction } from '@/types/restrictionTypes';
import { formatDateTime } from '@/utils/date';

import * as styles from './restrictionInfoCard.css';

interface RestrictionInfoCardProps {
  restriction: Restriction;
}

export function RestrictionInfoCard({ restriction }: RestrictionInfoCardProps) {
  const { id, reason, level, releaseAt } = restriction;

  const handleCopy = () => navigator.clipboard?.writeText(id);

  return (
    <dl className={styles.card}>
      <div className={styles.idRow}>
        <dt className={styles.label}>제한 번호</dt>
        <dd className={styles.idValue}>
          <span className={styles.value}>{id}</span>
          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            복사
          </button>
        </dd>
      </div>

      <div className={styles.detailList}>
        <div className={styles.row}>
          <dt className={styles.label}>제한 사유</dt>
          <dd className={styles.value}>{reason}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>제한 단계</dt>
          <dd className={styles.value}>{level}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>해제 일시</dt>
          <dd className={styles.value}>{formatDateTime(releaseAt)}</dd>
        </div>
      </div>
    </dl>
  );
}
