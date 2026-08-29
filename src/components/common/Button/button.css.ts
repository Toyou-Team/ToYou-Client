import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const buttonStyle = style({
  ...vars.fontStyles.subtitle,

  width: '100%',
  height: '5.8rem',

  borderRadius: '1.2rem',

  background: vars.color.neutral_900,
  color: vars.color.neutral_50,

  selectors: {
    '&:disabled': {
      background: vars.color.neutral_300,
      color: vars.color.neutral_600,
    },
  },
});

export const outlinedStyle = style({
  background: vars.color.neutral_600,
  color: vars.color.neutral_300,
});
