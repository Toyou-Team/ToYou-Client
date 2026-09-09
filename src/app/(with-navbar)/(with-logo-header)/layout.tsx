import { Header } from '@/components/common/Header/Header';
import Link from 'next/link';

import * as styles from './layout.css';
import Badge from '@/components/common/Badge/Badge';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        left={
          <Link href="/home" className={styles.headerText}>
            to you
          </Link>
        }
        right={<Badge count={40} />}
        isSticky
      />
      {children}
    </>
  );
}
