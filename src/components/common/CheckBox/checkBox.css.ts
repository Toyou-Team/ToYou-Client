import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const checkBox = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  width: '3rem',
  height: '3rem',
  borderRadius: '0.8rem',

  backgroundColor: vars.color.neutral_50,
  border: `1px solid ${vars.color.neutral_100}`,
});

export const checked = style({
  backgroundColor: vars.color.neutral_900,
});

globalStyle(`${checked} path`, {
  stroke: vars.color.neutral_50,
});
