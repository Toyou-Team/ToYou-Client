'use client';

import { useEffect, useEffectEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type InfiniteData, type QueryClient, type QueryFilters, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { CONVERSATIONS_QUERY_KEY, removeConversationFromCache } from '@/common/apis/conversation';
import { CURRENT_DELIVERY_ROUND_QUERY_KEY } from '@/common/apis/delivery';
import { API_BASE_URL } from '@/common/apis/oAuth';
import { reissueToken } from '@/common/apis/refresh';
import { accessTokenStore } from '@/common/apis/token';

const CONNECTION_LIMIT = 'REALTIME_CONNECTION_LIMIT';
const CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND';
const LIMIT_RETRY_DELAY = 30_000;

// 이벤트 내용은 쓰지 않고, 보고 있는 화면만 첫 페이지로 다시 조회
const refetchLatestPages = (queryClient: QueryClient, filters: QueryFilters) => {
  const activeFilters = { ...filters, type: 'active' } as const;

  queryClient.setQueriesData<InfiniteData<unknown, unknown>>(
    activeFilters,
    (data) => data && { pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1) },
  );
  return queryClient.refetchQueries(activeFilters);
};

const conversationQueryKey = (conversationId: string) => [...CONVERSATIONS_QUERY_KEY, conversationId];

export function RealtimeSync() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // 차단·나가기로 사라진 대화는 닫는다
  const closeMissingConversations = useEffectEvent(() => {
    const missingIds = queryClient
      .getQueryCache()
      .findAll({ queryKey: CONVERSATIONS_QUERY_KEY, type: 'active' })
      .filter(({ state }) => state.error instanceof ApiError && state.error.code === CONVERSATION_NOT_FOUND)
      .map(({ queryKey }) => queryKey[1])
      .filter((id): id is string => typeof id === 'string');

    if (missingIds.length === 0) return;

    if (
      missingIds.some((id) => pathname.startsWith(`/letter-box/${id}`) || pathname.startsWith(`/conversations/${id}`))
    ) {
      router.replace('/letter-box');
    }
    missingIds.forEach((id) => removeConversationFromCache(queryClient, id));
    queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY, exact: true });
  });

  const resync = useEffectEvent(async () => {
    queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY });
    await refetchLatestPages(queryClient, { queryKey: CONVERSATIONS_QUERY_KEY });
    closeMissingConversations();
  });

  const syncConversation = useEffectEvent(async (conversationId: string) => {
    await Promise.all([
      refetchLatestPages(queryClient, { queryKey: CONVERSATIONS_QUERY_KEY, exact: true }),
      refetchLatestPages(queryClient, { queryKey: conversationQueryKey(conversationId), exact: true }),
    ]);
    closeMissingConversations();
  });

  useEffect(() => {
    // 만료 시 HTTP 쪽에서 이미 새 토큰을 받았는지 비교용
    let connectedToken: string | null = null;
    // 재발급은 연결이 준비될 때까지 한 번만
    let hasReissued = false;
    let limitTimer: ReturnType<typeof setTimeout> | undefined;

    const socket = io(API_BASE_URL, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: false,
      auth: (send) => {
        connectedToken = accessTokenStore.get();
        send({ accessToken: connectedToken });
      },
    });

    const connect = () => {
      clearTimeout(limitTimer);
      if (accessTokenStore.get() && !socket.connected) socket.connect();
    };

    // 재발급되면 토큰 구독으로 다시 연결된다
    const recoverAuth = () => {
      if (accessTokenStore.get() !== connectedToken) {
        connect();
        return;
      }
      if (hasReissued) return;

      hasReissued = true;
      reissueToken().catch(() => undefined);
    };

    const retryAfterLimit = () => {
      clearTimeout(limitTimer);
      limitTimer = setTimeout(connect, LIMIT_RETRY_DELAY);
    };

    socket.on('realtime.ready', () => {
      hasReissued = false;
      resync();
    });
    socket.on('realtime.resync', () => resync());
    socket.on('conversation.changed', (payload: { conversationId?: unknown }) => {
      if (typeof payload?.conversationId === 'string') syncConversation(payload.conversationId);
    });
    socket.on('auth.expired', recoverAuth);
    // 서버가 끊은 연결은 자동으로 재연결되지 않는다
    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect' && accessTokenStore.get() !== connectedToken) connect();
    });
    socket.on('realtime.limit', retryAfterLimit);
    // 그 밖의 오류는 Socket.IO 가 자동으로 재연결한다
    socket.on('connect_error', ({ message }) => {
      if (message === AUTH_ERROR_CODE.TOKEN_INVALID) recoverAuth();
      else if (message === CONNECTION_LIMIT) retryAfterLimit();
    });

    const handleTokenChange = () => {
      if (accessTokenStore.get()) {
        connect();
        return;
      }
      clearTimeout(limitTimer);
      socket.disconnect();
    };

    // 끊겨 있으면 재연결하고, 준비되면(realtime.ready) 다시 조회한다
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !accessTokenStore.get()) return;
      if (socket.connected) resync();
      else connect();
    };

    const unsubscribe = accessTokenStore.subscribe(handleTokenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    connect();

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(limitTimer);
      socket.disconnect();
    };
  }, []);

  return null;
}
