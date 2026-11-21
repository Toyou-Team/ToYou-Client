import { ApiError } from '@/common/apis/client';
import { CONTENT_ERROR_CODE } from '@/common/apis/constants/error-code';
import { countChars } from '@/utils/text';

export const NICKNAME_MAX_LENGTH = 12;

export const NICKNAME_LENGTH_ERROR = '닉네임은 최소 1자에서 12자까지 작성 가능합니다.';

// 서버와 같은 규칙
export const getNicknameError = (nickname: string) => {
  const length = countChars(nickname.trim());

  return length < 1 || length > NICKNAME_MAX_LENGTH ? NICKNAME_LENGTH_ERROR : null;
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
  if (!(error instanceof ApiError)) return error.message;

  const fieldError = error.details?.fields?.find(({ field }) => field === 'nickname')?.messages[0];
  if (fieldError) return fieldError;

  if (error.code !== CONTENT_ERROR_CODE.FORBIDDEN_WORD) return error.message;

  const words = error.details?.forbiddenWords;
  return words?.length ? `${withTopicParticle(words.join(', '))} 설정할 수 없는 닉네임이에요.` : error.message;
};
