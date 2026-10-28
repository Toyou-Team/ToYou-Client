import clsx from 'clsx';

import * as styles from './header.css';

interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  isSticky?: boolean;
  bordered?: boolean;
  isOnDark?: boolean;
}

export function Header({ left, center, right, isSticky = false, bordered = false, isOnDark = false }: HeaderProps) {
  return (
    <header
      className={clsx(styles.headerWrapper({ isSticky, bordered }), isOnDark && styles.onDark)}
      aria-label="페이지 헤더"
    >
      <div className={styles.leftElement}>{left}</div>
      <h2 className={styles.centerElement}>{center}</h2>
      <div className={styles.rightElement}>{right}</div>
    </header>
  );
}
