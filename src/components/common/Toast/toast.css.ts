import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

const HEIGHT = '3.8rem';
const RADIUS = '1.2rem';
const CIRCLE = `inset(0 calc(50% - ${HEIGHT} / 2) round calc(${HEIGHT} / 2))`;
const FULL = `inset(0 round ${RADIUS})`;

const appear = keyframes({
  '0%': { opacity: 0, clipPath: CIRCLE },
  '6%, 14%': { opacity: 1, clipPath: CIRCLE },
  '32%': { clipPath: FULL },
  '80%': { opacity: 1 },
  '100%': { opacity: 0, clipPath: FULL },
});

const contentFadeIn = keyframes({
  '0%, 28%': { opacity: 0 },
  '40%, 100%': { opacity: 1 },
});

const fadeOut = keyframes({
  '0%, 80%': { opacity: 1 },
  '100%': { opacity: 0 },
});

export const item = style({
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',

  selectors: {
    // sonner 기본 슬라이드 효과를 끈다. 속성 선택자를 붙여 sonner 스타일보다 우선순위를 높인다
    '&[data-sonner-toast]': {
      transition: 'none',
    },
  },
});

export const toast = style({
  display: 'flex',
  alignItems: 'center',

  height: HEIGHT,
  padding: '0.8rem 1.6rem',

  borderRadius: RADIUS,
  backgroundColor: `color-mix(in srgb, ${vars.color.neutral_950} 90%, transparent)`,

  ...vars.fontStyles.body,
  color: vars.color.neutral_50,
  whiteSpace: 'nowrap',

  animation: `${appear} 3s ease-out forwards`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: `${fadeOut} 3s ease-out forwards`,
    },
  },
});

export const content = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',

  animation: `${contentFadeIn} 3s ease-out forwards`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
