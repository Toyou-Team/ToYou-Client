'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import type { ChocolateSummary } from '@/common/apis/chocolate';
import { useModal } from '@/common/hooks/useModal';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import { buttonStyle } from '@/components/common/Button/button.css';
import { Modal } from '@/components/common/Modal/Modal';
import { ChocoWeek } from '@/components/choco/ChocoWeek/ChocoWeek';

import * as styles from './chocoSheet.css';

interface ChocoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ChocolateSummary;
}

const pad = (value: number) => String(value).padStart(2, '0');

// 23:39:12
function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.max(0, Math.floor((new Date(to).getTime() - now) / 1000));

  return (
    <time className={styles.rowValue}>
      {pad(Math.floor(seconds / 3600))}:{pad(Math.floor(seconds / 60) % 60)}:{pad(seconds % 60)}
    </time>
  );
}

const isNotificationGranted = () => typeof Notification !== 'undefined' && Notification.permission === 'granted';

export function ChocoSheet({ isOpen, onClose, summary }: ChocoSheetProps) {
  const { open } = useModal();
  const { balance, todayDaily, permanentBalance, firstLetterWrittenAt, dailyGrantAmount, maximumBalance } = summary;

  const hasTodayChoco = todayDaily.remainingAmount > 0;
  const isFirstLetterToday = summary.week.days.some((day) => day.isToday && day.firstLetterBonusGrantedAmount > 0);
  const isOutOfChoco = balance === 0 && todayDaily.grantedAmount > 0 && !hasTodayChoco;
  // 남아 있으면 소멸 시각, 다 썼으면 다음 지급 시각(자정)까지
  const countdownTo = hasTodayChoco ? summary.nextExpirationAt : summary.nextDailyGrantAt;

  // TODO: 충전 알림 신청 API 연결 (신청하면 초코 10개 지급)
  const openNotifyDoneModal = () =>
    open(({ close }) => (
      <Modal
        title="알림 신청 완료"
        description={
          <>
            신청해 주셔서 감사해요.
            <br />
            충전 기능이 열리면 푸시 알림으로 알려드릴게요.
          </>
        }
        subDescription="초코 10개를 선물로 드렸어요."
        confirmText="완료"
        onConfirm={close}
        onClose={close}
      />
    ));

  const handleNotifyClick = () => {
    if (isNotificationGranted()) {
      openNotifyDoneModal();
      return;
    }

    open(({ close }) => (
      <Modal
        title="알림을 켜주세요"
        description="충전 기능이 열리면 가장 먼저 알려드릴게요."
        subDescription="지금 켜면 초코 10개를 선물로 드려요."
        cancelText="다음에"
        confirmText="설정에서 켜기"
        onConfirm={async () => {
          close();
          if (typeof Notification === 'undefined') return;
          if ((await Notification.requestPermission()) === 'granted') openNotifyDoneModal();
        }}
        onClose={close}
      />
    ));
  };

  const [noticeFirstLine, noticeSecondLine] = isFirstLetterToday
    ? ['첫 편지를 보냈어요!', `내일부터 매일 밤 12시에 ${dailyGrantAmount}초코가 채워져요.`]
    : isOutOfChoco
      ? ['오늘 초코를 모두 사용했어요.', '충전 기능이 열리면 가장 먼저 알려드릴게요.']
      : [`매일 밤 12시에 ${dailyGrantAmount}초코가 새로 채워지고,`, `최대 ${maximumBalance}초코까지 가질 수 있어요.`];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="내 초코"
      headerAction={
        <button type="button" className={styles.closeText} onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className={styles.scrollArea}>
        <div className={styles.balance}>
          <span className={styles.balanceTitle}>MY CHOCO</span>
          <p className={styles.balanceAmount}>
            {balance}
            <span className={styles.balanceUnit}>초코</span>
          </p>
        </div>

        <ChocoWeek summary={summary} />

        {!firstLetterWrittenAt ? (
          <>
            <div className={styles.guide}>
              <p className={styles.guideTitle}>오늘 첫 편지를 쓰면 {summary.firstLetterBonusAmount}초코를 받아요</p>
              <p className={styles.guideDescription}>다음 날부터는 매일 밤 12시에 {dailyGrantAmount}초코가 채워져요.</p>
            </div>

            <div className={styles.action}>
              <Link href="/write-letter" className={buttonStyle()}>
                첫 편지 쓰러 가기
              </Link>
            </div>
          </>
        ) : (
          <>
            <ul>
              {todayDaily.grantedAmount > 0 && countdownTo && (
                <li className={styles.row}>
                  <div className={styles.rowText}>
                    <p className={styles.rowTitle}>
                      {hasTodayChoco ? `오늘 받은 ${todayDaily.grantedAmount}초코` : '다음 초코까지'}
                    </p>
                    <p className={styles.rowDescription}>
                      {hasTodayChoco ? '사라지기까지' : `오늘 밤 12시에 ${dailyGrantAmount}초코가 채워져요`}
                    </p>
                  </div>
                  <Countdown to={countdownTo} />
                </li>
              )}

              {/* 첫 편지 초코를 다 쓰면 숨긴다 */}
              {permanentBalance > 0 && (
                <li className={styles.row}>
                  <div className={styles.rowText}>
                    <p className={styles.rowTitle}>첫 편지 선물</p>
                    <p className={styles.rowDescription}>기한 없이 쓸 수 있어요</p>
                  </div>
                  <span className={styles.rowValue}>{permanentBalance}</span>
                </li>
              )}
            </ul>

            <p className={styles.notice}>
              {noticeFirstLine}
              <br />
              {noticeSecondLine}
            </p>

            {isOutOfChoco && (
              <div className={styles.action}>
                <Button type="button" onClick={handleNotifyClick}>
                  충전 열리면 알림 받기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </BottomSheet>
  );
}
