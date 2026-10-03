import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { request, retryOnce } from './client';
import type { DeliverySpotify } from './delivery';
import { syncChocolateBalance, type ProfileImage } from './profile';

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
const conversationQueryKey = (conversationId: string) => [...CONVERSATIONS_QUERY_KEY, conversationId];

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
    queryKey: conversationQueryKey(conversationId),
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

// 받은 편지가 화면에 표시된 뒤 읽음 처리
export const postReadMessage = (conversationId: string, messageId: string) =>
  request<{ messageId: string; readAt: string; hasUnread: boolean }>(
    'post',
    `/api/v1/conversations/${conversationId}/read`,
    { messageId },
  );

export const useReadMessageMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => postReadMessage(conversationId, messageId),
    retry: retryOnce,
    onSuccess: ({ messageId, hasUnread }) => {
      queryClient.setQueryData<InfiniteData<ConversationDetail>>(
        conversationQueryKey(conversationId),
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => (item.id === messageId ? { ...item, isUnread: false } : item)),
            })),
          },
      );

      if (!hasUnread) queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY, exact: true });
    },
  });
};

// 후속 편지 답장 권한 재활성화 (5초코)
export const postConversationReactivation = (conversationId: string, idempotencyKey: string) =>
  request<{ conversationId: string; replyAvailableUntil: string; canReply: boolean; chocolateBalance: number }>(
    'post',
    `/api/v1/conversations/${conversationId}/reply-reactivations`,
    undefined,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  );

export const useConversationReactivationMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idempotencyKey: string) => postConversationReactivation(conversationId, idempotencyKey),
    retry: retryOnce,
    onSuccess: ({ chocolateBalance }) => {
      syncChocolateBalance(queryClient, chocolateBalance);
      queryClient.invalidateQueries({ queryKey: conversationQueryKey(conversationId) });
    },
  });
};

export interface SendMessagePayload {
  conversationId: string;
  clientMessageId: string;
  body: string;
  imageObjectKey?: string;
  spotifyTrackId?: string;
}

// 대화방에서 편지 보내기
export const postConversationMessage = ({ conversationId, ...payload }: SendMessagePayload) =>
  request<{ messageId: string }>('post', `/api/v1/conversations/${conversationId}/messages`, payload);

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postConversationMessage,
    retry: retryOnce,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY }),
  });
};

export type ReportReason =
  'SEXUAL_OR_UNCOMFORTABLE_CONTENT' | 'ABUSE_THREAT_OR_HATE' | 'FRAUD_SPAM_OR_PROMOTION' | 'OTHER';

export interface ReportPayload {
  messageId: string;
  reason: ReportReason;
  // 기타(OTHER)는 공백 제외 1~500자 필수, 나머지는 선택
  detail?: string;
}

// 편지 신고
export const postReport = (conversationId: string, payload: ReportPayload) =>
  request<{ reportId: string; alreadyReportedUser: boolean }>(
    'post',
    `/api/v1/conversations/${conversationId}/reports`,
    payload,
  );

export const useReportMutation = (conversationId: string) =>
  useMutation({ mutationFn: (payload: ReportPayload) => postReport(conversationId, payload) });

// 대화 상대 차단 (대화 목록에서 사라짐)
export const postBlock = (conversationId: string) =>
  request<void>('post', `/api/v1/conversations/${conversationId}/block`);

export const useBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postBlock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY }),
  });
};
