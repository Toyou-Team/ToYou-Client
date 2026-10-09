import { vars } from '@/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

import { Z_INDEX } from '@/constants/zIndex';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.BACKDROP,

  backgroundColor: 'rgba(0, 0, 0, 0.4)',

  animation: `${fadeIn} 0.25s ease-out`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const sheet = style({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: Z_INDEX.BACKDROP,

  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  maxHeight: '80dvh',

  borderRadius: '2.4rem 2.4rem 0 0',
  backgroundColor: vars.color.neutral_50,

  animation: `${slideUp} 0.25s cubic-bezier(0.32, 0.72, 0, 1)`,
  transition: 'transform 0.2s ease-out',

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },

    '(min-width: 768px)': {
      animation: 'none',

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

export const handleArea = style({
  flexShrink: 0,

  padding: '1.7rem 0 1rem',
  marginBottom: '-1rem',

  touchAction: 'none',
  cursor: 'grab',

  '@media': {
    '(min-width: 768px)': {
      display: 'none',
    },
  },
});

export const handle = style({
  width: '8rem',
  height: '0.6rem',
  margin: '0 auto',

  borderRadius: '1rem',
  backgroundColor: vars.color.neutral_900,
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
