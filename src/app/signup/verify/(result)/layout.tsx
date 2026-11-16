import { type PropsWithChildren, Suspense } from 'react';

import { BackButton } from '@/components/common/BackButton/BackButton';
import { Header } from '@/components/common/Header/Header';

import * as styles from './layout.css';

// 직전 기록이 KG이니시스 화면이라 뒤로 가기는 본인인증 시작 화면으로
export default function VerifyResultLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header left={<BackButton link="/signup/verify" />} />
      {/* useSearchParams 화면 정적 빌드용 */}
      <main className={styles.mainContent}>
        <Suspense>{children}</Suspense>
      </main>
    </>
  );
}
