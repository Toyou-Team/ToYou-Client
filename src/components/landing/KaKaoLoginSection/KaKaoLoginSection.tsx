'use client';

import { IcLogoKakao } from '@/assets/icons';
import { startKakaoLogin } from '@/common/apis/auth';
import * as styles from './kakaoLoginSection.css';

export function LoginButtonSection() {
  return (
    <div className={styles.loginButtonSectionWrapper}>
      <button type="button" className={styles.kakaoLoginButton} onClick={startKakaoLogin}>
        <IcLogoKakao className={styles.kakaoLoginIcon} />
        <span className={styles.kakaoLoginButtonText}>카카오로 시작하기</span>
        <span />
      </button>
    </div>
  );
}
