import { useSyncExternalStore } from 'react';

import { signupDraftStore, type SignupDraft } from '@/common/apis/token';

const subscribe = () => () => {};

// 회원가입 중 이전 단계에서 입력했던 값 다시 불러오기
export function useSignupDraft<K extends keyof SignupDraft>(key: K) {
  return useSyncExternalStore(
    subscribe,
    () => signupDraftStore.get()[key],
    () => undefined,
  );
}
