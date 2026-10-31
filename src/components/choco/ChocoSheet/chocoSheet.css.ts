import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const closeText = style({
  marginTop: '1.4rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  cursor: 'pointer',
});

export const scrollArea = style({
  overflowY: 'auto',
  paddingBottom: '3rem',
});

export const balance = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',

  padding: '3.2rem 0 2.8rem',
});

export const balanceTitle = style({
  ...vars.fontStyles.enBodyBoldWide,
  color: vars.color.neutral_600,
});

export const balanceAmount = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.6rem',

  ...vars.fontStyles.enTitle,
  fontSize: '2.8rem',
  letterSpacing: vars.fontStyles.enDisplay.letterSpacing,
  color: vars.color.neutral_950,
});

export const balanceUnit = style({
  ...vars.fontStyles.body,
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  margin: '0 2rem',
  padding: '1.6rem 1rem',
  borderBottom: `1px solid ${vars.color.neutral_300}`,
});

export const rowText = style({
  display: 'flex',
  flexDirection: 'column',
});

export const rowTitle = style({
  ...vars.fontStyles.body,
  fontWeight: vars.fontStyles.subtitle.fontWeight,
  color: vars.color.neutral_950,
});

export const rowDescription = style({
  ...vars.fontStyles.body,
  fontWeight: vars.fontStyles.caption.fontWeight,
  color: vars.color.neutral_600,
});

export const rowValue = style({
  ...vars.fontStyles.enTitle,
  color: vars.color.neutral_900,
});

export const guide = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',

  padding: '2.8rem 2rem 0',
  textAlign: 'center',
});

export const guideTitle = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const guideDescription = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const action = style({
  display: 'flex',
  padding: '2.8rem 2rem 0',
});

export const notice = style({
  padding: '2rem 3rem 0',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});
