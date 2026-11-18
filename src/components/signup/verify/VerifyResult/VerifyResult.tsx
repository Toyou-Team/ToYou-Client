import type { PropsWithChildren, ReactNode } from 'react';

import Button from '@/components/common/Button/Button';
import { KAKAO_SUPPORT_URL } from '@/constants';

import * as styles from './verifyResult.css';

interface VerifyResultProps {
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  // 버튼 위 밑줄 링크
  link: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

// 본인인증 결과 화면 공통 틀
export function VerifyResult({ title, description, children, link, buttonText, onButtonClick }: VerifyResultProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {children}
      </div>

      <div className={styles.bottomWrapper}>
        {link}
        <Button type="button" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export function SupportLink({ children }: PropsWithChildren) {
  return (
    <a className={styles.link} href={KAKAO_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
