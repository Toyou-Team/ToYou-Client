import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const loading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  minHeight: '100dvh',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});

export const blocked = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.4rem',

  minHeight: '100dvh',
  padding: '0 3.2rem',
  justifyContent: 'center',
});

export const blockedText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_900,
  textAlign: 'center',
  whiteSpace: 'pre-line',
});

export const blockedButton = style({
  width: '100%',
  maxWidth: '32rem',
  height: '5.2rem',

  borderRadius: '1.2rem',
  backgroundColor: vars.color.neutral_950,
  color: vars.color.neutral_50,

  ...vars.fontStyles.subtitle,
  cursor: 'pointer',
});
