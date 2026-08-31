import type { PropsWithChildren } from 'react';

import * as styles from './layout.css';

export default function NicknameLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.layoutWrapper}>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
