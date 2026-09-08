import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const badge = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.4rem',
  padding: ' 0.4rem 1.2rem',

  borderRadius: '2.4rem',
  backgroundColor: vars.color.neutral_100,
  color: vars.color.neutral_950,
});

export const count = style({
  ...vars.fontStyles.subtitle,
});

export const label = style({
  ...vars.fontStyles.body,
});
