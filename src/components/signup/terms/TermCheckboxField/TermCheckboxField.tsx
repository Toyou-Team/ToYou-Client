import { memo, useCallback } from 'react';

import * as styles from './termCheckboxField.css';
import { IcCheckNeutral300, IcCheckNeutral900 } from '@/assets/icons';

interface TermCheckboxProps {
  id: number;
  text: string;
  isChecked: boolean;
  isRequired: boolean;
  detail?: { title: string; description: string };
  onChangeChecked: (id: number, checked: boolean) => void;
  onClickView?: () => void;
}

export const TermCheckboxField = memo(function TermCheckbox({
  id,
  text,
  isChecked,
  isRequired,
  detail,
  onChangeChecked,
  onClickView,
}: TermCheckboxProps) {
  const inputId = `term-${id}`;

  const handleChange = useCallback(() => {
    onChangeChecked(id, isChecked);
  }, [id, isChecked, onChangeChecked]);

  const checkIcon = isChecked ? (
    <IcCheckNeutral900 aria-hidden className={styles.checkIcon} />
  ) : (
    <IcCheckNeutral300 aria-hidden className={styles.checkIcon} />
  );

  return (
    <>
      <div className={styles.termCheckboxFieldWrapper}>
        <input
          className={styles.hiddenInput}
          type="checkbox"
          id={inputId}
          checked={isChecked}
          onChange={handleChange}
        />
        <label className={styles.termCheckboxLabel} htmlFor={inputId}>
          {checkIcon}

          <span className={styles.termContent}>
            <span className={styles.termBox({ isRequired })}>{isRequired ? '필수' : '선택'}</span>
            <span className={styles.termText}>{text}</span>
          </span>
        </label>

        <button type="button" className={styles.descriptionText} onClick={onClickView}>
          보기
        </button>
      </div>

      {detail && (
        <div className={styles.detail}>
          <label className={styles.detailLabel} htmlFor={inputId}>
            {checkIcon}
            <span className={styles.detailTitle}>{detail.title}</span>
          </label>
          <p className={styles.detailDescription}>{detail.description}</p>
        </div>
      )}
    </>
  );
});
