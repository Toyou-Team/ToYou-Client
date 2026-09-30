import { useInfiniteQuery } from '@tanstack/react-query';

import { request } from './client';
import type { DeliverySpotify } from './delivery';
import type { ProfileImage } from './profile';

const PAGE_SIZE = 8;

export interface ConversationPartner {
  id: string;
  nickname: string;
  profileImage: ProfileImage | null;
  isWithdrawn: boolean;
}

export interface ConversationListItem {
  id: string;
  originalLetterId: string;
  partner: ConversationPartner;
  isReadOnly: boolean;
  hasUnread: boolean;
  lastMessage: {
    id: string;
    isMine: boolean;
    preview: string;
    createdAt: string;
  };
}

export interface ConversationList {
  items: ConversationListItem[];
  olderCursor: string | null;
}

export interface ConversationSummary {
  id: string;
  deliveryId: string;
  originalLetterId: string;
  partner: ConversationPartner;
  isReadOnly: boolean;
  canSend: boolean;
  canReactivateReply: boolean;
  replyAvailableUntil: string | null;
  replyCost: number | null;
  hasUnread: boolean;
}

export interface ConversationMessage {
  // ORIGINAL: 처음 배달된 원본 편지, MESSAGE: 대화방에서 주고받은 편지
  type: 'ORIGINAL' | 'MESSAGE';
  id: string;
  sender: ConversationPartner;
  isMine: boolean;
  body: string;
  image: ProfileImage | null;
  spotify: DeliverySpotify | null;
  createdAt: string;
  isUnread: boolean;
}

export interface ConversationDetail {
  conversation: ConversationSummary;
  items: ConversationMessage[];
  olderCursor: string | null;
}

const withCursor = (path: string, cursor: string | null) => {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (cursor) params.set('cursor', cursor);

  return `${path}?${params.toString()}`;
};

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const;

// 편지함 목록 (최신순)
export const getConversations = (cursor: string | null) =>
  request<ConversationList>('get', withCursor('/api/v1/conversations', cursor));

export const useConversationsQuery = () =>
  useInfiniteQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: ({ pageParam }) => getConversations(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.olderCursor,
    select: (data) => data.pages.flatMap((page) => page.items),
  });

// 대화 상세 (최신순)
export const getConversation = (conversationId: string, cursor: string | null) =>
  request<ConversationDetail>('get', withCursor(`/api/v1/conversations/${conversationId}`, cursor));

export const useConversationQuery = (conversationId: string) =>
  useInfiniteQuery({
    queryKey: [...CONVERSATIONS_QUERY_KEY, conversationId],
    queryFn: ({ pageParam }) => getConversation(conversationId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.olderCursor,
    select: (data) => {
      const seen = new Set<string>();

      return {
        conversation: data.pages[0].conversation,
        items: data.pages
          .flatMap((page) => page.items)
          .filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          }),
      };
    },
  });
