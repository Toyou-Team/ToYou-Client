import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginButtonSection } from '@/components/landing/KaKaoLoginSection/KaKaoLoginSection';
import * as styles from './landing.css';
import ImgMockCard from '@/assets/imgs/img_mock_card.png';
import { LetterCard } from '@/components/common/LetterCard/LetterCard';
import { LOGGED_IN_COOKIE } from '@/common/apis/token';

export default async function LandingPage() {
  if ((await cookies()).has(LOGGED_IN_COOKIE)) redirect('/home');

  return (
    <div className={styles.landingPageWrapper}>
      <LetterCard
        width={34.2}
        height={40}
        profileImageSize={4.3}
        backgroundImage={ImgMockCard}
        nickname="샤워젤과 소다수"
        message={`세상에서 가장 느린 산책로
쓰러진 풍경을 사랑하는 게 우리의 재능이지

네 손의 아이스크림과 내 손의 소다수는 맛이...`}
      />

      <h1 className={styles.landingPageTitle}>
        to you
        <span className={styles.landingPageDescription}>오늘, 누군가에게 보내는 마음</span>
      </h1>

      <LoginButtonSection />
    </div>
  );
}
