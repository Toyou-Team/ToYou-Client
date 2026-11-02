import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/styles/theme.css';

export const termCheckboxFieldWrapper = style({
  display: 'flex',
  height: '2.4rem',
  justifyContent: 'space-between',

  alignItems: 'center',
  padding: '0 2.7rem',
});

export const hiddenInput = style({
  display: 'none',
});

export const termCheckboxLabel = style({
  display: 'flex',
  alignItems: 'center',

  gap: '0.8rem',
});

export const checkIcon = style({
  marginRight: '0.7rem',
});

export const termContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
});

export const termBox = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    width: '3.3rem',
    height: '2.2rem',
    borderRadius: '0.4rem',

    ...vars.fontStyles.label,
  },

  variants: {
    isRequired: {
      true: {
        backgroundColor: vars.color.neutral_900,
        color: vars.color.neutral_100,
      },
      false: {
        backgroundColor: vars.color.neutral_100,
        color: vars.color.neutral_600,
      },
    },
  },
});

export const termText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_950,
});

export const detail = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  padding: '0 2.7rem 0 7.2rem',
});

export const detailLabel = style({
  display: 'flex',
  alignItems: 'center',
});

export const detailTitle = style({
  ...vars.fontStyles.caption,
  fontWeight: 600,
  color: vars.color.neutral_600,
});

export const detailDescription = style({
  ...vars.fontStyles.caption,
  color: vars.color.neutral_600,
  wordBreak: 'keep-all',
});

export const descriptionText = style({
  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  cursor: 'pointer',
});
