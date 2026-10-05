'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';

import { IcExit, IcProfileImage } from '@/assets/icons';
import type { ConversationListItem } from '@/common/apis/conversation';
import { buttonStyle } from '@/components/common/Button/button.css';
import { formatRelativeDay } from '@/utils/date';

import * as styles from './receivedLetterList.css';

// 나가기 버튼 너비(6rem)와 맞춤
const ACTION_WIDTH = 60;

interface ReceivedLetterListProps {
  conversations: ConversationListItem[];
  onLeave: (conversationId: string) => void;
}

export function ReceivedLetterList({ conversations, onLeave }: ReceivedLetterListProps) {
  // 나가기 버튼은 한 번에 한 항목만 열어두기
  const [openedId, setOpenedId] = useState<string | null>(null);

  if (conversations.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <p className={styles.emptyText}>주고받은 편지가 없어요.</p>

        <div className={styles.writeLetterButton}>
          <Link href="/write-letter" className={buttonStyle({ variant: 'outline', size: 'medium' })}>
            편지 쓰기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {conversations.map((conversation) => (
        <LetterItem
          key={conversation.id}
          conversation={conversation}
          isOpen={openedId === conversation.id}
          onOpenChange={(isOpen) => setOpenedId(isOpen ? conversation.id : null)}
          onLeave={() => {
            setOpenedId(null);
            onLeave(conversation.id);
          }}
        />
      ))}
    </ul>
  );
}

interface LetterItemProps {
  conversation: ConversationListItem;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLeave: () => void;
}

function LetterItem({ conversation, isOpen, onOpenChange, onLeave }: LetterItemProps) {
  const { id, partner, hasUnread, lastMessage } = conversation;

  const dragStartRef = useRef<{ x: number; offset: number } | null>(null);
  const isDraggedRef = useRef(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const offset = dragOffset ?? (isOpen ? -ACTION_WIDTH : 0);

  const handlePointerDown = (e: PointerEvent) => {
    dragStartRef.current = { x: e.clientX, offset: isOpen ? -ACTION_WIDTH : 0 };
    isDraggedRef.current = false;
  };

  const handlePointerMove = (e: PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;

    const deltaX = e.clientX - start.x;
    if (Math.abs(deltaX) > 5) isDraggedRef.current = true;

    setDragOffset(Math.min(0, Math.max(-ACTION_WIDTH, start.offset + deltaX)));
  };

  const handlePointerUp = () => {
    if (dragOffset !== null) onOpenChange(dragOffset < -ACTION_WIDTH / 2);

    dragStartRef.current = null;
    setDragOffset(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // 드래그했거나 나가기 버튼이 열려 있으면 상세로 이동하지 않는다
    if (isDraggedRef.current || isOpen) {
      e.preventDefault();
      if (!isDraggedRef.current) onOpenChange(false);
    }
  };

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.exitButton}
        style={{ visibility: offset < 0 ? 'visible' : 'hidden' }}
        onClick={onLeave}
      >
        <IcExit />
        나가기
      </button>

      <Link
        href={`/letter-box/${id}`}
        draggable={false}
        className={styles.itemContent({ isDragging: dragOffset !== null })}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        <div className={styles.profileImage}>
          {partner.profileImage ? (
            <img src={partner.profileImage.url} alt={`${partner.nickname}의 프로필`} className={styles.profileImg} />
          ) : (
            <IcProfileImage className={styles.profileImg} />
          )}
        </div>

        <section className={styles.content}>
          <div className={styles.topRow}>
            <span className={styles.nickname}>{partner.nickname}</span>
            <span className={styles.receivedAt}>{formatRelativeDay(lastMessage.createdAt)}</span>
          </div>

          <div className={styles.bottomRow}>
            <p className={styles.message}>{lastMessage.preview}</p>
            {hasUnread && <span className={styles.unreadDot} aria-label="읽지 않음" />}
          </div>
        </section>
      </Link>
    </li>
  );
}
