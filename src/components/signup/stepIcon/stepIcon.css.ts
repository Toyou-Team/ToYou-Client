import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const stepIconContainer = style({
  display: 'flex',
  alignItems: 'center',

  marginTop: '3.4rem',
  marginLeft: '2.4rem',
});

export const stepItem = style({
  display: 'flex',
  alignItems: 'center',
});

export const stepIconWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const stepIcon = recipe({
  base: {
    flexShrink: 0,
  },

  variants: {
    isCurrentStep: {
      true: {
        width: '1.6rem',
        height: '1.6rem',
      },
      false: {
        width: '1rem',
        height: '1rem',
      },
    },
  },
});

export const stepLine = style({
  width: '7.4rem',

  flexShrink: 0,
});

export const stepDot = style({
  width: '1rem',
  height: '1rem',
  margin: '0.4rem 0',

  borderRadius: '50%',
  backgroundColor: vars.color.neutral_900,
});
