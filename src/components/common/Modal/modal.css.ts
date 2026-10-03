import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.4rem',

  width: '34.2rem',
  padding: '2rem 3.2rem',

  borderRadius: '2.4rem',
  backgroundColor: vars.color.neutral_50,
});

export const verticalCard = style({
  padding: '2rem',
});

export const textGroup = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.6rem',
});

globalStyle(`${verticalCard} ${textGroup}`, {
  gap: '1.5rem',
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
  textAlign: 'center',
});

export const descriptionWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  gap: '0.4rem',
});

export const description = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
  textAlign: 'center',
  whiteSpace: 'pre-line',
});

export const subDescription = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
  fontWeight: 600,

  textAlign: 'center',
  whiteSpace: 'pre-line',
});

globalStyle(`${subDescription} strong`, {
  color: vars.color.red_500,
});

export const buttonWrapper = style({
  display: 'flex',
  gap: '0.8rem',
  width: '100%',
});

export const verticalButtonWrapper = style({
  flexDirection: 'column-reverse',
});

globalStyle(`${verticalButtonWrapper} > button`, {
  flex: 'none',
});

export const button = style({
  flex: 1,
  height: '4.8rem',

  borderRadius: '0.8rem',
  ...vars.fontStyles.subtitle,

  cursor: 'pointer',
});

export const cancelButton = style({
  backgroundColor: vars.color.neutral_50,
  boxShadow: `inset 0 0 0 1px ${vars.color.neutral_300}`,
  color: vars.color.neutral_900,
});

export const confirmButton = style({
  backgroundColor: vars.color.neutral_900,
  color: vars.color.neutral_50,

  selectors: {
    '&:disabled': {
      backgroundColor: vars.color.neutral_300,
      color: vars.color.neutral_600,
      cursor: 'not-allowed',
    },
  },
});
