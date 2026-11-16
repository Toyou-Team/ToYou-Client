'use client';

import { useRouter } from 'next/navigation';

import { VerifyResult } from '@/components/signup/verify/VerifyResult/VerifyResult';
import * as styles from '@/components/signup/verify/VerifyResult/verifyResult.css';

export default function VerifyUnderagePage() {
  const router = useRouter();

  return (
    <VerifyResult
      title={'만 19세 이상부터\n이용 가능해요.'}
      description={'관련 법령에 따라 만 19세 미만은 가입할 수 없어요.\n만 19세가 되는 날부터 다시 가입할 수 있어요.'}
      link={
        <button type="button" className={styles.link} onClick={() => router.replace('/signup/verify')}>
          생년월일이 잘못 확인됐나요? 다시 인증하기
        </button>
      }
      buttonText="확인"
      onButtonClick={() => router.replace('/')}
    >
      <section className={styles.infoBox}>
        <h2 className={styles.infoTitle}>인증 정보는 저장하지 않았어요</h2>
        <p className={styles.infoText}>방금 입력한 본인인증 정보는 확인 후 바로 삭제돼요</p>
      </section>
    </VerifyResult>
  );
}
