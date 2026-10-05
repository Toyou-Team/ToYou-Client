import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
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

export const reasonList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  marginTop: '4rem',
});

export const reasonButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,

  cursor: 'pointer',
});

export const detailInput = style({
  width: 'calc(100% - 3.8rem)',
  height: '7.9rem',
  marginTop: '0.8rem',
  marginLeft: '3.8rem',
  padding: '1rem 1.6rem',

  border: `1px solid ${vars.color.neutral_100}`,
  borderRadius: '0.8rem',
  outline: 'none',
  resize: 'none',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,

  '::placeholder': {
    color: vars.color.neutral_600,
  },
});

export const bottomButtonWrapper = style({
  position: 'sticky',
  bottom: '8.8rem',

  padding: '3.2rem 2.4rem',
  backgroundColor: vars.color.neutral_50,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',

  marginTop: '1.6rem',
});

export const sectionLabel = style({
  fontSize: '1.3rem',
  fontWeight: 600,
});

export const infoCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',

  padding: '2rem',

  border: `1px solid ${vars.color.neutral_100}`,
  borderRadius: '1.6rem',
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',

  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const infoValue = style({
  fontSize: '1.4rem',
  fontWeight: 600,
});

export const bodyText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
  whiteSpace: 'pre-line',
});

export const subText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
});

export const confirmCheck = style({
  alignSelf: 'flex-start',

  marginTop: 'auto',
  paddingTop: '4.7rem',

  ...vars.fontStyles.body,
});
