import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const pageWrapper = style({
  width: '100%',
  minHeight: '100dvh',
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const content = style({
  width: '100%',
  padding: '0 2.4rem 4rem',
});

export const description = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginTop: '1.5rem',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  marginTop: '1.6rem',
});

export const optionRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: '100%',
  height: '3rem',

  cursor: 'pointer',
});

export const optionLabel = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const note = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  whiteSpace: 'pre-line',

  marginTop: '4.4rem',
});
