'use client';

import { Header } from '@/components/common/Header/Header';
import Link from 'next/link';

import * as styles from './layout.css';
import Badge from '@/components/common/Badge/Badge';
import { useProfileQuery } from '@/common/apis/profile';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfileQuery();

  return (
    <>
      <Header
        left={
          <Link href="/home" className={styles.headerText}>
            to you
          </Link>
        }
        right={profile && <Badge count={profile.chocolateBalance} />}
        isSticky
      />
      {children}
    </>
  );
}
