'use client';

import { useSyncExternalStore } from 'react';

import { KAKAO_SUPPORT_URL } from '@/constants';

import * as styles from './landingFooter.css';

const subscribe = () => () => {};

const BUSINESS_INFO = [
  { label: '상호', value: 'to you' },
  { label: '대표자', value: '이현호' },
  { label: '사업자등록번호', value: '584-33-01669' },
  { label: '주소', value: '서울특별시 광진구 광나루로38길 65-5, 203호 (구의동, 오로시하우스)' },
];

// 웹 브라우저에서만 표시
export function LandingFooter() {
  const isApp = useSyncExternalStore(
    subscribe,
    () => Boolean(window.ReactNativeWebView),
    () => true,
  );

  if (isApp) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.policyLinks}>
        <a
          href="https://app.notion.com/p/403f64a1311f8158b551ce8971018a1b"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.policyLink}
        >
          이용약관
        </a>
        <a
          href="https://app.notion.com/p/3cbf64a1311f8051b916ce21bb856f13"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.policyLink}
        >
          개인정보처리방침
        </a>
      </div>

      <dl className={styles.infoList}>
        {BUSINESS_INFO.map(({ label, value }) => (
          <div key={label} className={styles.infoRow}>
            <dt>{label}</dt>
            <dd className={styles.infoValue}>{value}</dd>
          </div>
        ))}
        <div className={styles.infoRow}>
          <dt>고객센터</dt>
          <dd className={styles.infoValue}>
            <a href={KAKAO_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
              카카오톡 채널로 문의하기
            </a>
          </dd>
        </div>
      </dl>

      <p className={styles.copyright}>© 2026 To You. All rights reserved.</p>
    </footer>
  );
}
