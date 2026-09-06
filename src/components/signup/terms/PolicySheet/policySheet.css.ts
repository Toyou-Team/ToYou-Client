import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const closeText = style({
  border: 0,
  background: 'transparent',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginTop: '1.4rem',
  cursor: 'pointer',
});

export const content = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_900,

  padding: '0 1.1rem 0 3.5rem',
  whiteSpace: 'pre-wrap',
});
