'use client';

import { useRouter } from 'next/navigation';

import { clearTokens } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { RestrictionInfoCard } from '@/components/restriction/RestrictionInfoCard/RestrictionInfoCard';
import { KAKAO_CHANNEL_URL, MOCK_RESTRICTION } from '@/constants/restriction';

import * as styles from '../restriction.css';

export default function PermanentRestrictionPage() {
  const router = useRouter();

  // 영구 정지는 탈퇴 처리된 상태라 토큰을 지우고 첫 화면으로 보낸다
  const handleConfirm = () => {
    clearTokens();
    router.replace('/');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header isSticky bordered center={<span className={styles.headerTitle}>이용 제한 안내</span>} />

      <main className={styles.content}>
        <h1 className={styles.title}>
          더 이상 투유를
          <br />
          이용할 수 없어요
        </h1>
        <p className={styles.description}>
          운영 정책 위반이 반복되어,
          <br />
          계정이 영구적으로 제한되고 탈퇴 처리되었어요.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>제한 내용</h2>
          <RestrictionInfoCard restriction={MOCK_RESTRICTION} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>알아두세요</h2>
          <p className={styles.bodyText}>
            같은 인증 정보로는 다시 가입할 수 없어요.
            <br />
            남아 있던 편지, 대화, 초코는 모두 삭제되었어요.
          </p>
        </section>
      </main>

      <div className={styles.bottomWrapper}>
        <Button type="button" onClick={handleConfirm}>
          확인
        </Button>
        <a className={styles.contactLink} href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          제한에 이의가 있다면 카카오톡 채널로 문의하기
        </a>
        <p className={styles.contactNotice}>제한 번호와 함께 보내주시면 영업일 기준 3일 안에 답변드려요.</p>
      </div>
    </div>
  );
}
