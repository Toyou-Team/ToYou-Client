'use client';

import { useEffect, type ReactNode } from 'react';

import { isServer, MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { restoreSession } from '@/common/apis/refresh';
import { ModalProvider } from '@/common/providers/ModalProvider';

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleQueryError }),
    mutationCache: new MutationCache({ onError: handleMutationError }),
    defaultOptions: { queries: { retry: false } },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  // 앱 시작·새로고침 시 refresh token 으로 로그인 복원
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>{children}</ModalProvider>
    </QueryClientProvider>
  );
}

// 중앙 집중 에러 핸들링 방식으로 구현
// 추후 에러 핸들링 로직 추가 예정

async function handleQueryError() {}

async function handleMutationError() {}
