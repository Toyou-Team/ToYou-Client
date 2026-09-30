import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const navBarWrapper = style({
  position: 'sticky',
  bottom: '0',

  display: 'flex',
  justifyContent: 'space-between',

  width: '100%',
  height: '8.8rem',

  backgroundColor: vars.color.neutral_50,
});

export const navItemWrapper = style({
  position: 'relative',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.2rem',

  width: '100%',
  height: '100%',

  borderTop: `1px solid ${vars.color.neutral_300}`,
});

export const navItemLabel = recipe({
  base: {
    ...vars.fontStyles.label,
  },
  variants: {
    isActive: {
      true: { color: vars.color.neutral_900 },
      false: { color: vars.color.neutral_300 },
    },
  },
  defaultVariants: {
    isActive: false,
  },
});
