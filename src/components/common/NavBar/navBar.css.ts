import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const navBarWrapper = style({
  position: 'sticky',
  bottom: '0',

  display: 'flex',
  justifyContent: 'space-between',

  width: '100%',
  height: '8.8rem',

  backgroundColor: vars.color.neutral_50,
});

export const navItemWrapper = style({
  position: 'relative',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.2rem',

  width: '100%',
  height: '100%',

  borderTop: `1px solid ${vars.color.neutral_300}`,
});

export const navItemIcon = style({
  position: 'relative',
  display: 'flex',
});

export const unreadDot = style({
  position: 'absolute',
  top: '-0.5rem',
  right: '-0.9rem',

  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '50%',

  backgroundColor: vars.color.neutral_950,
});

export const navItemLabel = recipe({
  base: {
    ...vars.fontStyles.label,
  },
  variants: {
    isActive: {
      true: { color: vars.color.neutral_900 },
      false: { color: vars.color.neutral_300 },
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export const tooltip = style({
  position: 'absolute',
  bottom: 'calc(100% + 1.2rem)',
  left: '37.5%',
  transform: 'translateX(-50%)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '16.5rem',
  height: '3rem',
  padding: '0.4rem 1.2rem',

  borderRadius: '0.8rem',
  backgroundColor: vars.color.neutral_950,

  ...vars.fontStyles.caption,
  color: vars.color.neutral_50,
  whiteSpace: 'nowrap',

  pointerEvents: 'none',

  // 툴팁 꼬리(▼)
  '::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',

    borderWidth: '0.6rem 0.5rem 0',
    borderStyle: 'solid',
    borderColor: `${vars.color.neutral_950} transparent transparent`,
  },
});

export const tooltipStrong = style({
  fontWeight: 600,
});
