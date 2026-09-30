'use client';

import { useExtraDeliveryRoundMutation, type ExtraAvailability } from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';

interface ExtraDeliveryButtonProps {
  availability: ExtraAvailability;
  chocolateBalance: number;
}

export function ExtraDeliveryButton({ availability, chocolateBalance }: ExtraDeliveryButtonProps) {
  const { open } = useModal();
  const { mutate: receiveExtra, isPending } = useExtraDeliveryRoundMutation();

  const { available, cost, unavailableReason } = availability;

  const handleClick = () => {
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
    <Button type="button" outlined disabled={isPending} onClick={handleClick}>
      더 받기
    </Button>
  );
}
