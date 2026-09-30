'use client';

import { useParams } from 'next/navigation';

import { IcMore } from '@/assets/icons';
import { useConversationQuery, type ConversationMessage } from '@/common/apis/conversation';
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';
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
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationQuery(conversationId);

  // 불러오는 동안 잠시 멈췄다가, 끝나면 끝 요소가 아직 보이는지 다시 확인
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  if (!data) return null;

  const { conversation, items } = data;

  return (
    <div className={styles.pageWrapper}>
      <Header
        bordered
        left={<BackButton link="/letter-box" />}
        center={<span className={styles.titleText}>{conversation.partner.nickname}</span>}
        // TODO: 신고·차단 바텀시트 연결
        right={<IconButton icon={<IcMore />} label="더보기" />}
      />

      {groupByDay(items).map(({ day, messages }) => (
        <section key={day}>
          <h3 className={styles.dayText}>{day}</h3>

          <ul>
            {messages.map((message) => (
              // TODO: 선택 시 편지 전체 보기 연결
              <li key={message.id} className={styles.messageItem}>
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
    </div>
  );
}
