import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const page = style({
  position: 'relative',

  width: '100%',
  height: '100dvh',
  overflow: 'hidden',

  backgroundColor: vars.color.neutral_100,
});

// 공통 Header 를 배경 이미지 위에 투명하게 띄우기
globalStyle(`${page} > header`, {
  position: 'absolute',
  height: '8rem',
  backgroundColor: 'transparent',
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const track = style({
  width: '100%',
  height: '100%',

  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  overscrollBehaviorX: 'contain',

  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const slides = style({
  display: 'flex',
  height: '100%',
});

const peek = keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '25%, 60%': { transform: 'translateX(-4rem)' },
});

export const peekNext = style({
  animation: `${peek} 1.6s ease-in-out 0.4s`,
});

export const slide = style({
  flex: '0 0 100%',
  overflowY: 'auto',

  padding: '11.6rem 2.4rem 4rem',

  backgroundSize: 'cover',
  backgroundPosition: 'center',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
});

// 하단에 답장 버튼이 뜨는 편지는 버튼에 가리지 않도록 아래 여백 추가
export const slideWithButton = style({
  paddingBottom: '12.2rem',
});

export const bottom = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,

  display: 'flex',
  justifyContent: 'center',

  padding: '0 2.4rem 4rem',
  pointerEvents: 'none',
});

// 하단 영역은 스와이프를 막지 않고, 버튼만 눌리도록
globalStyle(`${bottom} > *`, {
  pointerEvents: 'auto',
});

export const dots = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.6rem',

  marginTop: '7.1rem',
});

export const dot = style({
  width: '0.7rem',
  height: '0.7rem',

  borderRadius: '0.8rem',
  backgroundColor: vars.color.neutral_300,

  transition: 'width 0.2s ease, background-color 0.2s ease',
});

export const dotActive = style({
  width: '3.8rem',
  backgroundColor: vars.color.neutral_950,
});
