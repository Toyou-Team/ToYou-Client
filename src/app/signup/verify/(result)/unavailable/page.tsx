'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { SupportLink, VerifyResult } from '@/components/signup/verify/VerifyResult/VerifyResult';
import * as styles from '@/components/signup/verify/VerifyResult/verifyResult.css';
import { formatKoreanDay } from '@/utils/date';

const DATE_ROWS = [
  { label: '탈퇴일', key: 'withdrawnAt' },
  { label: '재가입 가능일', key: 'rejoinAvailableAt' },
];

export default function VerifyUnavailablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 받은 날짜만 표시
  const rows = DATE_ROWS.flatMap(({ label, key }) => {
    const value = searchParams.get(key);
    return value ? [{ label, value: formatKoreanDay(value) }] : [];
  });

  return (
    <VerifyResult
      title="지금은 가입할 수 없어요."
      description="탈퇴한 계정은 일정 기간 동안 다시 가입할 수 없어요."
      link={<SupportLink>고객센터에 문의하기</SupportLink>}
      buttonText="다시 인증하기"
      onButtonClick={() => router.replace('/signup/verify')}
    >
      {rows.length > 0 && (
        <dl className={styles.infoRows}>
          {rows.map(({ label, value }) => (
            <div key={label} className={styles.infoRow}>
              <dt className={styles.infoLabel}>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className={styles.note}>
        {'이용 규정 위반으로 이용이 제한된 경우에도 가입할 수 없어요.\n자세한 내용은 고객센터에 문의해 주세요.'}
      </p>
    </VerifyResult>
  );
}
