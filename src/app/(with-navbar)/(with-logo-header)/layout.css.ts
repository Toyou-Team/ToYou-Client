import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

export const headerText = style({
  ...vars.fontStyles.enDisplay,
  color: vars.color.neutral_950,
});
