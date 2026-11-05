import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const mypageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  width: '100%',
  padding: '0 2.4rem 4rem',
});

export const profileCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',
  padding: '2rem',

  marginTop: '1.6rem',
  border: `1px solid ${vars.color.neutral_100}`,
  borderRadius: '1.2rem',
});

export const profileImageWrapper = style({
  flexShrink: 0,
  overflow: 'hidden',

  width: '5.7rem',
  height: '5.7rem',
  borderRadius: '50%',
  backgroundColor: vars.color.neutral_100,
});

export const profileImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const profileTextWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  flex: 1,
});

export const nickname = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const profileEditText = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const settingSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  marginTop: '4.4rem',
});

export const settingGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
});

export const accountGroup = style([settingGroup, { marginTop: '3rem' }]);

export const sectionTitle = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const settingItem = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: '100%',
  height: '2.4rem',
});

export const rowRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

export const rowValue = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_600,
});
