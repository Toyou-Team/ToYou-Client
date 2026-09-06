import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const profileWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: '6.3rem',
});

export const profileImageWrapper = style({
  position: 'relative',
  overflow: 'visible',

  width: '20rem',
  height: '20rem',
});

export const profileImage = style({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const imageChangeButton = style({
  position: 'absolute',
  right: '-0.1rem',
  bottom: '-0.1rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '4.8rem',
  height: '4.8rem',
  padding: 0,
  border: 0,

  borderRadius: '50%',
  backgroundColor: vars.color.neutral_50,
  boxShadow: '0 0.2rem 0.8rem rgba(0, 0, 0, 0.12)',

  fontSize: '3.5rem',
  fontWeight: 300,
  lineHeight: 1,
  color: vars.color.neutral_600,

  cursor: 'pointer',
});

export const hiddenInput = style({
  display: 'none',
});

export const bottomButtonWrapper = style({
  position: 'absolute',
  bottom: '3.4rem',
  left: '0',
  right: '0',
  padding: '0 2.4rem',
});
