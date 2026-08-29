import { vars } from '@/styles/theme.css';
import { recipe } from '@vanilla-extract/recipes';

export const buttonStyle = recipe({
  base: {
    width: '100%',
    height: '5.8rem',
    borderRadius: '1.2rem',

    ...vars.fontStyles.subtitle,

    background: vars.color.neutral_900,
    color: vars.color.neutral_50,

    selectors: {
      '&:disabled': {
        background: vars.color.neutral_300,
        color: vars.color.neutral_600,
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    outlined: {
      true: {
        background: vars.color.neutral_50,
        boxShadow: `inset 0 0 0 1px ${vars.color.neutral_300}`,
        color: vars.color.neutral_900,
      },
      // false: {
      //   background: vars.color.neutral_300,
      //   color: vars.color.neutral_600,
      // },
    },

    selected: {
      true: {
        backgroundColor: vars.color.neutral_900,
        color: vars.color.neutral_50,
      },
      // false: {
      //   backgroundColor: vars.color.neutral_50,
      //   color: vars.color.neutral_900,
      // },
    },
  },

  defaultVariants: {
    outlined: false,
  },
});
