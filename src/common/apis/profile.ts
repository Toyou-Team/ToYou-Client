import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { resizeImageForUpload } from '@/utils/image';

import { request } from './client';
import { forgetImageUrl, keepImageUrl } from './imageUrl';
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
  gender: Gender | null;
  /** "2002-01-09" 형식의 생년월일 */
  birthDate: string | null;
  receiveGender: ReceiveGender;
  chocolateBalance: number;
  profileImage: ProfileImage | null;
}

export const PROFILE_QUERY_KEY = ['profile'] as const;

const getProfileImageId = (profileId: string) => `profile:${profileId}`;

const keepProfileImage = (profile: Profile): Profile => ({
  ...profile,
  profileImage: keepImageUrl(getProfileImageId(profile.id), profile.profileImage),
});

// 초코를 쓰는 API 응답의 잔액을 헤더 배지에 바로 반영
export const syncChocolateBalance = (queryClient: QueryClient, chocolateBalance: number) =>
  queryClient.setQueryData<Profile>(PROFILE_QUERY_KEY, (profile) => profile && { ...profile, chocolateBalance });

// 프로필 조회
export const getProfile = () => request<Profile>('get', '/api/v1/profile').then(keepProfileImage);

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
export const patchProfile = (payload: UpdateProfilePayload) =>
  request<Profile>('patch', '/api/v1/profile', payload).then(keepProfileImage);

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
};

// 바꿀 닉네임 미리 확인 (저장은 하지 않음)
export const postProfileNicknameCheck = (payload: { nickname: string }) =>
  request<{ available: boolean }>('post', '/api/v1/profile/nickname-check', payload);

export const useProfileNicknameCheckMutation = () => useMutation({ mutationFn: postProfileNicknameCheck });

// 프로필 사진 등록, 교체
export const postProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', await resizeImageForUpload(file));

  const profile = await request<Profile>('post', '/api/v1/profile/image', formData);
  forgetImageUrl(getProfileImageId(profile.id));

  return keepProfileImage(profile);
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
export const deleteProfileImage = () => request<Profile>('delete', '/api/v1/profile/image').then(keepProfileImage);

export const useDeleteProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
};
