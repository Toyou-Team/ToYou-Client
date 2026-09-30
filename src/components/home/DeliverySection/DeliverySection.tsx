'use client';

import { useCurrentDeliveryRoundQuery } from '@/common/apis/delivery';
import Button from '@/components/common/Button/Button';
import { ExtraDeliveryButton } from '@/components/home/ExtraDeliveryButton/ExtraDeliveryButton';
import { LetterCarousel } from '@/components/home/LetterCarousel/LetterCarousel';

import * as styles from './deliverySection.css';

export function DeliverySection() {
  const { data: round, isPending, isError, isFetching, refetch } = useCurrentDeliveryRoundQuery();

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
        <Button type="button" outlined disabled={isFetching} onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  const { deliveries } = round;

  return (
    <>
      {deliveries.length > 0 ? (
        <div className={styles.carouselWrapper}>
          {/* TODO: 카드 선택 시 미리보기 화면 연결 */}
          <LetterCarousel deliveries={deliveries} />
        </div>
      ) : (
        <div className={styles.statusWrapper}>
          <p className={styles.statusText}>다음 회차 12시를 기다려주세요.</p>
        </div>
      )}

      <div className={styles.moreButtonWrapper}>
        <ExtraDeliveryButton availability={round.extraAvailability} chocolateBalance={round.chocolateBalance} />
      </div>
    </>
  );
}
