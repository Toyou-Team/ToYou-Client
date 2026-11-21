'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { IcLogoApple, IcLogoKakao } from '@/assets/icons';
import { SupportLink, VerifyResult } from '@/components/signup/verify/VerifyResult/VerifyResult';
import * as styles from '@/components/signup/verify/VerifyResult/verifyResult.css';
import { formatKoreanDay } from '@/utils/date';

const PROVIDERS = {
  KAKAO: { label: '카카오', Icon: IcLogoKakao },
  APPLE: { label: '애플', Icon: IcLogoApple },
};

export default function VerifyExistingAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = PROVIDERS[searchParams.get('provider') as keyof typeof PROVIDERS];
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
          <provider.Icon className={styles.accountIcon} aria-hidden />
          <div className={styles.accountText}>
            <h2 className={styles.accountProvider}>{provider.label}로 가입한 계정이 있어요</h2>
            {joinedAt && <p className={styles.accountJoinedAt}>가입일 {formatKoreanDay(joinedAt)}</p>}
          </div>
        </section>
      )}
    </VerifyResult>
  );
}
