'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { IcMore } from '@/assets/icons';
import { ImgMockCard } from '@/assets/imgs';
import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import {
  OPEN_DELIVERY_COST,
  useCurrentDeliveryRoundQuery,
  useOpenDeliveryMutation,
  useReplyReactivationMutation,
} from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
import { Modal } from '@/components/common/Modal/Modal';
import { LetterPaper } from '@/components/letter/LetterPaper/LetterPaper';
import * as actionSheetStyles from '@/components/signup/profile-image/ImageActionSheet/imageActionSheet.css';

import * as styles from './letter.css';

export default function LetterPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const router = useRouter();
  const { open } = useModal();

  const { data: round } = useCurrentDeliveryRoundQuery();
  const { mutate: openDelivery, data: opened, isPending } = useOpenDeliveryMutation();
  const { mutate: reactivateReply, isPending: isReactivating } = useReplyReactivationMutation();
  const [isReportBlockSheetOpen, setIsReportBlockSheetOpen] = useState(false);
  const closeReportBlockSheet = () => setIsReportBlockSheetOpen(false);

  const delivery = round?.deliveries.find(({ id }) => id === deliveryId);
  const letter = opened?.letter ?? delivery?.content;
  const isNotFound = round && !delivery && !opened;

  useEffect(() => {
    if (isNotFound) router.replace('/home');
  }, [isNotFound, router]);

  if (!round || !letter) return null;

  const goToReply = () => router.push(`/write-letter?replyTo=${deliveryId}`);

  const openShortageModal = (purpose: string, cost: number, chocolateBalance: number) => {
    open(({ close }) => (
      <Modal
        title="초코가 부족해요"
        description={`${purpose} 초코 ${cost}개가 필요해요.`}
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
  };

  const handleOpenClick = () => {
    if (round.chocolateBalance < OPEN_DELIVERY_COST) {
      openShortageModal('편지를 열려면', OPEN_DELIVERY_COST, round.chocolateBalance);
      return;
    }

    open(({ close }) => (
      <Modal
        title="편지 열기"
        description="편지를 열면 전체 내용을 볼 수 있어요."
        subDescription={`초코 ${OPEN_DELIVERY_COST}개가 사용돼요.`}
        cancelText="다음에"
        confirmText="열기"
        onConfirm={() => {
          close();
          openDelivery(deliveryId, {
            onError: (error) => {
              if (!(error instanceof ApiError)) return;
              // 배달이 없거나, 탈퇴/차단으로 열 수 없는 편지
              if (error.status === HTTP_STATUS_CODE.NOT_FOUND) {
                open(({ close }) => (
                  <Modal
                    title="편지를 열 수 없어요"
                    description={error.message}
                    confirmText="확인"
                    onConfirm={() => {
                      close();
                      router.replace('/home');
                    }}
                    onClose={close}
                  />
                ));
              }
              if (error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY) {
                openShortageModal('편지를 열려면', OPEN_DELIVERY_COST, round.chocolateBalance);
              }
            },
          });
        }}
        onClose={close}
      />
    ));
  };

  // 답장 기한이 지난 편지는 초코를 써서 기한을 다시 연 뒤 답장한다
  const handleReactivateClick = (cost: number) => {
    if (round.chocolateBalance < cost) {
      openShortageModal('답장 기한을 다시 열려면', cost, round.chocolateBalance);
      return;
    }

    open(({ close }) => (
      <Modal
        title="답장 기한 다시 열기"
        description="답장 기한이 지났어요. 다시 열고 답장할까요?"
        subDescription={`초코 ${cost}개가 사용돼요.`}
        cancelText="다음에"
        confirmText="열기"
        onConfirm={() => {
          close();
          reactivateReply({ deliveryId, idempotencyKey: crypto.randomUUID() }, { onSuccess: goToReply });
        }}
        onClose={close}
      />
    ));
  };

  const renderBottomButton = () => {
    if (!opened) {
      return (
        <Button type="button" disabled={isPending} onClick={handleOpenClick}>
          편지 열기 · 초코 {OPEN_DELIVERY_COST}개
        </Button>
      );
    }

    if (opened.replyStatus === 'AVAILABLE') {
      return (
        <Button type="button" onClick={goToReply}>
          답장하기
        </Button>
      );
    }

    if (opened.replyStatus === 'REACTIVATION_REQUIRED' && opened.replyCost !== null) {
      const cost = opened.replyCost;

      return (
        <Button type="button" disabled={isReactivating} onClick={() => handleReactivateClick(cost)}>
          답장하기 · 초코 {cost}개
        </Button>
      );
    }

    return null;
  };

  return (
    <main className={styles.page} style={{ backgroundImage: `url(${letter.image?.url ?? ImgMockCard.src})` }}>
      <Header
        left={<BackButton />}
        right={<IconButton icon={<IcMore />} label="더보기" onClick={() => setIsReportBlockSheetOpen(true)} />}
      />

      <div className={styles.content}>
        <LetterPaper letter={letter} isPreview={!opened} />

        <div className={styles.bottomButtonWrapper}>{renderBottomButton()}</div>
      </div>

      {/* TODO: 신고·차단 화면 연결 */}
      <BottomSheet isOpen={isReportBlockSheetOpen} onClose={closeReportBlockSheet}>
        <div className={actionSheetStyles.actionList}>
          <button type="button" className={actionSheetStyles.actionButton} onClick={closeReportBlockSheet}>
            신고
          </button>
          <button
            type="button"
            className={clsx(actionSheetStyles.actionButton, actionSheetStyles.deleteButton)}
            onClick={closeReportBlockSheet}
          >
            차단
          </button>
          <button type="button" className={actionSheetStyles.actionButton} onClick={closeReportBlockSheet}>
            취소
          </button>
        </div>
      </BottomSheet>
    </main>
  );
}
