import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',

  backgroundColor: vars.color.neutral_100,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

// 공통 Header 를 이 화면에서만 낮고 투명하게 쓴다
globalStyle(`${page} > header`, {
  height: '8rem',
  backgroundColor: 'transparent',
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  padding: '3.6rem 4.5rem 0',
});

export const letterWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

// 긴 편지는 위에 붙이고, 짧은 편지만 세로 중앙 정렬
export const centered = style({
  justifyContent: 'center',
});

export const bottomButtonWrapper = style({
  position: 'sticky',
  bottom: 0,

  marginInline: '-2.1rem',
  padding: '3.2rem 0 4rem',
});
