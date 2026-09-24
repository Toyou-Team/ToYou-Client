import type { Gender, ReceiveGender } from '@/common/apis/auth';

export type { Gender, ReceiveGender };

export const GENDER_LABEL: Record<Gender | ReceiveGender, string> = {
  MALE: '남성',
  FEMALE: '여성',
  ALL: '모두',
};

export interface MockUser {
  nickname: string;
  gender: Gender;
  birthYear: number;
  receiveGender: ReceiveGender;
  choco: number;
  profileImageUrl?: string;
}

// TODO: 유저 정보 조회/수정 API 연동 전까지 사용하는 임시 데이터
let mockUser: MockUser = {
  nickname: '주디',
  gender: 'FEMALE',
  birthYear: 2002,
  receiveGender: 'FEMALE',
  choco: 40,
};

export const mockUserStore = {
  get: () => mockUser,
  patch: (partial: Partial<MockUser>) => {
    mockUser = { ...mockUser, ...partial };
  },
};
