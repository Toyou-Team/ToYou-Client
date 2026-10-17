'use client';

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

export const showToast = (message: string) =>
  toast.custom(() => (
    <div className={styles.toast}>
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
