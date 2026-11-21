import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { withSafeTop, withSafeBottom } from '@/styles/safeArea';

export const landingPageWrapper = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  minHeight: '100dvh',

  padding: `${withSafeTop('3rem')} 0 ${withSafeBottom('3rem')}`,

  selectors: {
    // 푸터가 있는 웹 브라우저는 첫 화면에 푸터까지 보이도록 높이 고정 해제
    '&:has(+ footer)': { minHeight: 'auto' },
  },
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
