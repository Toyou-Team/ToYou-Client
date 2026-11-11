'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getScreenName, trackEvent } from '@/common/analytics/gtm';
import { useChargeAlertMutation, useChocolateSummaryQuery } from '@/common/apis/chocolate';
import { ApiError } from '@/common/apis/client';
import { ACCOUNT_SUSPENDED, CHARGE_ALERT_CONDITIONS_NOT_MET } from '@/common/apis/constants/error-code';
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
}

const pad = (value: number) => String(value).padStart(2, '0');

// 23:39:12
function Countdown({ to, onEnd }: { to: string; onEnd: () => void }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.max(0, Math.floor((new Date(to).getTime() - now) / 1000));
  const isEnded = seconds === 0;

  useEffect(() => {
    if (isEnded) onEnd();
  }, [isEnded, onEnd]);

  return (
    <time className={styles.rowValue}>
      {pad(Math.floor(seconds / 3600))}:{pad(Math.floor(seconds / 60) % 60)}:{pad(seconds % 60)}
    </time>
  );
}

export function ChocoSheet({ isOpen, onClose }: ChocoSheetProps) {
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
      <ChocoSummary />
    </BottomSheet>
  );
}

// 시트가 열릴 때만 마운트되어 열 때마다 새로 조회한다
function ChocoSummary() {
  const router = useRouter();
  const { open } = useModal();
  const { data: summary, refetch } = useChocolateSummaryQuery();
  const { mutate: requestChargeAlert, isPending: isRequesting } = useChargeAlertMutation();

  if (!summary) return null;

  const { balance, todayDaily, firstLetterBonusRemainingAmount, firstLetterWrittenAt, dailyGrantAmount, chargeAlert } =
    summary;

  const hasTodayChoco = todayDaily.remainingAmount > 0;
  const isFirstLetterToday = summary.week.days.some((day) => day.isToday && day.firstLetterBonusGrantedAmount > 0);
  const isTodayUsedUp = todayDaily.grantedAmount > 0 && !hasTodayChoco;
  const isOutOfChoco = isTodayUsedUp && balance === 0;
  // 신청 선물로 잔액이 생겨도 오늘은 신청 상태를 보여준다
  const showChargeAlert = isOutOfChoco || (isTodayUsedUp && chargeAlert.requested);
  // 남아 있으면 소멸 시각, 다 썼으면 다음 지급 시각(자정)까지
  const countdownTo = hasTodayChoco ? summary.nextExpirationAt : summary.nextDailyGrantAt;

  const openNotifyDoneModal = (grantedAmount: number) =>
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
        subDescription={grantedAmount > 0 ? `초코 ${grantedAmount}개를 선물로 드렸어요.` : undefined}
        confirmText="완료"
        onConfirm={close}
        onClose={close}
      />
    ));

  // 기기 알림/광고성 수신 동의는 설정 화면에서 켠다
  const openTurnOnModal = () =>
    open(({ close }) => (
      <Modal
        title="알림을 켜주세요"
        description="충전 기능이 열리면 가장 먼저 알려드릴게요."
        subDescription="지금 켜면 초코 10개를 선물로 드려요."
        cancelText="다음에"
        confirmText="알림 켜기"
        onConfirm={() => {
          close();
          router.push('/mypage/settings');
        }}
        onClose={() => {
          close();
          trackEvent({ event: 'notification_permission_result', result: 'later' });
        }}
      />
    ));

  const openFailModal = (message: string) =>
    open(({ close }) => (
      <Modal
        title="알림을 신청하지 못했어요"
        description={message}
        confirmText="확인"
        onConfirm={close}
        onClose={close}
      />
    ));

  const handleNotifyClick = () => {
    trackEvent({ event: 'choco_notify_click', screen_name: getScreenName() });

    requestChargeAlert(undefined, {
      onSuccess: ({ grantedAmount }) => openNotifyDoneModal(grantedAmount),
      onError: (error) => {
        // 제재는 공통 안내 시트가 띄워진다
        if (error instanceof ApiError && error.code === ACCOUNT_SUSPENDED) return;
        if (error instanceof ApiError && error.code === CHARGE_ALERT_CONDITIONS_NOT_MET) openTurnOnModal();
        else openFailModal(error.message);
      },
    });
  };

  const [noticeFirstLine, noticeSecondLine] = isFirstLetterToday
    ? ['첫 편지를 보냈어요!', `내일부터 매일 밤 12시에 ${dailyGrantAmount}초코가 채워져요.`]
    : isOutOfChoco
      ? ['오늘 초코를 모두 사용했어요.', '충전 기능이 열리면 가장 먼저 알려드릴게요.']
      : [`매일 밤 12시에 ${dailyGrantAmount}초코가 새로 채워져요.`];

  return (
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
          <ul className={styles.rowList}>
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
                {/* 자정이 지나면 잔액·타이머·이번 주를 새로 받는다 */}
                <Countdown to={countdownTo} onEnd={refetch} />
              </li>
            )}

            {/* 선물 초코는 다 쓰면 숨긴다 */}
            {firstLetterBonusRemainingAmount > 0 && (
              <li className={styles.row}>
                <div className={styles.rowText}>
                  <p className={styles.rowTitle}>첫 편지 선물</p>
                  <p className={styles.rowDescription}>기한 없이 쓸 수 있어요</p>
                </div>
                <span className={styles.rowValue}>{firstLetterBonusRemainingAmount}</span>
              </li>
            )}

            {chargeAlert.giftRemainingAmount > 0 && (
              <li className={styles.row}>
                <div className={styles.rowText}>
                  <p className={styles.rowTitle}>알림 신청 선물</p>
                  <p className={styles.rowDescription}>기한 없이 쓸 수 있어요</p>
                </div>
                <span className={styles.rowValue}>{chargeAlert.giftRemainingAmount}</span>
              </li>
            )}
          </ul>

          {/* 신청을 마치면 안내 없이 버튼만 남는다 */}
          {!(showChargeAlert && chargeAlert.requested) && (
            <p className={styles.notice}>
              {noticeFirstLine}
              {noticeSecondLine && (
                <>
                  <br />
                  {noticeSecondLine}
                </>
              )}
            </p>
          )}

          {showChargeAlert && (
            <div className={styles.action}>
              <Button type="button" disabled={chargeAlert.requested || isRequesting} onClick={handleNotifyClick}>
                {chargeAlert.requested ? '충전 가능할 때 알려드릴게요' : '충전 열리면 알림 받기'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
