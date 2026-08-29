import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const nicknamePageWrapper = style({
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

export const descriptionWrapper = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginTop: '1.2rem',
  paddingLeft: '3.5rem',
});
