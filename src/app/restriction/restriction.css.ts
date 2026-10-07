import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
  minHeight: '100dvh',
  backgroundColor: vars.color.neutral_50,
});

export const headerTitle = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  padding: '3.2rem 2.4rem 0',
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const description = style({
  marginTop: '0.8rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  marginTop: '1.5rem',
});

export const sectionLabel = style({
  fontSize: '1.3rem',
  fontWeight: 600,
  color: vars.color.neutral_950,
});

export const infoText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

export const bodyText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const subText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});

export const warningBox = style({
  padding: '1.6rem 2.2rem',

  borderRadius: '1.6rem',
  backgroundColor: vars.color.neutral_100,

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const bottomWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  marginTop: 'auto',
  padding: '3rem 2.4rem 4rem',
});

export const contactLink = style({
  marginTop: '1.7rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2rem',
});

export const contactNotice = style({
  marginTop: '0.8rem',

  ...vars.fontStyles.label,
  fontWeight: 400,
  color: vars.color.neutral_600,
});
