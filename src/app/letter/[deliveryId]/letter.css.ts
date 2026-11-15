import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { withSafeTop, withSafeBottom } from '@/styles/safeArea';

export const page = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',

  backgroundColor: vars.color.neutral_100,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

// 공통 Header 를 이 화면에서만 낮고 투명하게 쓰고, 투명해서 편지가 아래로 비치지 않게 고정하지 않는다
globalStyle(`${page} > header`, {
  position: 'relative',
  height: withSafeTop('8rem'),
  backgroundColor: 'transparent',
});

export const titleText = style({
  ...vars.fontStyles.title,
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
  justifyContent: 'center',
  flex: 1,
});

export const bottomButtonWrapper = style({
  position: 'sticky',
  bottom: 0,

  marginInline: '-2.1rem',
  padding: `3.2rem 0 ${withSafeBottom('4rem')}`,
});
