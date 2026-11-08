'use client';

import { IcLogoApple, IcLogoKakao } from '@/assets/icons';
import { useAppleLogin } from '@/common/hooks/useAppleLogin';
import { useKakaoLogin } from '@/common/hooks/useKakaoLogin';
import Button from '@/components/common/Button/Button';
import * as styles from './kakaoLoginSection.css';

export function LoginButtonSection() {
  const kakaoLogin = useKakaoLogin();
  const appleLogin = useAppleLogin();

  return (
    <div className={styles.loginButtonSectionWrapper}>
      <Button
        type="button"
        className={styles.kakaoLoginButton}
        disabled={kakaoLogin.isDisabled}
        onClick={kakaoLogin.signIn}
      >
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
