import { vars } from '@/styles/theme.css';
import { Z_INDEX } from '@/constants/zIndex';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.BACKDROP,

  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  height: '100dvh',
  backgroundColor: vars.color.neutral_50,
});

export const titleText = style({
  ...vars.fontStyles.title,
  color: vars.color.neutral_950,
});

export const searchFieldWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  flexShrink: 0,

  margin: '0.8rem 2.4rem',
  padding: '0.8rem 1.6rem',

  border: '1px solid rgba(238, 238, 238, 0.3)',
  borderRadius: '6rem',
  backgroundColor: 'rgba(254, 254, 254, 0.2)',
});

export const searchInput = style({
  flex: 1,

  border: 0,
  outline: 0,
  background: 'transparent',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,

  '::placeholder': {
    color: vars.color.neutral_600,
  },
});

export const list = style({
  flex: 1,
  overflowY: 'auto',

  display: 'flex',
  flexDirection: 'column',

  padding: '0 2.4rem',
  borderTop: `1px solid ${vars.color.neutral_300}`,
});

export const emptyText = style({
  marginTop: '4rem',
  textAlign: 'center',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const retryButton = style({
  width: 'fit-content',
  margin: '0.8rem auto 0',
  padding: 0,
  border: 0,

  background: 'transparent',
  ...vars.fontStyles.caption,
  color: vars.color.neutral_950,
  textDecoration: 'underline',

  cursor: 'pointer',
});

export const sentinel = style({
  height: '1px',
});

export const loadingText = style({
  padding: '1.6rem 0',
  textAlign: 'center',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const trackRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.6rem',

  width: '100%',
  padding: '1rem 0',
  border: 0,
  background: 'transparent',
  borderBottom: `1px solid ${vars.color.neutral_300}`,

  textAlign: 'left',
  cursor: 'pointer',
});

export const albumImage = style({
  flexShrink: 0,

  width: '5rem',
  height: '5rem',
  objectFit: 'cover',
});

export const trackInfo = style({
  flex: 1,
  minWidth: 0,

  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

export const trackTitle = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const trackArtist = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',

  overflow: 'hidden',
});

export const artistName = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
});

export const checkIcon = style({
  flexShrink: 0,
});

export const confirmButtonWrapper = style({
  flexShrink: 0,
  padding: '1.6rem 2.4rem 3.4rem',
});
