import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
});

export const sheet = style({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,

  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  maxHeight: '80dvh',

  borderRadius: '2.4rem 2.4rem 0 0',
  backgroundColor: vars.color.neutral_50,

  '@media': {
    '(min-width: 768px)': {
      top: '50%',
      right: 'auto',
      bottom: 'auto',
      left: '50%',

      width: '39rem',
      maxHeight: '80dvh',

      transform: 'translate(-50%, -50%)',

      borderRadius: '2.4rem',
    },
  },
});

export const handle = style({
  width: '10rem',
  height: '0.6rem',
  flexShrink: 0,
  margin: '1.7rem auto 0',

  borderRadius: '1rem',
  backgroundColor: vars.color.neutral_900,

  '@media': {
    '(min-width: 768px)': {
      display: 'none',
    },
  },
});

export const header = style({
  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2rem',

  minHeight: '2.4rem',
  flexShrink: 0,
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,

  marginTop: '1.4rem',
});

export const headerAction = style({
  position: 'absolute',
  top: '50%',
  right: '3rem',

  transform: 'translateY(-50%)',
});
