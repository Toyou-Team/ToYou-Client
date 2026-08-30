import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const mygenderPageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '100%',
});

export const titleWrapper = style({
  ...vars.fontStyles.title,

  marginTop: '5.1rem',
  paddingLeft: '2.4rem',
});
