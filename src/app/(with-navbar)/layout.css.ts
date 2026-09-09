import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: '100dvh',
  width: '100%',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});
