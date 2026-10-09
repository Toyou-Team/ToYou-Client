'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { IcMore } from '@/assets/icons';
import { ImgMockCard } from '@/assets/imgs';
import {
  useConversationQuery,
  useConversationReactivationMutation,
  useReadMessageMutation,
} from '@/common/apis/conversation';
import { useReplyReactivationMutation } from '@/common/apis/delivery';
import { useProfileQuery } from '@/common/apis/profile';
import { useBlockConversation } from '@/common/hooks/useBlockConversation';
import { useModal } from '@/common/hooks/useModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
import { Modal } from '@/components/common/Modal/Modal';
import { LetterPaper } from '@/components/letter/LetterPaper/LetterPaper';
import * as actionSheetStyles from '@/components/signup/profile-image/ImageActionSheet/imageActionSheet.css';
import { getPartnerNickname } from '@/utils/partner';

import * as styles from './conversationLetter.css';

export default function ConversationLetterPage() {
  const { conversationId, messageId } = useParams<{ conversationId: string; messageId: string }>();
  const router = useRouter();
  const { open } = useModal();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationQuery(conversationId);
  const { data: profile } = useProfileQuery();
  const { mutate: readMessage } = useReadMessageMutation(conversationId);
  const { mutate: reactivateConversation, isPending: isReactivatingConversation } =
    useConversationReactivationMutation(conversationId);
  const { mutate: reactivateFirstReply, isPending: isReactivatingFirstReply } = useReplyReactivationMutation();

  const [activeId, setActiveId] = useState(messageId);
  const [isReportBlockSheetOpen, setIsReportBlockSheetOpen] = useState(false);
  const openBlockConfirm = useBlockConversation(conversationId);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasPositionedRef = useRef(false);
  const readIdsRef = useRef(new Set<string>());

  const items = data?.items ?? [];
  const activeIndex = Math.max(
    0,
    items.findIndex(({ id }) => id === activeId),
  );
  const activeMessage = items[activeIndex];

  // 처음 선택한 편지 위치에서 시작
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !data || hasPositionedRef.current) return;

    hasPositionedRef.current = true;
    track.scrollLeft = activeIndex * track.clientWidth;
  }, [data, activeIndex]);

  // 받은 편지가 화면에 보이면 읽음 처리 (편지마다 한 번)
  useEffect(() => {
    if (!activeMessage || activeMessage.type !== 'MESSAGE' || activeMessage.isMine || !activeMessage.isUnread) return;
    if (readIdsRef.current.has(activeMessage.id)) return;

    readIdsRef.current.add(activeMessage.id);
    readMessage(activeMessage.id);
  }, [activeMessage, readMessage]);

  // 마지막 편지까지 넘기면 이전 편지를 더 불러오기
  useEffect(() => {
    if (activeIndex === items.length - 1 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [activeIndex, items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!data || !activeMessage) return null;

  const { conversation } = data;
  // 처음 연 편지 뒤에 편지가 더 있으면 살짝 보여줬다가 돌아옴
  const hasNextLetter = items.findIndex(({ id }) => id === messageId) < items.length - 1;
  const closeReportBlockSheet = () => setIsReportBlockSheetOpen(false);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const message = items[Math.round(track.scrollLeft / track.clientWidth)];
    if (message) setActiveId(message.id);
  };

  // 원본 편지에 대한 첫 답장은 배달 기준, 이후 답장은 대화방 기준 API 사용
  const isFirstReply = activeMessage.type === 'ORIGINAL';
  const goToWrite = () =>
    router.push(
      isFirstReply
        ? `/write-letter?replyTo=${conversation.deliveryId}`
        : `/write-letter?conversationId=${conversationId}`,
    );

  const handleReactivateClick = (cost: number) => {
    const chocolateBalance = profile?.chocolateBalance ?? 0;

    if (chocolateBalance < cost) {
      open(({ close }) => (
        <Modal
          title="초코가 부족해요"
          description={`답장 기한을 다시 열려면 초코 ${cost}개가 필요해요.`}
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
        title="답장 기한 다시 열기"
        description="답장 기한이 지났어요. 다시 열고 답장할까요?"
        subDescription={`초코 ${cost}개가 사용돼요.`}
        cancelText="다음에"
        confirmText="열기"
        onConfirm={() => {
          close();
          const idempotencyKey = crypto.randomUUID();

          if (isFirstReply) {
            reactivateFirstReply({ deliveryId: conversation.deliveryId, idempotencyKey }, { onSuccess: goToWrite });
          } else {
            reactivateConversation(idempotencyKey, { onSuccess: goToWrite });
          }
        }}
        onClose={close}
      />
    ));
  };

  // 가장 최근에 받은 편지이고 내 답장 차례면, 그 편지에서는 점 대신 답장 버튼을 보여준다
  const canReplyToLatest =
    !items[0].isMine &&
    !conversation.isReadOnly &&
    (conversation.canSend || (conversation.canReactivateReply && conversation.replyCost !== null));

  const renderReplyButton = () => {
    if (activeIndex !== 0 || !canReplyToLatest) return null;

    if (conversation.canSend) {
      return (
        <Button type="button" onClick={goToWrite}>
          답장하기
        </Button>
      );
    }

    if (conversation.canReactivateReply && conversation.replyCost !== null) {
      const cost = conversation.replyCost;

      return (
        <Button
          type="button"
          disabled={isReactivatingConversation || isReactivatingFirstReply}
          onClick={() => handleReactivateClick(cost)}
        >
          답장하기 · 초코 {cost}개
        </Button>
      );
    }

    return null;
  };

  return (
    <main className={styles.page}>
      <Header
        left={<BackButton />}
        center={<span className={styles.titleText}>{getPartnerNickname(conversation.partner)}</span>}
        right={
          !activeMessage.isMine &&
          !conversation.partner.isWithdrawn && (
            <IconButton icon={<IcMore />} label="더보기" onClick={() => setIsReportBlockSheetOpen(true)} />
          )
        }
      />

      <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
        <div className={clsx(styles.slides, hasNextLetter && styles.peekNext)}>
          {items.map((message, index) => (
            <section
              key={message.id}
              className={clsx(styles.slide, index === 0 && canReplyToLatest && styles.slideWithButton)}
              style={{ backgroundImage: `url(${message.image?.url ?? ImgMockCard.src})` }}
            >
              <LetterPaper letter={message} />

              {items.length > 1 && !(index === 0 && canReplyToLatest) && (
                <div className={styles.dots} aria-hidden>
                  {items.map(({ id }, dotIndex) => (
                    <span key={id} className={clsx(styles.dot, dotIndex === activeIndex && styles.dotActive)} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>{renderReplyButton()}</div>

      <BottomSheet isOpen={isReportBlockSheetOpen} onClose={closeReportBlockSheet}>
        <div className={actionSheetStyles.actionList}>
          <button
            type="button"
            className={actionSheetStyles.actionButton}
            onClick={() => router.push(`/conversations/${conversationId}/${activeMessage.id}/report`)}
          >
            신고
          </button>
          <button
            type="button"
            className={clsx(actionSheetStyles.actionButton, actionSheetStyles.deleteButton)}
            onClick={() => {
              closeReportBlockSheet();
              openBlockConfirm();
            }}
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
