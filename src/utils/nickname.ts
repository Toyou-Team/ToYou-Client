import { ApiError } from '@/common/apis/client';
import { CONTENT_ERROR_CODE } from '@/common/apis/constants/error-code';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 12;
const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9 ]+$/;

export const NICKNAME_LENGTH_ERROR = '닉네임은 최소 2자에서 12자까지 작성 가능합니다.';
const NICKNAME_PATTERN_ERROR = '닉네임은 한글, 영문, 숫자, 띄어쓰기만 쓸 수 있어요.';

// 서버와 같은 규칙
export const getNicknameError = (nickname: string) => {
  const trimmed = nickname.trim();

  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) return NICKNAME_LENGTH_ERROR;
  if (!NICKNAME_PATTERN.test(trimmed)) return NICKNAME_PATTERN_ERROR;
  return null;
};

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

// 씨바는, 병신은
const withTopicParticle = (word: string) => {
  const lastChar = word.charCodeAt(word.length - 1);

  if (lastChar < HANGUL_START || lastChar > HANGUL_END) return `${word}은(는)`;
  return `${word}${(lastChar - HANGUL_START) % 28 ? '은' : '는'}`;
};

// 금칙어는 시안 문구로, 그 밖의 오류는 서버 문구로 안내
export const getNicknameServerError = (error: Error) => {
  if (!(error instanceof ApiError) || error.code !== CONTENT_ERROR_CODE.FORBIDDEN_WORD) return error.message;

  const words = error.details?.forbiddenWords;
  return words?.length ? `${withTopicParticle(words.join(', '))} 설정할 수 없는 닉네임이에요.` : error.message;
};
