import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const profileWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: 'var(--profile-wrapper-top-spacing)',
});

export const profileImageWrapper = style({
  position: 'relative',
  overflow: 'visible',

  width: 'var(--profile-image-size)',
  height: 'var(--profile-image-size)',
});

export const profileImage = style({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
  cursor: 'pointer',
});

export const imageChangeButton = style({
  position: 'absolute',
  right: '-0.1rem',
  bottom: '-0.1rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 'var(--profile-image-button-size)',
  height: 'var(--profile-image-button-size)',
  padding: 0,
  border: 0,

  borderRadius: '50%',
  backgroundColor: vars.color.neutral_50,
  boxShadow: '0 0.2rem 0.8rem rgba(0, 0, 0, 0.12)',

  fontSize: 'calc(var(--profile-image-button-size) * 0.73)',
  fontWeight: 300,
  lineHeight: 1,
  color: vars.color.neutral_600,

  cursor: 'pointer',
});

export const hiddenInput = style({
  display: 'none',
});
