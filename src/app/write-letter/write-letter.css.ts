import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@/styles/theme.css';
import { withSafeTop, withSafeBottom } from '@/styles/safeArea';

export const page = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '100dvh',
  padding: `${withSafeTop('11.6rem')} 4.5rem ${withSafeBottom('11.6rem')}`,
  backgroundColor: vars.color.neutral_100,

  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

export const closeButton = style({
  position: 'absolute',
  top: withSafeTop('4.9rem'),
  right: '2.8rem',

  padding: 0,

  border: 0,
  background: 'none',

  cursor: 'pointer',
});

export const letter = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  gap: '1.6rem',
  minHeight: 0,
  marginBlock: 'auto',

  backgroundColor: vars.color.neutral_50,
});

export const messageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  minHeight: 0,
});

// textarea 는 ::after 높이를 따라 한 줄씩 늘어난다
const fieldText = {
  gridArea: '1 / 1',
  minHeight: '6.6rem',
  maxHeight: '29rem',
  padding: '0 2.5rem',

  ...vars.fontStyles.body,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
} as const;

export const messageField = style({
  display: 'grid',
  minHeight: 0,
  paddingTop: '2rem',

  '::after': {
    ...fieldText,
    content: 'attr(data-value) " "',
    visibility: 'hidden',
    overflow: 'hidden',
  },
});

export const message = style({
  ...fieldText,
  width: '100%',

  border: 0,
  outline: 0,
  resize: 'none',

  backgroundColor: 'transparent',
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

  width: '6rem',
  height: '6rem',
  borderRadius: '0.8rem',
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
  bottom: withSafeBottom('4rem'),
  left: '2.4rem',
});

export const hiddenInput = style({
  display: 'none',
});
