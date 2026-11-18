'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { SupportLink, VerifyResult } from '@/components/signup/verify/VerifyResult/VerifyResult';
import * as styles from '@/components/signup/verify/VerifyResult/verifyResult.css';
import { formatKoreanDay } from '@/utils/date';

const PROVIDER_LABEL: Record<string, string> = {
  KAKAO: '카카오',
  APPLE: 'Apple',
};

export default function VerifyExistingAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = PROVIDER_LABEL[searchParams.get('provider') ?? ''];
  const joinedAt = searchParams.get('joinedAt');

  return (
    <VerifyResult
      title="이미 가입된 계정이 있어요."
      description={'한 사람당 하나의 계정만 만들 수 있어요.\n아래 계정으로 로그인 해 주세요.'}
      link={<SupportLink>내가 가입한 계정이 아니에요</SupportLink>}
      buttonText="기존 계정으로 로그인"
      onButtonClick={() => router.replace('/')}
    >
      {provider && (
        <section className={styles.accountCard}>
          <h2 className={styles.accountProvider}>{provider}로 가입한 계정이 있어요</h2>
          {joinedAt && <p className={styles.accountJoinedAt}>가입일 {formatKoreanDay(joinedAt)}</p>}
        </section>
      )}
    </VerifyResult>
  );
}
