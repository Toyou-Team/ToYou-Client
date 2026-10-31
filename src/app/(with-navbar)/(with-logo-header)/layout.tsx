'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header/Header';
import Link from 'next/link';

import * as styles from './layout.css';
import Badge from '@/components/common/Badge/Badge';
import { useProfileQuery } from '@/common/apis/profile';
import { ChocoSheet } from '@/components/choco/ChocoSheet/ChocoSheet';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfileQuery();
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
          profile && (
            <button type="button" aria-label="내 초코 보기" onClick={() => setIsChocoSheetOpen(true)}>
              <Badge count={profile.chocolateBalance} />
            </button>
          )
        }
        isSticky
      />
      {children}

      <ChocoSheet isOpen={isChocoSheetOpen} onClose={() => setIsChocoSheetOpen(false)} />
    </>
  );
}
