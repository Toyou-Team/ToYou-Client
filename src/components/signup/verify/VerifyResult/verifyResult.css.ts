import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { withSafeBottom, withSafeTop } from '@/styles/safeArea';

export const pageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  // 헤더 제외 높이를 채워 버튼 하단 고정
  minHeight: `calc(100dvh - ${withSafeTop('6.8rem')})`,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',

  padding: '8.3rem 2.4rem 0',
});

export const title = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
  whiteSpace: 'pre-line',
});

export const description = style({
  marginTop: '1.4rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  whiteSpace: 'pre-line',
});

export const infoBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.8rem',

  marginTop: '2.4rem',
  padding: '2rem 2.6rem',

  borderRadius: '2.4rem',
  backgroundColor: vars.color.neutral_100,
});

export const infoTitle = style({
  ...vars.fontStyles.caption,
  fontWeight: 600,
  color: vars.color.neutral_950,
});

export const infoText = style({
  paddingLeft: '1.3rem',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
});

export const infoList = style([
  infoText,
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
]);

export const infoRows = style([infoBox, { gap: '0.8rem' }]);

export const accountCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.3rem',

  marginTop: '2.4rem',
  padding: '2rem',

  border: `1px solid ${vars.color.neutral_600}`,
  borderRadius: '2.4rem',
});

export const accountProvider = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const accountJoinedAt = style({
  ...vars.fontStyles.label,
  color: vars.color.neutral_600,
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
});

export const infoLabel = style({
  fontWeight: 600,
});

export const note = style({
  marginTop: '1.8rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  whiteSpace: 'pre-line',
});

export const bottomWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.7rem',

  marginTop: 'auto',
  padding: `4rem 2.4rem ${withSafeBottom('3.4rem')}`,
});

export const link = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2rem',
});
