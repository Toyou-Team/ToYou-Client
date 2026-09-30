import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { ApiError, request } from './client';
import { HTTP_STATUS_CODE } from './constants/http';
import { PROFILE_QUERY_KEY, type Profile, type ProfileImage } from './profile';

export interface DeliverySpotify {
  trackId: string;
  title: string;
  artist: string;
  albumImageUrl: string | null;
  externalUrl: string;
}

export interface LetterContent {
  body: string;
  createdAt: string;
  image: ProfileImage | null;
  spotify: DeliverySpotify | null;
  author: {
    nickname: string;
    profileImage: ProfileImage | null;
  };
}

export interface Delivery {
  id: string;
  // null 이면 아직 열지 않은 카드
  selectedAt: string | null;
  content: LetterContent;
}

export interface ExtraAvailability {
  available: boolean;
  cost: number;
  unavailableReason: 'INSUFFICIENT_CHOCOLATE' | 'INSUFFICIENT_LETTERS' | null;
}

export interface CurrentDeliveryRound {
  chocolateBalance: number;
  status: 'DELIVERED' | 'EMPTY';
  deliveries: Delivery[];
  extraAvailability: ExtraAvailability;
}

export interface ExtraDeliveryRound {
  deliveries: Delivery[];
  chocolateBalance: number;
  extraAvailability: ExtraAvailability;
}

export interface OpenedDelivery {
  deliveryId: string;
  conversationId: string;
  selectedAt: string;
  replyAvailableUntil: string;
  replyStatus: 'AVAILABLE' | 'REACTIVATION_REQUIRED' | 'UNAVAILABLE';
  replyCost: number | null;
  chocolateBalance: number;
  letter: LetterContent & { id: string };
}

export interface CreateReplyPayload {
  deliveryId: string;
  clientMessageId: string;
  body: string;
  imageObjectKey?: string;
  spotifyTrackId?: string;
}

export interface CreatedReply {
  conversationId: string;
  message: {
    id: string;
    clientMessageId: string;
    senderId: string;
    body: string;
    spotify: DeliverySpotify | null;
    createdAt: string;
  };
}

export interface ReplyReactivation {
  replyAvailableUntil: string;
  canReply: boolean;
  chocolateBalance: number;
}

export const OPEN_DELIVERY_COST = 5;

export const CURRENT_DELIVERY_ROUND_QUERY_KEY = ['delivery-rounds', 'current'] as const;

const syncChocolateBalance = (queryClient: QueryClient, chocolateBalance: number) =>
  queryClient.setQueryData<Profile>(PROFILE_QUERY_KEY, (profile) => profile && { ...profile, chocolateBalance });

// 응답을 못 받은 경우(네트워크·5xx)만 같은 요청으로 한 번 재시도
const retryOnce = (failureCount: number, error: Error) =>
  failureCount < 1 &&
  error instanceof ApiError &&
  (error.status === HTTP_STATUS_CODE.NETWORK_ERROR || error.status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);

// 배달 없음·접근 불가·잔액/후보 부족은 홈 상태가 바뀐 것이므로 다시 불러온다
const isStaleRoundError = (error: Error) =>
  error instanceof ApiError &&
  (error.status === HTTP_STATUS_CODE.NOT_FOUND || error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY);

// 홈 배달 상태 조회
export const postCurrentDeliveryRound = () => request<CurrentDeliveryRound>('post', '/api/v1/delivery-rounds/current');

export const useCurrentDeliveryRoundQuery = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY,
    queryFn: async () => {
      const round = await postCurrentDeliveryRound();
      syncChocolateBalance(queryClient, round.chocolateBalance);
      return round;
    },
  });
};

// 더받기
export const postExtraDeliveryRound = (idempotencyKey: string) =>
  request<ExtraDeliveryRound>('post', '/api/v1/delivery-rounds/extra', undefined, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const useExtraDeliveryRoundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postExtraDeliveryRound,
    retry: retryOnce,
    onSuccess: ({ deliveries, chocolateBalance, extraAvailability }) => {
      queryClient.setQueryData<CurrentDeliveryRound>(
        CURRENT_DELIVERY_ROUND_QUERY_KEY,
        (round) =>
          round && {
            ...round,
            chocolateBalance,
            extraAvailability,
            deliveries: [...deliveries, ...round.deliveries],
          },
      );
      syncChocolateBalance(queryClient, chocolateBalance);
    },
    onError: (error) => {
      if (isStaleRoundError(error)) queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY });
    },
  });
};

// 편지 선택·열람 (최초 1회만 초코 차감)
export const postOpenDelivery = (deliveryId: string) =>
  request<OpenedDelivery>('post', `/api/v1/deliveries/${deliveryId}/open`);

export const useOpenDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postOpenDelivery,
    retry: retryOnce,
    onSuccess: ({ chocolateBalance }) => {
      syncChocolateBalance(queryClient, chocolateBalance);
      queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY });
    },
    onError: (error) => {
      if (isStaleRoundError(error)) queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY });
    },
  });
};

// 첫 답장 (재시도 시 같은 clientMessageId 사용)
export const postReply = ({ deliveryId, ...payload }: CreateReplyPayload) =>
  request<CreatedReply>('post', `/api/v1/deliveries/${deliveryId}/replies`, payload);

export const useReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReply,
    retry: retryOnce,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CURRENT_DELIVERY_ROUND_QUERY_KEY }),
  });
};

// 답장 기한 재활성화 (5초코)
export const postReplyReactivation = ({ deliveryId, idempotencyKey }: { deliveryId: string; idempotencyKey: string }) =>
  request<ReplyReactivation>('post', `/api/v1/deliveries/${deliveryId}/reply-reactivations`, undefined, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const useReplyReactivationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReplyReactivation,
    retry: retryOnce,
    onSuccess: ({ chocolateBalance }) => syncChocolateBalance(queryClient, chocolateBalance),
  });
};
