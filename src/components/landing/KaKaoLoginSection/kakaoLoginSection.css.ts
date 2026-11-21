import { style } from '@vanilla-extract/css';

import { landingPageWrapper } from '@/app/landing.css';
import { vars } from '@/styles/theme.css';

export const loginButtonSectionWrapper = style({
  width: '100%',
  marginTop: 'auto',
  paddingTop: '3.2rem',
  paddingInline: '2.4rem',

  selectors: {
    [`${landingPageWrapper}:has(+ footer) &`]: { marginTop: 0, paddingTop: '3.6rem' },
  },
});

const loginButton = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  columnGap: '6.5rem',

  padding: '0 2rem',
});

export const kakaoLoginButton = style([
  loginButton,
  {
    background: '#FFE400',
    color: vars.color.neutral_950,
  },
]);

export const appleLoginButton = style([
  loginButton,
  {
    marginTop: '1.2rem',
    background: vars.color.neutral_950,
  },
]);

export const loginIcon = style({
  justifySelf: 'start',
});

export const loginButtonText = style({
  whiteSpace: 'nowrap',
});
