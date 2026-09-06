import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const actionList = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1rem',
});

export const actionButton = style({
  width: '100%',
  height: '6.5rem',

  border: 0,
  borderTop: `1px solid ${vars.color.neutral_300}`,
  background: 'transparent',

  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,

  cursor: 'pointer',

  selectors: {
    '&:first-child': {
      borderTop: 'none',
    },
  },
});

export const deleteButton = style({
  color: vars.color.red_500,
});
