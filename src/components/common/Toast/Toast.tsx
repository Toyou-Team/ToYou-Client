'use client';

import clsx from 'clsx';
import { toast, Toaster } from 'sonner';

import * as styles from './toast.css';

// 메뉴 바(8.8rem) 바로 위
const OFFSET = { bottom: '10rem' };

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      offset={OFFSET}
      mobileOffset={OFFSET}
      duration={3000}
      toastOptions={{ unstyled: true, className: styles.item }}
    />
  );
}

// 알림 동의·철회 토스트 글자가 화면을 넘지 않도록
const getTextSize = ({ length }: string) => (length >= 45 ? 'longest' : length >= 41 ? 'long' : 'default');

export const showToast = (message: string) => {
  // 연달아 띄워도 겹치지 않게 마지막 것만 보여준다
  toast.dismiss();

  return toast.custom(() => (
    <div className={clsx(styles.toast, styles.textSize[getTextSize(message)])}>
      <span className={styles.content}>
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2 6.2 4.8 9 10 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {message}
      </span>
    </div>
  ));
};
