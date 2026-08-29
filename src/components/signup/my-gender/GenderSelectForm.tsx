'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import * as styles from './genderSelectForm.css';

export const GENDER_OPTIONS = ['남성', '여성', '모두'] as const;

export type Gender = (typeof GENDER_OPTIONS)[number];

interface GenderSelectFormProps {
  options: readonly string[];
  description?: string;
}

function GenderSelectForm({ options, description }: GenderSelectFormProps) {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  return (
    <>
      <div className={styles.buttonWrapper}>
        {options.map((gender) => {
          const isSelected = selectedGender === gender;

          return (
            <Button
              key={gender}
              type="button"
              onClick={() => setSelectedGender(gender)}
              outlined={!isSelected}
              selected={isSelected}
            >
              {gender}
            </Button>
          );
        })}

        {description && <span className={styles.descriptionWrapper}>{description}</span>}
      </div>

      <div className={styles.bottomButtonWrapper}>
        <Button disabled={selectedGender === null}>다음</Button>
      </div>
    </>
  );
}

export default GenderSelectForm;
