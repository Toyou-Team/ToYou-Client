import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { withSafeBottom } from '@/styles/safeArea';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
});

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(0.8rem)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const title = style({
  display: 'flex',
  flexDirection: 'column',

  marginTop: '8.3rem',
  paddingLeft: '2.4rem',

  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

const line = {
  animation: `${fadeUp} 0.6s ease-out both`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
} as const;

export const firstLine = style({
  ...line,
  animationDelay: '0.2s',
});

export const secondLine = style({
  ...line,
  animationDelay: '0.9s',
});

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: withSafeBottom('3.4rem'),
  left: 0,
  right: 0,

  padding: '0 2rem',
});
