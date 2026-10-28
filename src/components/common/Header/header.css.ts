import { vars } from '@/styles/theme.css';
import { Z_INDEX } from '@/constants/zIndex';
import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const headerWrapper = recipe({
  base: {
    zIndex: Z_INDEX.HEADER,
    top: 0,
    display: 'flex',
    width: '100%',
    height: '6.8rem',
    color: vars.color.neutral_950,
    backgroundColor: 'white',
  },
  variants: {
    isSticky: {
      true: {
        position: 'sticky',
      },
      false: {
        position: 'relative',
      },
    },
    bordered: {
      true: {
        height: '8rem',
        borderBottom: `1px solid ${vars.color.neutral_300}`,
      },
    },
  },
});

// 어두운 배경사진 첨부 시 흰 텍스트
export const onDark = style({
  color: vars.color.neutral_50,
});

globalStyle(`${onDark} svg [stroke]`, {
  stroke: vars.color.neutral_50,
});

export const leftElement = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',

  position: 'absolute',
  left: '2.8rem',
});

export const centerElement = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
});

export const rightElement = style({
  height: '100%',

  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  right: '2.8rem',
});
