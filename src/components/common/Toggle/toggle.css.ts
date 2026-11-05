import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const wrapper = style({
  position: 'relative',
  flexShrink: 0,

  width: '4.2rem',
  height: '2.4rem',
});

export const input = style({
  position: 'absolute',
  inset: 0,

  width: '100%',
  height: '100%',
  margin: 0,

  opacity: 0,
  cursor: 'pointer',

  selectors: {
    '&:disabled': { cursor: 'not-allowed' },
  },
});

export const track = style({
  position: 'relative',
  display: 'block',

  width: '100%',
  height: '100%',
  borderRadius: '1.2rem',

  backgroundColor: vars.color.neutral_300,
  transition: 'background-color 0.2s',
  pointerEvents: 'none',

  '::before': {
    content: '""',
    position: 'absolute',
    top: '0.2rem',
    left: '0.2rem',

    width: '2rem',
    height: '2rem',
    borderRadius: '50%',

    backgroundColor: vars.color.neutral_50,
    transition: 'transform 0.2s',
  },

  selectors: {
    [`${input}:checked + &`]: { backgroundColor: vars.color.neutral_900 },
    [`${input}:checked + &::before`]: { transform: 'translateX(1.8rem)' },
    [`${input}:focus-visible + &`]: { outline: `2px solid ${vars.color.neutral_600}`, outlineOffset: '2px' },
  },
});
