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

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  padding: '3.6rem 4.5rem 0',
});

export const bottomButtonWrapper = style({
  position: 'sticky',
  bottom: 0,

  marginTop: 'auto',
  marginInline: '-2.1rem',
  padding: '3.2rem 0 4rem',
});
