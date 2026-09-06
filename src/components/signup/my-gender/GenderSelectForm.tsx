'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import * as styles from './genderSelectForm.css';

export const GENDER_OPTIONS = ['남성', '여성', '모두'] as const;

export type Gender = (typeof GENDER_OPTIONS)[number];

interface GenderSelectFormProps {
  options: readonly string[];
  description?: string;
  nextPath: string;
}

function GenderSelectForm({ options, description, nextPath }: GenderSelectFormProps) {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = () => {
    // TODO: 선택값 저장은 가입 API 붙일 때
    router.push(nextPath);
  };

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
        <Button type="button" disabled={selectedGender === null} onClick={handleNext}>
          다음
        </Button>
      </div>
    </>
  );
}

export default GenderSelectForm;
