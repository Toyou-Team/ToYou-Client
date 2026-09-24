import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const profileImagePageWrapper = style({
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

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: '3.4rem',
  left: '0',
  right: '0',
  padding: '0 2.4rem',
});
