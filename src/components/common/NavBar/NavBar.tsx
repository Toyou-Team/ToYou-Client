'use client';

import { Fragment, useId } from 'react';
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
import { useConversationsQuery } from '@/common/apis/conversation';
import { useCurrentDeliveryRoundQuery } from '@/common/apis/delivery';

const navItems = [
  { href: '/home', label: '홈', icon: <IcHomeNeutral300 />, activeIcon: <IcHomeNeutral900 /> },
  {
    href: '/write-letter',
    label: '편지 쓰기',
    icon: <IcWritingLetterNeutral300 />,
    activeIcon: <IcWritingLetterNeutral900 />,
  },
  { href: '/letter-box', label: '편지함', icon: <IcLetterBoxNeutral300 />, activeIcon: <IcLetterBoxNeutral900 /> },
  { href: '/mypage', label: '마이', icon: <IcUserNeutral300 />, activeIcon: <IcUserNeutral900 /> },
];

export function NavBar() {
  const pathname = usePathname();
  const tooltipId = useId();
  const { data: conversations } = useConversationsQuery();
  const hasUnreadLetter = conversations?.some(({ hasUnread }) => hasUnread) ?? false;

  const { data: round } = useCurrentDeliveryRoundQuery(pathname === '/home');
  const showFirstLetterTooltip = round?.hasWrittenFirstLetter === false;

  return (
    <nav className={styles.navBarWrapper}>
      {navItems.map(({ href, label, icon, activeIcon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const showUnreadDot = href === '/letter-box' && hasUnreadLetter;
        const hasTooltip = href === '/write-letter' && showFirstLetterTooltip;

        return (
          <Fragment key={href}>
            <Link
              href={href}
              className={styles.navItemWrapper}
              aria-label={showUnreadDot ? `${label}, 읽지 않은 편지 있음` : undefined}
              aria-describedby={hasTooltip ? tooltipId : undefined}
            >
              <span className={styles.navItemIcon}>
                {isActive ? activeIcon : icon}
                {showUnreadDot && <span className={styles.unreadDot} />}
              </span>
              <span className={styles.navItemLabel({ isActive })}>{label}</span>
            </Link>

            {hasTooltip && (
              <div id={tooltipId} role="tooltip" className={styles.tooltip}>
                <span>
                  첫 편지 작성 시 <strong className={styles.tooltipStrong}>40초코</strong> 지급
                </span>
              </div>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
