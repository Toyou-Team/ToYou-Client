import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { request } from './client';
import type { Gender, ReceiveGender } from './auth';

export const GENDER_LABEL: Record<Gender | ReceiveGender, string> = {
  MALE: '남성',
  FEMALE: '여성',
  ALL: '모두',
};

export interface ProfileImage {
  url: string;
  urlExpiresInSeconds: number;
}

export interface Profile {
  id: string;
  nickname: string;
  gender: Gender;
  /** "2002-01-09" 형식의 생년월일 */
  birthDate: string;
  receiveGender: ReceiveGender;
  chocolateBalance: number;
  profileImage: ProfileImage | null;
}

export const PROFILE_QUERY_KEY = ['profile'] as const;

// 프로필 조회
export const getProfile = () => request<Profile>('get', '/api/v1/profile');

export const useProfileQuery = () =>
  useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });

export interface UpdateProfilePayload {
  nickname?: string;
  receiveGender?: ReceiveGender;
}

// 프로필 수정 (닉네임, 받는 사람 성별)
export const patchProfile = (payload: UpdateProfilePayload) => request<Profile>('patch', '/api/v1/profile', payload);

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
};

// 프로필 사진 등록, 교체
export const postProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return request<Profile>('post', '/api/v1/profile/image', formData);
};

export const useUploadProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postProfileImage,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
};

// 프로필 사진 삭제
export const deleteProfileImage = () => request<Profile>('delete', '/api/v1/profile/image');

export const useDeleteProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
};
