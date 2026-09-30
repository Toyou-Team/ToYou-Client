import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@/styles/theme.css';

export const page = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '100dvh',
  padding: '11.6rem 4.5rem 4rem',
  backgroundColor: vars.color.neutral_100,

  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

export const closeButton = style({
  position: 'absolute',
  top: '4.9rem',
  right: '2.8rem',

  padding: 0,

  border: 0,
  background: 'none',

  cursor: 'pointer',
});

export const letter = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',

    width: '100%',
    gap: '1.6rem',
    minHeight: 0,

    backgroundColor: vars.color.neutral_50,
  },
  variants: {
    withTrack: {
      true: { height: '51rem' },
      false: { height: '41rem' },
    },
  },
  defaultVariants: {
    withTrack: false,
  },
});

export const messageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  flex: 1,
  minHeight: 0,
});

export const message = style({
  width: '100%',
  flex: 1,
  minHeight: 0,
  padding: '2rem 2.5rem 0',

  border: 0,
  outline: 0,
  resize: 'none',

  backgroundColor: 'transparent',

  ...vars.fontStyles.body,
  color: vars.color.neutral_900,

  '::placeholder': {
    color: vars.color.neutral_600,
  },
});

export const characterCount = style({
  alignSelf: 'flex-end',
  marginRight: '2.5rem',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const selectedTrackChip = style({
  height: '8rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
  flexShrink: 0,

  margin: '0 1rem',
  padding: '1rem 1.6rem',

  borderRadius: '1.2rem',
  backgroundColor: 'rgba(238, 238, 238, 0.6)',
});

export const selectedTrackImage = style({
  flexShrink: 0,

  width: '3.8rem',
  height: '3.8rem',
  borderRadius: '0.6rem',
  objectFit: 'cover',

  backgroundColor: vars.color.neutral_100,
});

export const selectedTrackInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',

  flex: 1,
  minWidth: 0,
});

export const selectedTrackTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.8rem',
});

export const selectedTrackTitle = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const selectedTrackArtist = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const removeTrackButton = style({
  flexShrink: 0,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  padding: 0,
  border: 0,
  background: 'transparent',

  cursor: 'pointer',
});

export const attachments = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  height: '5.5rem',
  padding: '0.8rem 1.1rem',
});

export const attachmentButton = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',

    height: '4rem',
    padding: '1rem 1.3rem',

    border: `1px solid ${vars.color.neutral_300}`,
    borderRadius: '0.8rem',

    ...vars.fontStyles.caption,
    color: vars.color.neutral_900,

    cursor: 'pointer',
  },
  variants: {
    active: {
      true: { backgroundColor: 'rgba(238, 238, 238, 0.6)' },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const submitButtonWrapper = style({
  position: 'absolute',
  right: '2.4rem',
  bottom: '4rem',
  left: '2.4rem',
});

export const hiddenInput = style({
  display: 'none',
});
