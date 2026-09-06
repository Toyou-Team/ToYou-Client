import { memo, useCallback } from 'react';

import * as styles from './termCheckboxField.css';
import { IcCheckNeutral300, IcCheckNeutral900 } from '@/assets/icons';

interface TermCheckboxProps {
  id: number;
  text: string;
  isChecked: boolean;
  isRequired: boolean;
  onChangeChecked: (id: number, checked: boolean) => void;
  onClickView?: () => void;
}

export const TermCheckboxField = memo(function TermCheckbox({
  id,
  text,
  isChecked,
  isRequired,
  onChangeChecked,
  onClickView,
}: TermCheckboxProps) {
  const inputId = `term-${id}`;

  const handleChange = useCallback(() => {
    onChangeChecked(id, isChecked);
  }, [id, isChecked, onChangeChecked]);

  return (
    <div className={styles.termCheckboxFieldWrapper}>
      <input className={styles.hiddenInput} type="checkbox" id={inputId} checked={isChecked} onChange={handleChange} />
      <label className={styles.termCheckboxLabel} htmlFor={inputId}>
        {isChecked ? (
          <IcCheckNeutral900 aria-hidden className={styles.checkIcon} />
        ) : (
          <IcCheckNeutral300 aria-hidden className={styles.checkIcon} />
        )}

        <span className={styles.termContent}>
          <span className={styles.termBox({ isRequired })}>{isRequired ? '필수' : '선택'}</span>
          <span className={styles.termText}>{text}</span>
        </span>
      </label>

      {isRequired && (
        <button type="button" className={styles.descriptionText} onClick={onClickView}>
          보기
        </button>
      )}
    </div>
  );
});
