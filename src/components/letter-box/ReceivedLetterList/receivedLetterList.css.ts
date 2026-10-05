import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

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
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',

  paddingTop: '1.6rem',
});

export const item = style({
  position: 'relative',

  borderBottom: `1px solid ${vars.color.neutral_300}`,
});

export const exitButton = style({
  width: '5.8rem',

  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,

  ...vars.fontStyles.label,
  color: vars.color.neutral_50,
  backgroundColor: vars.color.red_500,

  cursor: 'pointer',
});

export const itemContent = recipe({
  base: {
    height: '8.6rem',

    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.6rem',

    padding: '1rem',
    position: 'relative',

    backgroundColor: vars.color.neutral_50,
    touchAction: 'pan-y',
    userSelect: 'none',
    transition: 'transform 0.2s ease',
  },
  variants: {
    isDragging: {
      true: { transition: 'none' },
    },
  },
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

  width: '0.8rem',
  height: '0.8rem',
  borderRadius: '50%',

  backgroundColor: vars.color.neutral_950,
});
