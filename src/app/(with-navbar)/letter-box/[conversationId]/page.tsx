'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { IcMore } from '@/assets/icons';
import { useConversationQuery, type ConversationMessage } from '@/common/apis/conversation';
import { useBlockConversation } from '@/common/hooks/useBlockConversation';
import { useLeaveConversation } from '@/common/hooks/useLeaveConversation';
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
import * as actionSheetStyles from '@/components/signup/profile-image/ImageActionSheet/imageActionSheet.css';
import { formatDay, formatTime } from '@/utils/date';
import { getPartnerNickname } from '@/utils/partner';

import * as styles from './conversation.css';

// 최신순 목록을 순서 그대로 날짜별로 묶는다
const groupByDay = (messages: ConversationMessage[]) =>
  messages.reduce<{ day: string; messages: ConversationMessage[] }[]>((groups, message) => {
    const day = formatDay(message.createdAt);
    const lastGroup = groups.at(-1);

    if (lastGroup?.day === day) lastGroup.messages.push(message);
    else groups.push({ day, messages: [message] });

    return groups;
  }, []);

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const { openLeaveConfirm, hasLeft } = useLeaveConversation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationQuery(conversationId, !hasLeft);
  const openBlockConfirm = useBlockConversation(conversationId);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);

  // 불러오는 동안 잠시 멈췄다가, 끝나면 끝 요소가 아직 보이는지 다시 확인
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  if (!data) return null;

  const { conversation, items } = data;
  const closeMenuSheet = () => setIsMenuSheetOpen(false);

  return (
    <div className={styles.pageWrapper}>
      <Header
        bordered
        left={<BackButton link="/letter-box" />}
        center={<span className={styles.titleText}>{getPartnerNickname(conversation.partner)}</span>}
        right={<IconButton icon={<IcMore />} label="더보기" onClick={() => setIsMenuSheetOpen(true)} />}
      />

      {groupByDay(items).map(({ day, messages }) => (
        <section key={day}>
          <h3 className={styles.dayText}>{day}</h3>

          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className={styles.messageItem}
                onClick={() => router.push(`/conversations/${conversationId}/${message.id}`)}
              >
                <div className={styles.messageContent}>
                  <p className={styles.metaText}>
                    {[message.isMine ? '나' : getPartnerNickname(message.sender), formatTime(message.createdAt)]
                      .concat(message.image ? '사진' : [])
                      .join(' • ')}
                  </p>
                  <p className={styles.bodyText}>{message.body}</p>
                </div>

                {message.isUnread && <span className={styles.unreadDot} aria-label="읽지 않음" />}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {hasNextPage && <div ref={loadMoreRef} aria-hidden />}

      <BottomSheet isOpen={isMenuSheetOpen} onClose={closeMenuSheet}>
        <div className={actionSheetStyles.actionList}>
          {/* 탈퇴한 상대는 차단할 대상이 없어 나가기만 제공 */}
          {!conversation.partner.isWithdrawn && (
            <button
              type="button"
              className={actionSheetStyles.actionButton}
              onClick={() => {
                closeMenuSheet();
                openBlockConfirm();
              }}
            >
              차단
            </button>
          )}
          <button
            type="button"
            className={clsx(actionSheetStyles.actionButton, actionSheetStyles.deleteButton)}
            onClick={() => {
              closeMenuSheet();
              openLeaveConfirm(conversationId, getPartnerNickname(conversation.partner));
            }}
          >
            나가기
          </button>
          <button type="button" className={actionSheetStyles.actionButton} onClick={closeMenuSheet}>
            취소
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
