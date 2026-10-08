import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const letterCardWrapper = style({
  position: 'relative',
  overflow: 'hidden',

  margin: '0 auto',
  borderRadius: '2.4rem',
  backgroundColor: vars.color.neutral_100,
});

export const letterCardBackground = style({
  zIndex: 0,
  objectFit: 'cover',
});

export const profileWrapper = style({
  position: 'relative',
  zIndex: 1,

  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  padding: '2.1rem 2.1rem 0 2.1rem',
});

export const profileImage = style({
  position: 'relative',
  width: '4.3rem',
  height: '4.3rem',
  overflow: 'hidden',
  flexShrink: 0,

  borderRadius: '50%',
  backgroundColor: vars.color.neutral_900,
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

export const expiresText = style({
  marginLeft: 'auto',
  flexShrink: 0,

  padding: '0.4rem 1rem',
  borderRadius: '2rem',

  ...vars.fontStyles.label,

  backgroundColor: 'rgba(254, 254, 254, 0.3)',
  color: vars.color.neutral_950,
});

export const messageWrapper = style({
  position: 'absolute',
  top: '50%',
  left: '2.1rem',
  right: '2.1rem',
  zIndex: 1,

  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  padding: '2rem',
  transform: 'translateY(-50%)',

  backgroundColor: vars.color.neutral_50,
});

export const message = style({
  ...vars.fontStyles.body,
  whiteSpace: 'pre-line',
  color: vars.color.neutral_950,

  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 4,
  overflow: 'hidden',
});

export const songWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',
});

export const songImageWrapper = style({
  position: 'relative',
  flexShrink: 0,

  width: '4.9rem',
  height: '4.9rem',
  overflow: 'hidden',
});

export const songImage = style({
  objectFit: 'cover',
});

export const songInfo = style({
  minWidth: 0,
});

export const songTitle = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const songArtist = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
});
