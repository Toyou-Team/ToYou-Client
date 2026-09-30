import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const homeWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
  padding: '0 2.4rem 2.6rem',
});

export const titleText = style({
  marginTop: '1.2rem',

  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
  whiteSpace: 'pre-line',
});
