import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const headerWrapper = recipe({
  base: {
    // zIndex: Z_INDEX.HEADER,
    top: 0,
    display: 'flex',
    width: '100%',
    height: '5.8rem',
    backgroundColor: 'white',

    marginTop: '3rem',
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
  },
});

export const leftElement = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',

  position: 'absolute',
  left: '2.4rem',
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
  right: '2rem',
});
