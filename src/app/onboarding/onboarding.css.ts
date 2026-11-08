import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { SAFE_AREA, withSafeBottom } from '@/styles/safeArea';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '100dvh',
  paddingTop: SAFE_AREA.top,

  backgroundColor: vars.color.neutral_50,
});

export const skipArea = style({
  flex: '0 1 10rem',
  minHeight: '3.7rem',

  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',

  padding: '0 2.4rem',
  marginBottom: '0.8rem',
});

export const skipButton = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,

  height: '2.1rem',

  cursor: 'pointer',
});

export const track = style({
  display: 'flex',
  flexShrink: 0,

  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'none',
});

export const slide = style({
  flex: '0 0 100%',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',

  padding: '0 2.4rem',
});

export const image = style({
  display: 'block',

  width: '100%',
  height: 'auto',
  maxHeight: '40dvh',
  objectFit: 'contain',
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
  whiteSpace: 'pre-line',

  marginTop: '1.6rem',
});

export const description = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  whiteSpace: 'pre-line',

  marginTop: '1.6rem',
});

export const notice = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_900,

  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',

  width: 'fit-content',
  marginTop: '1.2rem',
  padding: '0.6rem 1.2rem',

  borderRadius: '2.4rem',
  backgroundColor: vars.color.neutral_100,
});

export const dots = style({
  marginTop: 0,
});

export const bottomArea = style({
  flexShrink: 0,

  display: 'flex',
  flexDirection: 'column',
  gap: '3.2rem',

  marginTop: 'auto',
  padding: `1.6rem 2.4rem ${withSafeBottom('4rem')}`,
});
