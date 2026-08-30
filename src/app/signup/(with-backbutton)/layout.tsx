import type { PropsWithChildren } from 'react';

import { BackButton } from '@/components/common/BackButton/BackButton';
import * as styles from './layout.css';
import { Header } from '@/components/common/Header/Header';

export default function WithBackButtonLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.layoutWrapper}>
      <Header left={<BackButton />} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
