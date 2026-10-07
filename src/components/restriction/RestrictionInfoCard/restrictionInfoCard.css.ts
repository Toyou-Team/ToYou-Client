import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',

  padding: '1.6rem 2.2rem',

  border: `1px solid ${vars.color.neutral_100}`,
  borderRadius: '1.2rem',
});

export const idRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  paddingBottom: '1.6rem',
  borderBottom: `1px solid ${vars.color.neutral_100}`,
});

export const idValue = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
});

export const copyButton = style({
  height: '3.6rem',
  padding: '0.6rem 1.2rem',

  borderRadius: '0.6rem',
  boxShadow: `inset 0 0 0 1px ${vars.color.neutral_100}`,

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,

  cursor: 'pointer',
});

export const detailList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',

  paddingTop: '1.6rem',
});

export const row = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.6rem',
});

export const label = style({
  flexShrink: 0,

  ...vars.fontStyles.body,
  color: vars.color.neutral_900,
});

export const value = style({
  fontSize: '1.4rem',
  fontWeight: 600,
  color: vars.color.neutral_950,
  textAlign: 'right',
});
