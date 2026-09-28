import { useMutation } from '@tanstack/react-query';

import { request } from './client';

export interface CreatedLetterSpotify {
  trackId: string;
  title: string;
  artist: string;
  albumImageUrl: string;
  externalUrl: string;
}

export interface CreatedLetter {
  id: string;
  body: string;
  imageObjectKey?: string;
  spotify?: CreatedLetterSpotify;
  deliverableUntil: string;
  createdAt: string;
}

export interface CreateLetterPayload {
  body: string;
  imageObjectKey?: string;
  spotifyTrackId?: string;
}

// 편지 작성
export const createLetter = (payload: CreateLetterPayload) => request<CreatedLetter>('post', '/api/v1/letters', payload);

export const useCreateLetterMutation = () => useMutation({ mutationFn: createLetter });
