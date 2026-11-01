'use client';

import { IcLogoApple, IcLogoKakao } from '@/assets/icons';
import { startKakaoLogin } from '@/common/apis/auth';
import { useAppleLogin } from '@/common/hooks/useAppleLogin';
import Button from '@/components/common/Button/Button';
import * as styles from './kakaoLoginSection.css';

export function LoginButtonSection() {
  const appleLogin = useAppleLogin();

  return (
    <div className={styles.loginButtonSectionWrapper}>
      <Button type="button" className={styles.kakaoLoginButton} onClick={startKakaoLogin}>
        <IcLogoKakao className={styles.loginIcon} />
        <span className={styles.loginButtonText}>카카오로 시작하기</span>
        <span />
      </Button>

      {appleLogin.isVisible && (
        <Button
          type="button"
          className={styles.appleLoginButton}
          disabled={appleLogin.isDisabled}
          onClick={appleLogin.signIn}
        >
          <IcLogoApple className={styles.loginIcon} />
          <span className={styles.loginButtonText}>애플로 시작하기</span>
          <span />
        </Button>
      )}
    </div>
  );
}
