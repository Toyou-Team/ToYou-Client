import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const page = style({
  position: 'relative',
  width: '100%',
  minHeight: '100dvh',
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

export const letter = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '40rem',
  gap: '1.6rem',

  backgroundColor: vars.color.neutral_50,
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

export const attachments = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  minHeight: '6.4rem',
  padding: '0.8rem 1.1rem',

  borderTop: `1px solid ${vars.color.neutral_300}`,
});

export const attachmentButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',

  height: '4rem',
  padding: '0 1.2rem',

  border: `1px solid ${vars.color.neutral_300}`,
  borderRadius: '0.8rem',

  backgroundColor: vars.color.neutral_50,

  ...vars.fontStyles.caption,
  color: vars.color.neutral_900,

  cursor: 'pointer',
});

export const submitButtonWrapper = style({
  position: 'absolute',
  right: '2.4rem',
  bottom: '3.4rem',
  left: '2.4rem',
});

export const hiddenInput = style({
  display: 'none',
});
