'use client';

import type { AccountSanction } from '@/common/apis/auth';
import { SANCTION_STAGE_LABEL } from '@/constants/restriction';
import { formatDateTime } from '@/utils/date';

import * as styles from './restrictionInfoCard.css';

interface RestrictionInfoCardProps {
  restriction: AccountSanction;
}

export function RestrictionInfoCard({ restriction }: RestrictionInfoCardProps) {
  const { referenceNumber, reason, stage, endsAt } = restriction;

  const handleCopy = () => navigator.clipboard?.writeText(referenceNumber);

  return (
    <dl className={styles.card}>
      <div className={styles.idRow}>
        <dt className={styles.label}>제한 번호</dt>
        <dd className={styles.idValue}>
          <span className={styles.value}>{referenceNumber}</span>
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
          <dd className={styles.value}>{SANCTION_STAGE_LABEL[stage]}</dd>
        </div>
        {/* 영구 정지는 해제 일시 없음 */}
        {endsAt && (
          <div className={styles.row}>
            <dt className={styles.label}>해제 일시</dt>
            <dd className={styles.value}>{formatDateTime(endsAt)}</dd>
          </div>
        )}
      </div>
    </dl>
  );
}
