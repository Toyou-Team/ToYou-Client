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
export const createLetter = (payload: CreateLetterPayload) =>
  request<CreatedLetter>('post', '/api/v1/letters', payload);

export const useCreateLetterMutation = () => useMutation({ mutationFn: createLetter });

// 편지 작성 시 백그라운드 이미지 업로드
export const uploadLetterImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return request<{ key: string }>('post', '/api/v1/storage/letter-images', formData);
};

export const useUploadLetterImageMutation = () => useMutation({ mutationFn: uploadLetterImage });

// 편지에 연결되지 않은 이미지 삭제
export const deleteLetterImage = (key: string) =>
  request<void>('delete', '/api/v1/storage/letter-images', { key }).catch(() => {});
