import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',
  backgroundColor: vars.color.neutral_50,
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  padding: '3.2rem 2.4rem 0',
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const description = style({
  marginTop: '1.6rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});

export const reasonList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  marginTop: '4.4rem',
});

export const reasonButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_950,

  cursor: 'pointer',
});

export const reasonOption = style({
  ...vars.fontStyles.subtitle,
});

export const detailInput = style({
  height: '7.9rem',
  marginTop: '0.8rem',
  marginLeft: '3.8rem',
  padding: '1rem 1.6rem',

  border: `1px solid ${vars.color.neutral_100}`,
  borderRadius: '0.8rem',
  outline: 'none',
  resize: 'none',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,

  '::placeholder': {
    color: vars.color.neutral_600,
  },
});

export const notice = style({
  marginTop: '3.2rem',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const submitButtonWrapper = style({
  padding: '2.4rem 2.4rem 4rem',
});
