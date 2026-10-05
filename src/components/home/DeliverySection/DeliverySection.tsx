'use client';

import { useRouter } from 'next/navigation';

import { useCurrentDeliveryRoundQuery, useExtraDeliveryRoundMutation } from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { LetterCarousel } from '@/components/home/LetterCarousel/LetterCarousel';

import * as styles from './deliverySection.css';

export function DeliverySection() {
  const router = useRouter();
  const { open } = useModal();
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
      open(({ close }) => (
        <Modal
          title="받을 수 있는 편지가 없어요"
          description="다음 회차 12시를 기다려주세요."
          confirmText="확인"
          onConfirm={close}
          onClose={close}
        />
      ));
      return;
    }

    if (!available) {
      open(({ close }) => (
        <Modal
          title="초코가 부족해요"
          description={`편지를 새로 받으면 초코 ${cost}개가 필요해요.`}
          subDescription={
            <>
              지금은 <strong>초코 {chocolateBalance}개</strong>를 가지고 있어요.
            </>
          }
          cancelText="다음에"
          confirmText="열기"
          confirmDisabled
          onConfirm={() => {}}
          onClose={close}
        />
      ));
      return;
    }

    open(({ close }) => (
      <Modal
        title="새 카드 받기"
        description="편지 두 장을 새로 받을까요?"
        subDescription={`초코 ${cost}개를 사용해요.`}
        cancelText="다음에"
        confirmText="받기"
        onConfirm={() => {
          close();
          receiveExtra(crypto.randomUUID());
        }}
        onClose={close}
      />
    ));
  };

  return (
    <>
      {deliveries.length > 0 ? (
        <div className={styles.carouselWrapper}>
          <LetterCarousel deliveries={deliveries} onSelect={({ id }) => router.push(`/letter/${id}`)} />
        </div>
      ) : (
        <div className={styles.statusWrapper}>
          <p className={styles.statusText}>다음 회차 12시를 기다려주세요.</p>
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
