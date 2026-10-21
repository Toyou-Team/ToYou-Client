import { typography } from './typography';

export const fontStyle = {
  // display
  display: {
    fontSize: typography.fontSize.scale[700],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // title
  title: {
    fontSize: typography.fontSize.scale[600],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // subtitle
  subtitle: {
    fontSize: typography.fontSize.scale[500],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // body
  body: {
    fontSize: typography.fontSize.scale[300],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // caption
  caption: {
    fontSize: typography.fontSize.scale[200],
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // label
  label: {
    fontSize: typography.fontSize.scale[100],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // 영문 (Montserrat)
  // 36 / Medium / -2.5%
  enDisplay: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[700],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // 20 / Medium / 10%
  enTitle: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[600],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.wide,
  },

  // 14 / Semibold / 10%
  enBodyBoldWide: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[300],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.wide,
  },

  // 14 / Semibold / -2.5%
  enBodyBold: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[300],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // 14 / Medium / -2.5%
  enBody: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[300],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.default,
  },

  // 11 / Medium / 10%
  enLabel: {
    fontFamily: typography.fontFamily.english,
    fontSize: typography.fontSize.scale[100],
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.default,
    letterSpacing: typography.letterSpacing.wide,
  },
};
