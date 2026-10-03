'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { IcMore } from '@/assets/icons';
import { useConversationQuery, type ConversationMessage } from '@/common/apis/conversation';
import { useBlockConversation } from '@/common/hooks/useBlockConversation';
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
import * as actionSheetStyles from '@/components/signup/profile-image/ImageActionSheet/imageActionSheet.css';
import { formatDay, formatTime } from '@/utils/date';

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
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationQuery(conversationId);
  const openBlockConfirm = useBlockConversation(conversationId);
  const [isReportBlockSheetOpen, setIsReportBlockSheetOpen] = useState(false);

  // 불러오는 동안 잠시 멈췄다가, 끝나면 끝 요소가 아직 보이는지 다시 확인
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  if (!data) return null;

  const { conversation, items } = data;
  // TODO: 목록에서의 신고 대상(사용자 vs 특정 편지) 기획 확정 후 수정. 지금은 가장 최근에 받은 편지를 신고
  const latestReceived = items.find(({ isMine }) => !isMine);
  const closeReportBlockSheet = () => setIsReportBlockSheetOpen(false);

  return (
    <div className={styles.pageWrapper}>
      <Header
        bordered
        left={<BackButton link="/letter-box" />}
        center={<span className={styles.titleText}>{conversation.partner.nickname}</span>}
        right={<IconButton icon={<IcMore />} label="더보기" onClick={() => setIsReportBlockSheetOpen(true)} />}
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
                    {[message.isMine ? '나' : message.sender.nickname, formatTime(message.createdAt)]
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

      <BottomSheet isOpen={isReportBlockSheetOpen} onClose={closeReportBlockSheet}>
        <div className={actionSheetStyles.actionList}>
          {latestReceived && (
            <button
              type="button"
              className={actionSheetStyles.actionButton}
              onClick={() => router.push(`/conversations/${conversationId}/${latestReceived.id}/report`)}
            >
              신고
            </button>
          )}
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
    </div>
  );
}
