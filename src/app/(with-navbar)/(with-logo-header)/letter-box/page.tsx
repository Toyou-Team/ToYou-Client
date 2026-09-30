'use client';

import { useConversationsQuery } from '@/common/apis/conversation';
import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll';
import { ReceivedLetterList } from '@/components/letter-box/ReceivedLetterList/ReceivedLetterList';

import * as styles from './letter-box.css';

export default function LetterBoxPage() {
  const { data: conversations, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useConversationsQuery();

  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  if (isPending || !conversations) return null;

  return (
    <div className={styles.letterBoxWrapper}>
      {/* TODO: 나가기 API 확인 후 연결 */}
      <ReceivedLetterList conversations={conversations} onLeave={() => {}} />

      {hasNextPage && <div ref={loadMoreRef} aria-hidden />}
    </div>
  );
}
