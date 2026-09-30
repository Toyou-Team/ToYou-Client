import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const landingPageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',

  padding: '3rem 0',
});

export const landingPageTitle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',

  padding: '0 4.2rem',
  marginTop: '2rem',

  ...vars.fontStyles.display,
  color: vars.color.neutral_900,
});

export const landingPageDescription = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});
