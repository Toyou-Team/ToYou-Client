import { NavBar } from '@/components/common/NavBar/NavBar';

import * as styles from './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
      <NavBar />
    </div>
  );
}
