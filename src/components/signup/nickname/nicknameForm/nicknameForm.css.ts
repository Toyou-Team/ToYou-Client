import { style } from '@vanilla-extract/css';

export const nicknameFormWrapper = style({
  width: '100%',
  flex: 1,
  position: 'relative',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const nicknameFieldWrapper = style({
  marginTop: '1.6rem',
  padding: '0 2.4rem',
});

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: '3.4rem',
  left: '0',
  right: '0',

  padding: '0 2.4rem',
});
