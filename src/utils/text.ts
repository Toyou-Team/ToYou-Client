// 이모지 등 보이는 글자 하나를 1자로 계산
const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

const toChars = (text: string) => Array.from(segmenter.segment(text), ({ segment }) => segment);

export const countChars = (text: string) => toChars(text).length;

export const sliceChars = (text: string, max: number) => toChars(text).slice(0, max).join('');

// text 글자를 반복해 length 글자로 채움
export const fillChars = (text: string, length: number) => {
  const chars = toChars(text);
  return Array.from({ length }, (_, index) => chars[index % chars.length]).join('');
};
