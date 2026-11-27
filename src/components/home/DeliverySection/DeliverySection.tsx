'use client';

import { useRouter } from 'next/navigation';

import { useCurrentDeliveryRoundQuery, useExtraDeliveryRoundMutation } from '@/common/apis/delivery';
import { useAlertModal } from '@/common/hooks/useAlertModal';
import { useChocoShortageModal } from '@/common/hooks/useChocoShortageModal';
import { useConfirmModal } from '@/common/hooks/useConfirmModal';
import Button from '@/components/common/Button/Button';
import { LetterCarousel } from '@/components/home/LetterCarousel/LetterCarousel';
import { formatNextDeliveryHour } from '@/utils/date';

import * as styles from './deliverySection.css';

export function DeliverySection() {
  const router = useRouter();
  const openAlert = useAlertModal();
  const openConfirm = useConfirmModal();
  const openShortageModal = useChocoShortageModal();
  const { data: round, isPending, isError, isFetching, refetch } = useCurrentDeliveryRoundQuery();
  const { mutate: receiveExtra, isPending: isReceivingExtra } = useExtraDeliveryRoundMutation();

  if (isPending) {
    return (
      <div className={styles.statusWrapper}>
        <p className={styles.statusText}>편지를 가져오고 있어요</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.statusWrapper}>
        <p className={styles.statusText}>편지를 불러오지 못했어요</p>
        <Button type="button" variant="outline" disabled={isFetching} onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  const { deliveries, chocolateBalance } = round;
  const { available, cost, unavailableReason } = round.extraAvailability;

  const handleExtraClick = () => {
    if (unavailableReason === 'INSUFFICIENT_LETTERS') {
      openAlert({
        title: '받을 수 있는 편지가 없어요',
        description: `다음 회차 ${formatNextDeliveryHour()}를 기다려주세요.`,
      });
      return;
    }

    if (!available) {
      openShortageModal(`편지를 새로 받으려면 초코 ${cost}개가 필요해요.`, chocolateBalance);
      return;
    }

    openConfirm({
      title: '새 카드 받기',
      description: '편지 두 장을 새로 받을까요?',
      subDescription: `초코 ${cost}개를 사용해요.`,
      cancelText: '다음에',
      confirmText: '받기',
      onConfirm: () => receiveExtra(crypto.randomUUID()),
    });
  };

  return (
    <>
      {deliveries.length > 0 ? (
        <div className={styles.carouselWrapper}>
          <LetterCarousel deliveries={deliveries} onSelect={({ id }) => router.push(`/letter/${id}`)} />
        </div>
      ) : (
        <div className={styles.statusWrapper}>
          <p className={styles.statusText}>다음 회차 {formatNextDeliveryHour()}를 기다려주세요.</p>
        </div>
      )}

      <div className={styles.moreButtonWrapper}>
        <Button type="button" variant="outline" disabled={isReceivingExtra} onClick={handleExtraClick}>
          더 받기
        </Button>
      </div>
    </>
  );
}
