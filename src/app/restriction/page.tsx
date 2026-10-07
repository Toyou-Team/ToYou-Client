'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { RestrictionInfoCard } from '@/components/restriction/RestrictionInfoCard/RestrictionInfoCard';
import { KAKAO_CHANNEL_URL, MOCK_RESTRICTION } from '@/constants/restriction';

import * as styles from './restriction.css';

export default function RestrictionPage() {
  const router = useRouter();

  return (
    <div className={styles.pageWrapper}>
      <Header isSticky bordered center={<span className={styles.headerTitle}>이용 제한 안내</span>} />

      <main className={styles.content}>
        <h1 className={styles.title}>
          지금은 투유를
          <br />
          이용할 수 없어요
        </h1>
        <p className={styles.description}>신고 검토 결과, 운영 정책에 어긋나는 내용이 확인되었어요.</p>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>제한 내용</h2>
          <RestrictionInfoCard restriction={MOCK_RESTRICTION} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>제한 기간 동안</h2>

          <span className={styles.infoText}>
            <p className={styles.bodyText}>편지 쓰기/받기/열람, 답장, 더받기를 이용할 수 없어요.</p>
            <p className={styles.subText}>고객센터 문의와 회원 탈퇴는 이용할 수 있어요.</p>
          </span>

          <p className={styles.warningBox}>
            같은 위반이 반복되면 제한 기간이 늘어나거나,
            <br />
            투유를 더 이상 이용할 수 없게 될 수 있어요.
          </p>
        </section>
      </main>

      <div className={styles.bottomWrapper}>
        <Button type="button" onClick={() => router.replace('/home')}>
          확인
        </Button>
        <a className={styles.contactLink} href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          카카오 채널로 문의하기
        </a>
        <p className={styles.contactNotice}>제한번호와 함께 보내주시면 영업일 기준 3일 안에 답변드려요.</p>
      </div>
    </div>
  );
}
