'use client';

import type { ReactNode } from 'react';

import { isServer, MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ApiError } from '@/common/apis/client';
import { ACCOUNT_SUSPENDED } from '@/common/apis/constants/error-code';
import { ModalProvider } from '@/common/providers/ModalProvider';
import { AppToaster } from '@/components/common/Toast/Toast';
import {
  AccountStatusGate,
  ACCOUNT_SUSPENDED_EVENT,
} from '@/components/restriction/AccountStatusGate/AccountStatusGate';

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: notifyIfSuspended }),
    mutationCache: new MutationCache({ onError: notifyIfSuspended }),
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

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        {children}
        <AccountStatusGate />
      </ModalProvider>
      <AppToaster />
    </QueryClientProvider>
  );
}

// 제재로 막힌 요청이면 안내 시트 띄우기
function notifyIfSuspended(error: Error) {
  if (error instanceof ApiError && error.code === ACCOUNT_SUSPENDED) {
    window.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
  }
}
