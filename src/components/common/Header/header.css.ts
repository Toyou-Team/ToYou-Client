import { vars } from '@/styles/theme.css';
import { Z_INDEX } from '@/constants/zIndex';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const headerWrapper = recipe({
  base: {
    zIndex: Z_INDEX.HEADER,
    top: 0,
    display: 'flex',
    width: '100%',
    height: '6.8rem',
    backgroundColor: 'white',
  },
  variants: {
    isSticky: {
      true: {
        position: 'sticky',
      },
      false: {
        position: 'relative',
      },
    },
    bordered: {
      true: {
        height: '8rem',
        borderBottom: `1px solid ${vars.color.neutral_300}`,
      },
    },
  },
});

export const leftElement = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',

  position: 'absolute',
  left: '2.8rem',
});

export const centerElement = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
});

export const rightElement = style({
  height: '100%',

  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  right: '2.8rem',
});
