import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@/styles/theme.css';

export const week = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',

  margin: '0 2rem',
  paddingBottom: '2rem',
  borderBottom: `1px solid ${vars.color.neutral_950}`,
});

export const weekHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
});

export const weekTitle = style({
  ...vars.fontStyles.enBodyBoldWide,
  color: vars.color.neutral_600,
});

export const days = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '0.6rem',
});

export const day = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',
});

// 가입 전·미래 날짜는 요일과 날짜를 흐리게
export const faded = style({});

export const today = style({});

export const weekday = style({
  ...vars.fontStyles.enLabel,
  color: vars.color.neutral_600,

  selectors: {
    [`${faded} &`]: { color: vars.color.neutral_300 },
  },
});

export const date = style({
  ...vars.fontStyles.enBody,
  color: vars.color.neutral_950,

  selectors: {
    [`${faded} &`]: { color: vars.color.neutral_300 },
    [`${today} &`]: { fontWeight: vars.fontStyles.enBodyBold.fontWeight },
  },
});

export const box = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    aspectRatio: '1',
    marginTop: '0.4rem',

    border: '1px solid transparent',
    ...vars.fontStyles.enBody,
    color: vars.color.neutral_950,
  },

  variants: {
    box: {
      empty: {},
      // 가입일
      dot: {
        selectors: {
          '&::after': {
            content: '""',
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            backgroundColor: vars.color.neutral_300,
          },
        },
      },
      // 첫 편지, 오늘 지급분을 다 쓴 날
      outlined: {
        borderColor: vars.color.neutral_950,
        backgroundColor: vars.color.neutral_50,
      },
      // 오늘 지급분이 남아 있는 날
      filled: {
        backgroundColor: vars.color.neutral_950,
        color: vars.color.neutral_50,
        fontWeight: vars.fontStyles.enBodyBold.fontWeight,
      },
      // 지급 예정
      dashed: {
        border: `1px dashed ${vars.color.neutral_300}`,
        backgroundColor: vars.color.neutral_50,
        color: vars.color.neutral_300,
      },
      // 첫 편지 전 오늘
      dashedStrong: {
        border: `1px dashed ${vars.color.neutral_600}`,
        backgroundColor: vars.color.neutral_50,
        color: vars.color.neutral_600,
      },
      // 지난 날 지급분을 다 쓴 날
      muted: {
        borderColor: vars.color.neutral_300,
        backgroundColor: vars.color.neutral_100,
      },
      // 소멸
      struck: {
        borderColor: vars.color.neutral_100,
        backgroundColor: vars.color.neutral_50,
        textDecoration: 'line-through',
      },
    },
  },
});

export const label = style({
  minHeight: '1.8rem',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
  whiteSpace: 'nowrap',

  selectors: {
    [`${today} &`]: { color: vars.color.neutral_950, fontWeight: vars.fontStyles.title.fontWeight },
  },
});
