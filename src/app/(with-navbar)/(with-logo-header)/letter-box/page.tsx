'use client';

import { useEffect, useRef } from 'react';

import { trackEvent } from '@/common/analytics/gtm';
import { useConversationsQuery } from '@/common/apis/conversation';
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll';
import { useLeaveConversation } from '@/common/hooks/useLeaveConversation';
import { ReceivedLetterList } from '@/components/letter-box/ReceivedLetterList/ReceivedLetterList';
import { getPartnerNickname } from '@/utils/partner';

import * as styles from './letter-box.css';

export default function LetterBoxPage() {
  const { data: conversations, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationsQuery();

  const { openLeaveConfirm } = useLeaveConversation();

  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  // 진입 시 한 번, 첫 목록 기준
  const hasTrackedRef = useRef(false);
  useEffect(() => {
    if (!conversations || hasTrackedRef.current) return;

    hasTrackedRef.current = true;
    trackEvent({ event: 'letterbox_view', unread_count: conversations.filter(({ hasUnread }) => hasUnread).length });
  }, [conversations]);

  if (isPending || !conversations) return null;

  return (
    <div className={styles.letterBoxWrapper}>
      <ReceivedLetterList
        conversations={conversations}
        onLeave={({ id, partner }) => openLeaveConfirm(id, getPartnerNickname(partner))}
      />

      {hasNextPage && <div ref={loadMoreRef} aria-hidden />}
    </div>
  );
}
