'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header/Header';
import Link from 'next/link';
import { getScreenName, trackEvent } from '@/common/analytics/gtm';

import * as styles from './layout.css';
import Badge from '@/components/common/Badge/Badge';
import { useAccountStatusQuery } from '@/common/apis/auth';
import { useProfileQuery } from '@/common/apis/profile';
import { ChocoSheet } from '@/components/choco/ChocoSheet/ChocoSheet';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfileQuery();
  // 제재 중이면 초코뱃지 노출 X, 제한이 풀리면 보인다.
  const { data: accountStatus, isError: isStatusError } = useAccountStatusQuery();
  const showBadge = profile && (accountStatus ? !accountStatus.restricted : isStatusError);
  const [isChocoSheetOpen, setIsChocoSheetOpen] = useState(false);

  return (
    <>
      <Header
        left={
          <Link href="/home" className={styles.headerText}>
            to you
          </Link>
        }
        right={
          showBadge && (
            <button
              type="button"
              aria-label="내 초코 보기"
              onClick={() => {
                trackEvent({ event: 'choco_badge_click', screen_name: getScreenName() });
                setIsChocoSheetOpen(true);
              }}
            >
              <Badge count={profile.chocolateBalance} />
            </button>
          )
        }
      />
      {children}

      <ChocoSheet isOpen={isChocoSheetOpen} onClose={() => setIsChocoSheetOpen(false)} />
    </>
  );
}
