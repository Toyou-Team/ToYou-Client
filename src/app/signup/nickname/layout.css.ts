import { style } from '@vanilla-extract/css';

export const layoutWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',
  paddingTop: '5.7rem',
});

export const mainContent = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',

  width: '100%',
});
