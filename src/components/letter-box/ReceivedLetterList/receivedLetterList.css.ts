import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const emptyWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4rem',

  flex: 1,
});

export const emptyText = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const writeLetterButton = style({
  width: '26rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  height: '5.6rem',
  padding: '0 3.2rem',

  border: `1px solid ${vars.color.neutral_900}`,
  borderRadius: '1.2rem',
  backgroundColor: vars.color.neutral_50,

  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_900,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',

  paddingTop: '1.6rem',
});

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1.6rem',

  padding: '1rem 0',

  borderBottom: `1px solid ${vars.color.neutral_300}`,
});

export const profileImage = style({
  flexShrink: 0,
  overflow: 'hidden',

  width: '6.5rem',
  height: '6.5rem',
  borderRadius: '50%',
  backgroundColor: vars.color.neutral_300,
});

export const profileImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',

  flex: 1,
  minWidth: 0,
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
});

export const nickname = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const receivedAt = style({
  flexShrink: 0,

  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const bottomRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

export const message = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const unreadDot = style({
  flexShrink: 0,

  width: '0.7rem',
  height: '0.7rem',
  marginBottom: '0.4rem',
  borderRadius: '50%',

  backgroundColor: vars.color.neutral_950,
});
