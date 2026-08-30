import { memo } from 'react';

import * as styles from './allAgreeCheckboxField.css';
import { IcCheckCircleNeutral300, IcCheckCircleNeutral900 } from '@/assets/icons';

interface AllAgreeCheckboxProps {
  isAllChecked: boolean;
  onClick: () => void;
}

export const AllAgreeCheckboxField = memo(function AllAgreeCheckbox({ isAllChecked, onClick }: AllAgreeCheckboxProps) {
  return (
    <div className={styles.allAgreeCheckboxWrapper}>
      <input className={styles.hiddenInput} type="checkbox" id="all-check" />
      <label htmlFor="all-check" onClick={onClick}>
        {isAllChecked ? <IcCheckCircleNeutral900 /> : <IcCheckCircleNeutral300 />}
      </label>
      <span className={styles.allAgreeCheckboxText}>전체 동의</span>
    </div>
  );
});
