'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as styles from './navBar.css';
import {
  IcHomeNeutral300,
  IcHomeNeutral900,
  IcLetterBoxNeutral300,
  IcLetterBoxNeutral900,
  IcUserNeutral300,
  IcUserNeutral900,
  IcWritingLetterNeutral300,
  IcWritingLetterNeutral900,
} from '@/assets/icons';

const navItems = [
  { href: '/home', label: '홈', icon: <IcHomeNeutral300 />, activeIcon: <IcHomeNeutral900 /> },
  {
    href: '/write-letter',
    label: '편지 쓰기',
    icon: <IcWritingLetterNeutral300 />,
    activeIcon: <IcWritingLetterNeutral900 />,
  },
  { href: '/letter-list', label: '편지함', icon: <IcLetterBoxNeutral300 />, activeIcon: <IcLetterBoxNeutral900 /> },
  { href: '/mypage', label: '마이', icon: <IcUserNeutral300 />, activeIcon: <IcUserNeutral900 /> },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navBarWrapper}>
      {navItems.map(({ href, label, icon, activeIcon }) => {
        const isActive = pathname === href;

        return (
          <Link key={href} href={href} className={styles.navItemWrapper}>
            {isActive ? activeIcon : icon}
            <span className={styles.navItemLabel({ isActive })}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
