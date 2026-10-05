import { vars } from '@/styles/theme.css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

export const buttonStyle = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',

    ...vars.fontStyles.subtitle,

    cursor: 'pointer',

    selectors: {
      '&:disabled': {
        background: vars.color.neutral_300,
        boxShadow: 'none',
        color: vars.color.neutral_600,
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    variant: {
      primary: {
        background: vars.color.neutral_900,
        color: vars.color.neutral_50,
      },
      outline: {
        background: vars.color.neutral_50,
        boxShadow: `inset 0 0 0 1px ${vars.color.neutral_900}`,
        color: vars.color.neutral_900,
      },
      secondary: {
        background: vars.color.neutral_50,
        boxShadow: `inset 0 0 0 1px ${vars.color.neutral_300}`,
        color: vars.color.neutral_900,
      },
    },

    size: {
      large: {
        height: '5.8rem',
        borderRadius: '1.2rem',
      },
      medium: {
        height: '4.8rem',
        borderRadius: '0.8rem',
        fontSize: '1.6rem',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'large',
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof buttonStyle>>;
