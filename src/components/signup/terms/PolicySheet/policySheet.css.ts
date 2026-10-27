import { vars } from '@/styles/theme.css';
import { globalStyle, style } from '@vanilla-extract/css';

export const closeText = style({
  border: 0,
  background: 'transparent',

  ...vars.fontStyles.body,
  color: vars.color.neutral_600,

  marginTop: '1.4rem',
  cursor: 'pointer',
});

export const scrollArea = style({
  marginTop: '1.6rem',
  marginRight: '1.4rem',

  overflowY: 'auto',
  marginBottom: '3rem',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',

  ...vars.fontStyles.body,
  color: vars.color.neutral_900,
  wordBreak: 'keep-all',

  padding: '0 1.1rem 0 3.5rem',
});

export const tableWrapper = style({
  overflowX: 'auto',
});

globalStyle(`${content} h3`, {
  ...vars.fontStyles.subtitle,
  color: vars.color.neutral_950,
  marginTop: '1.6rem',
});

globalStyle(`${content} h4`, {
  ...vars.fontStyles.body,
  fontWeight: 700,
  color: vars.color.neutral_950,
  marginTop: '0.8rem',
});

globalStyle(`${content} strong`, {
  fontWeight: 700,
});

globalStyle(`${content} ol`, {
  listStyle: 'decimal',
  paddingLeft: '2rem',
});

globalStyle(`${content} ul`, {
  listStyle: 'disc',
  paddingLeft: '2rem',
});

// 전역 리셋이 li 마커를 없애서 목록 스타일을 다시 물려받게
globalStyle(`${content} li`, {
  listStyle: 'inherit',
});

globalStyle(`${content} hr`, {
  width: '100%',
  border: 0,
  borderTop: `1px solid ${vars.color.neutral_300}`,
  margin: '0.8rem 0',
});

globalStyle(`${content} table`, {
  minWidth: '100%',
  borderCollapse: 'collapse',
  ...vars.fontStyles.caption,
});

globalStyle(`${content} th, ${content} td`, {
  minWidth: '8rem',
  padding: '0.6rem 0.8rem',
  border: `1px solid ${vars.color.neutral_300}`,
  textAlign: 'left',
  verticalAlign: 'top',
});

globalStyle(`${content} th`, {
  backgroundColor: vars.color.neutral_100,
  fontWeight: 700,
});
