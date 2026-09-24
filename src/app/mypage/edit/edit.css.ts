import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const saveButton = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_900,

  cursor: 'pointer',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
  padding: '0 2.4rem 4rem',
});

export const nicknameFieldWrapper = style({
  marginTop: '3.6rem',
});

export const fieldLabel = style({
  display: 'block',

  ...vars.fontStyles.label,
  color: vars.color.neutral_600,

  marginBottom: '0.8rem',
});

export const infoSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  marginTop: '4.4rem',
});

export const infoTitle = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const infoRowWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',

  height: '2.9rem',
});

export const infoLabel = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const infoValue = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_600,
});
