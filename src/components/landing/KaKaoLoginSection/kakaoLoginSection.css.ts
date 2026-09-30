import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const loginButtonSectionWrapper = style({
  width: '100%',
  marginTop: 'auto',
  paddingTop: '3.2rem',
  paddingInline: '2.4rem',
});

export const kakaoLoginButton = style({
  width: '100%',

  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  columnGap: '6.5rem',

  height: '5.5rem',

  borderRadius: '1.2rem',
  backgroundColor: '#FFE400',
  padding: '0 2rem',
});

export const kakaoLoginIcon = style({
  justifySelf: 'end',
});

export const kakaoLoginButtonText = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,

  whiteSpace: 'nowrap',
});
