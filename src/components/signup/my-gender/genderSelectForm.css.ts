import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const descriptionWrapper = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginLeft: '1.1rem',
});

export const buttonWrapper = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',

  marginTop: '1.6rem',
  padding: '0 2.4rem ',
});

export const choiceButton = recipe({
  base: {
    width: '100%',
    height: '5.6rem',
    borderRadius: '1.2rem',

    ...vars.fontStyles.subtitle,

    backgroundColor: vars.color.neutral_50,
    boxShadow: `inset 0 0 0 1px ${vars.color.neutral_300}`,
    color: vars.color.neutral_900,

    cursor: 'pointer',
  },

  variants: {
    selected: {
      true: {
        backgroundColor: vars.color.neutral_900,
        boxShadow: 'none',
        color: vars.color.neutral_50,
      },
    },
  },
});

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: '3.4rem',
  left: '0',
  right: '0',

  padding: '0 2.4rem',
});
