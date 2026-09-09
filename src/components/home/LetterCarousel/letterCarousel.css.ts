import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const carousel = style({
  width: '100%',
});

export const track = style({
  position: 'relative',

  display: 'flex',
  gap: '1.6rem',

  marginInline: '-2.4rem',
  paddingInline: '2.4rem',
  scrollPaddingInline: '2.4rem',

  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  overscrollBehaviorX: 'contain',

  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const slide = style({
  flex: '0 0 auto',
  width: '90%',

  scrollSnapAlign: 'start',
});

export const dots = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.6rem',

  marginTop: '1.6rem',
});

export const dot = style({
  width: '0.7rem',
  height: '0.7rem',

  borderRadius: '0.8rem',
  backgroundColor: vars.color.neutral_300,

  cursor: 'pointer',
  transition: 'width 0.2s ease, background-color 0.2s ease',
});

export const dotActive = style({
  width: '3.8rem',
  backgroundColor: vars.color.neutral_950,
});
