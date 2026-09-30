import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const dayText = style({
  padding: '1.2rem 2.4rem',
  borderBottom: `1px solid ${vars.color.neutral_300}`,

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
});

export const messageItem = style({
  height: '8rem',

  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',

  padding: '2rem 2.8rem',
  borderBottom: `1px solid ${vars.color.neutral_300}`,

  cursor: 'pointer',
});

export const messageContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',

  flex: 1,
  minWidth: 0,
});

export const metaText = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const bodyText = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.body,
  color: vars.color.neutral_900,
});

export const unreadDot = style({
  flexShrink: 0,

  width: '0.7rem',
  height: '0.7rem',
  borderRadius: '50%',

  backgroundColor: vars.color.neutral_900,
});
