import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';
import { recipe } from '@vanilla-extract/recipes';

export const letterCardWrapper = style({
  position: 'relative',
  overflow: 'hidden',

  margin: '0 auto',
  borderRadius: '2.4rem',
});

export const letterCardBackground = style({
  zIndex: 0,
  objectFit: 'cover',
});

export const profileWrapper = style({
  position: 'relative',
  zIndex: 1,

  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',

  padding: '2.1rem 2.4rem 0 2.1rem',
});

export const profileImage = style({
  position: 'relative',
  width: '4.3rem',
  height: '4.3rem',
  overflow: 'hidden',
  flexShrink: 0,

  borderRadius: '50%',
  backgroundColor: vars.color.neutral_900,
});

export const nickname = style({
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
});

export const expiresText = style({
  marginLeft: 'auto',
  flexShrink: 0,

  padding: '0.6rem 1.2rem',
  borderRadius: '2rem',

  ...vars.fontStyles.label,

  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  color: vars.color.neutral_950,
});

export const messageWrapper = style({
  position: 'absolute',
  top: '50%',
  left: '2.1rem',
  right: '2.1rem',
  zIndex: 1,

  padding: '1.5rem 2rem',

  transform: 'translateY(-50%)',
  backgroundColor: vars.color.neutral_50,
});

export const message = style({
  ...vars.fontStyles.body,

  whiteSpace: 'pre-line',
  color: vars.color.neutral_950,
});
