'use client';

import clsx from 'clsx';
import { toast, Toaster } from 'sonner';

import * as styles from './toast.css';

// 메뉴 바(8.8rem) 바로 위
const OFFSET = { bottom: '10rem', left: 0, right: 0 };

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
const getTextSize = ({ length }: string) => (length >= 42 ? 'longest' : length >= 41 ? 'long' : 'default');

const ICONS = {
  success: (
    <svg width="11" height="11" viewBox="2 2 8 8" overflow="visible" fill="none" aria-hidden="true">
      <path
        d="M2 6.2 4.8 9 10 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M.75.75l8.5 8.5M9.25.75l-8.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

interface ToastOptions {
  type?: keyof typeof ICONS;
  // 메뉴 바 없는 화면에서 하단 버튼 위로 올려 표시
  above?: keyof typeof styles.above;
  isExpanding?: boolean;
  // 같은 id 토스트가 떠 있는 동안은 다시 띄우지 않음
  id?: string;
}

export const showToast = (message: string, { type = 'success', above, isExpanding, id }: ToastOptions = {}) => {
  if (id && toast.getToasts().some((item) => item.id === id)) return;

  // 연달아 띄워도 겹치지 않게 마지막 것만 보여준다
  toast.dismiss();

  return toast.custom(
    () => (
      <div
        className={clsx(
          styles.toast,
          styles.textSize[getTextSize(message)],
          above && styles.above[above],
          isExpanding && styles.expand,
        )}
      >
        <span className={styles.content}>
          {ICONS[type]}
          {message}
        </span>
      </div>
    ),
    { id },
  );
};
