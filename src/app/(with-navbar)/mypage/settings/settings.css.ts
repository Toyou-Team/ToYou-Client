import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
});

export const headerTitle = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3.6rem',

  padding: '1.6rem 2.4rem 4rem',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const sectionTitle = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const rowList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: '100%',
  minHeight: '2.4rem',

  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
  textAlign: 'left',
  cursor: 'pointer',
});

export const deviceBanner = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.1rem',

  width: '100%',
  padding: '1.5rem 1.7rem',
  borderRadius: '1.8rem',

  backgroundColor: vars.color.neutral_100,
  textAlign: 'left',
  cursor: 'pointer',
});

export const deviceBannerContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',
});

export const deviceBannerIcon = style({
  flexShrink: 0,

  width: '2.4rem',
  height: '2.4rem',
});

export const deviceBannerText = style({
  display: 'flex',
  flexDirection: 'column',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const deviceBannerTitle = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const deviceBannerButton = style({
  flexShrink: 0,

  padding: '0.8rem 1.6rem',
  borderRadius: '10rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_50,
  backgroundColor: vars.color.neutral_900,
});

export const toggleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const description = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const version = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const withdrawLink = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_600,
});
