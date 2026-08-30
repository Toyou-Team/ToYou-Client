import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const allAgreeCheckboxWrapper = style({
  marginTop: '3.3rem',
  paddingLeft: '2.4rem',
  width: '100%',
  height: '3rem',

  display: 'flex',
  alignItems: 'center',
  gap: '1.1rem',

  borderRadius: '1.2rem',
});

export const allAgreeCheckboxText = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_900,
});

export const hiddenInput = style({
  display: 'none',
});
