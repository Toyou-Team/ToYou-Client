import * as styles from './header.css';

interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  isSticky?: boolean;
  bordered?: boolean;
}

export function Header({ left, center, right, isSticky = false, bordered = false }: HeaderProps) {
  return (
    <header className={styles.headerWrapper({ isSticky, bordered })} aria-label="페이지 헤더">
      <div className={styles.leftElement}>{left}</div>
      <h2 className={styles.centerElement}>{center}</h2>
      <div className={styles.rightElement}>{right}</div>
    </header>
  );
}
