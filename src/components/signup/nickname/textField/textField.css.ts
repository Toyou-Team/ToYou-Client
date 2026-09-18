import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const textFieldWrapper = recipe({
  base: {
    width: '100%',
    height: '5.6rem',
    padding: '1.8rem 1.6rem',
    borderRadius: '1.2rem',

    boxShadow: `inset 0 0 0 1px ${vars.color.neutral_300}`,
  },
  variants: {
    isError: {
      true: {
        boxShadow: `inset 0 0 0 1px ${vars.color.red_500}`,
      },
    },
  },
});

export const textFieldInput = style({
  width: '100%',
  height: '100%',
  padding: 0,
  border: 'none',
  outline: 'none',

  background: 'transparent',
  ...vars.fontStyles.subtitle,
});

export const helperText = recipe({
  base: {
    marginTop: '1.2rem',
    paddingLeft: '1.1rem',

    ...vars.fontStyles.caption,
  },
  variants: {
    type: {
      default: {
        color: vars.color.neutral_600,
      },
      error: {
        color: vars.color.red_500,
      },
      success: {
        color: vars.color.green_500,
      },
    },
  },
});
