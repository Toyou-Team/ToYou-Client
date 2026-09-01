import { typography } from './typography';

export const fontStyle = {
  // display
  display: {
    fontSize: typography.fontSize.scale[700],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
  },

  // title
  title: {
    fontSize: typography.fontSize.scale[600],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.default,
  },

  // subtitle
  subtitle: {
    fontSize: typography.fontSize.scale[500],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
  },

  // body
  body: {
    fontSize: typography.fontSize.scale[300],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.default,
  },

  // caption
  caption: {
    fontSize: typography.fontSize.scale[200],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.default,
  },

  // label
  label: {
    fontSize: typography.fontSize.scale[100],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
  },
};
