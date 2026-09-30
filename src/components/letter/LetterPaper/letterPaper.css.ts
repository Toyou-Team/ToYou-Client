import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const paper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  width: '100%',
  padding: '2rem 2.5rem',

  backgroundColor: vars.color.neutral_50,
});

export const body = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_900,
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
});

export const divider = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  selectors: {
    '&::before, &::after': {
      content: '""',
      flex: 1,
      height: '1px',
      backgroundColor: vars.color.neutral_600,
    },
  },
});

export const dividerText = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
  whiteSpace: 'nowrap',
});

export const hiddenBody = style([
  body,
  {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 6,
    overflow: 'hidden',

    filter: 'blur(2px)',
    maskImage: 'linear-gradient(to bottom, black, transparent)',
    userSelect: 'none',
  },
]);

export const date = style({
  alignSelf: 'flex-end',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const song = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',

  padding: '1rem 1.6rem',

  borderRadius: '1.2rem',
  backgroundColor: 'rgba(238, 238, 238, 0.6)',
});

export const albumImage = style({
  flexShrink: 0,

  width: '3.8rem',
  height: '3.8rem',
  borderRadius: '0.6rem',
  objectFit: 'cover',
});

export const songInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',

  minWidth: 0,
});

export const songTitle = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,

  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export const songArtist = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
});
