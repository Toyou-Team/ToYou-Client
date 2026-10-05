import clsx from 'clsx';

import { IcCheckNeutral300 } from '@/assets/icons';

import * as styles from './checkBox.css';

interface CheckBoxProps {
  isChecked: boolean;
}

export function CheckBox({ isChecked }: CheckBoxProps) {
  return (
    <span className={clsx(styles.checkBox, isChecked && styles.checked)} aria-hidden>
      {isChecked && <IcCheckNeutral300 />}
    </span>
  );
}
