import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const carouselWrapper = style({
  width: '100%',

  marginTop: '2.6rem',
});

export const moreButtonWrapper = style({
  marginTop: 'auto',
});

export const statusWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: '1.6rem',

  paddingBottom: '2.6rem',
});

export const statusText = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
  textAlign: 'center',
});
