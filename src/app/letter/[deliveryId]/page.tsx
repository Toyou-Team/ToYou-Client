'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { IcMore } from '@/assets/icons';
import { hasErrorCode, hasErrorStatus } from '@/common/apis/client';
import { DELIVERY_AUTHOR_WITHDRAWN } from '@/common/apis/constants/error-code';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { OPEN_DELIVERY_COST, useCurrentDeliveryRoundQuery, useOpenDeliveryMutation } from '@/common/apis/delivery';
import { usePrefetchWritingPrompt } from '@/common/apis/letter';
import { useBlockDelivery } from '@/common/hooks/useBlockConversation';
import { useAlertModal } from '@/common/hooks/useAlertModal';
import { useChocoShortageModal } from '@/common/hooks/useChocoShortageModal';
import { useConfirmModal } from '@/common/hooks/useConfirmModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';
import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
import { LetterPaper } from '@/components/letter/LetterPaper/LetterPaper';
import { countChars } from '@/utils/text';

import * as styles from './letter.css';

export default function LetterPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const router = useRouter();
  const openAlert = useAlertModal();
  const openConfirm = useConfirmModal();
  const openShortageModal = useChocoShortageModal();

  const { data: round } = useCurrentDeliveryRoundQuery();
  const { mutate: openDelivery, data: opened, isPending, isIdle, isError } = useOpenDeliveryMutation();
  const [isReportBlockSheetOpen, setIsReportBlockSheetOpen] = useState(false);
  const closeReportBlockSheet = () => setIsReportBlockSheetOpen(false);
  const openBlockConfirm = useBlockDelivery(deliveryId);
  usePrefetchWritingPrompt();

  const delivery = round?.deliveries.find(({ id }) => id === deliveryId);
  const letter = opened?.letter ?? delivery?.content;
  const isNotFound = round && !delivery && !opened;

  useEffect(() => {
    if (isNotFound) router.replace('/home');
  }, [isNotFound, router]);

  // 이미 연 편지는 다시 열어도 차감이 없어 바로 전체 내용을 받아온다
  const isOpenedCard = Boolean(delivery?.selectedAt) && !opened;
  useEffect(() => {
    if (isOpenedCard && isIdle) openDelivery(deliveryId);
  }, [isOpenedCard, isIdle, openDelivery, deliveryId]);

  if (!round || !letter || (isOpenedCard && !isError)) return null;

  const goToReply = () => router.push(`/write-letter?replyTo=${deliveryId}`);

  // 짧은 편지는 열기 전에도 전체가 보이므로, 열면서 바로 답장한다
  const isShortLetter = delivery?.content.isTruncated === false;
  // 79자를 넘는 분량만 흐리게 표시
  const hiddenLength =
    opened || !delivery?.content.isTruncated ? 0 : delivery.content.bodyLength - countChars(delivery.content.body);

  const openShortage = () =>
    openShortageModal(`편지를 열려면 초코 ${OPEN_DELIVERY_COST}개가 필요해요.`, round.chocolateBalance);

  const handleOpenClick = () => {
    if (round.chocolateBalance < OPEN_DELIVERY_COST) {
      openShortage();
      return;
    }

    openConfirm({
      title: isShortLetter ? '답장하기' : '편지 열기',
      description: isShortLetter ? '편지에 답장할까요?' : '편지를 열면 전체 내용을 볼 수 있어요.',
      subDescription: `초코 ${OPEN_DELIVERY_COST}개가 사용돼요.`,
      cancelText: '다음에',
      confirmText: isShortLetter ? '답장하기' : '열기',
      onConfirm: () =>
        openDelivery(deliveryId, {
          onSuccess: ({ replyStatus }) => {
            if (isShortLetter && replyStatus === 'AVAILABLE') goToReply();
          },
          onError: (error) => {
            // 배달이 없거나, 탈퇴/차단으로 열 수 없는 편지
            if (hasErrorStatus(error, HTTP_STATUS_CODE.NOT_FOUND) || hasErrorCode(error, DELIVERY_AUTHOR_WITHDRAWN)) {
              openAlert({
                title: '편지를 열 수 없어요',
                description: error.message,
                onConfirm: () => router.replace('/home'),
              });
              return;
            }
            if (hasErrorStatus(error, HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)) openShortage();
          },
        }),
    });
  };

  const renderBottomButton = () => {
    if (!opened) {
      return (
        <Button type="button" disabled={isPending || delivery?.content.author.isWithdrawn} onClick={handleOpenClick}>
          {isShortLetter ? '답장하기' : '편지 열기'} · 초코 {OPEN_DELIVERY_COST}개
        </Button>
      );
    }

    // 작성자가 탈퇴/정지했거나 이미 답장한 편지
    return (
      <Button type="button" disabled={opened.replyStatus !== 'AVAILABLE'} onClick={goToReply}>
        답장하기
      </Button>
    );
  };

  return (
    <main className={styles.page} style={letter.image ? { backgroundImage: `url(${letter.image.url})` } : undefined}>
      <Header
        isOnDark={!!letter.image?.isDark}
        left={<BackButton />}
        center={<span className={styles.titleText}>{letter.author.nickname}</span>}
        right={<IconButton icon={<IcMore />} label="더보기" onClick={() => setIsReportBlockSheetOpen(true)} />}
      />

      <div className={styles.content}>
        <div className={styles.letterWrapper}>
          <LetterPaper letter={letter} hiddenLength={hiddenLength} />
        </div>

        <div className={styles.bottomButtonWrapper}>{renderBottomButton()}</div>
      </div>

      <ActionSheet
        isOpen={isReportBlockSheetOpen}
        onClose={closeReportBlockSheet}
        actions={[
          { label: '신고', onClick: () => router.push(`/letter/${deliveryId}/report`) },
          {
            label: '차단',
            isDanger: true,
            onClick: () => {
              closeReportBlockSheet();
              openBlockConfirm();
            },
          },
        ]}
      />
    </main>
  );
}
