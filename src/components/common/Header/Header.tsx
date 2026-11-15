import clsx from 'clsx';

import * as styles from './header.css';

interface HeaderProps {
  bordered?: boolean;
  isOnDark?: boolean;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function Header({ bordered = false, isOnDark = false, left, center, right }: HeaderProps) {
  return (
    <header className={clsx(styles.headerWrapper({ bordered }), isOnDark && styles.onDark)} aria-label="페이지 헤더">
      <div className={styles.leftElement}>{left}</div>
      <h2 className={styles.centerElement}>{center}</h2>
      <div className={styles.rightElement}>{right}</div>
    </header>
  );
}
