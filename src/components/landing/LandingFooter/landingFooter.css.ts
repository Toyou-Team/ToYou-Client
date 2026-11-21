import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { withSafeBottom } from '@/styles/safeArea';

export const footer = style({
  width: '100%',
  marginTop: '16rem',
  padding: `3.6rem 2rem ${withSafeBottom('4rem')}`,
  background: vars.color.neutral_100,
});

export const policyLinks = style({
  display: 'flex',
  gap: '4.8rem',
  paddingBottom: '1.6rem',
  borderBottom: `1px solid ${vars.color.neutral_300}`,
});

export const policyLink = style({
  ...vars.fontStyles.caption,
  fontWeight: vars.fontStyles.title.fontWeight,
  color: vars.color.neutral_950,
});

export const infoList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  marginTop: '1.6rem',
});

export const infoRow = style({
  display: 'grid',
  gridTemplateColumns: '9rem 1fr',
  ...vars.fontStyles.label,
  fontWeight: vars.fontStyles.caption.fontWeight,
  color: vars.color.neutral_600,
});

export const infoValue = style({
  color: vars.color.neutral_600,
});

export const copyright = style({
  marginTop: '3.6rem',
  ...vars.fontStyles.enLabel,
  color: vars.color.neutral_600,
});
