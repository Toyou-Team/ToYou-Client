import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',

  padding: '3.2rem 2.4rem 3.2rem',
});

export const description = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const releaseAt = style({
  fontWeight: 700,
});

export const buttonWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  marginTop: '3.2rem',
});
