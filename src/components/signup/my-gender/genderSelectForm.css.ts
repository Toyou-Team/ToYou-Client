import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const descriptionWrapper = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginLeft: '1.1rem',
});

export const buttonWrapper = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',

  marginTop: '1.6rem',
  padding: '0 2.4rem ',
});

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: '3.4rem',
  left: '0',
  right: '0',

  padding: '0 2.4rem',
});
