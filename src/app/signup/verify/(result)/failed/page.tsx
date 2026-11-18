'use client';

import { useRouter } from 'next/navigation';

import { SupportLink, VerifyResult } from '@/components/signup/verify/VerifyResult/VerifyResult';
import * as styles from '@/components/signup/verify/VerifyResult/verifyResult.css';

const FAILURE_CASES = [
  '이름, 생년월일, 휴대폰 번호가 정확하지 않아요',
  '본인 명의가 아닌 휴대폰이에요 (가족, 법인 명의 등)',
  '통신사(알뜰폰 포함)를 다르게 선택했어요',
  '인증 시간이 지났어요',
];

export default function VerifyFailedPage() {
  const router = useRouter();

  return (
    <VerifyResult
      title={'본인인증에\n실패했어요.'}
      description="아래 내용을 확인하고 다시 시도해 주세요."
      link={<SupportLink>계속 실패한다면 고객센터에 문의하기</SupportLink>}
      buttonText="다시 인증하기"
      onButtonClick={() => router.replace('/signup/verify')}
    >
      <section className={styles.infoBox}>
        <h2 className={styles.infoTitle}>이런 경우 인증이 안 될 수 있어요</h2>
        <ul className={styles.infoList}>
          {FAILURE_CASES.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </section>
    </VerifyResult>
  );
}
