'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Gender, ReceiveGender } from '@/common/apis/auth';
import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import * as styles from './genderSelectForm.css';

export const GENDER_OPTIONS = ['남성', '여성', '모두'] as const;

type GenderLabel = (typeof GENDER_OPTIONS)[number];

const LABEL_TO_VALUE: Record<GenderLabel, ReceiveGender> = {
  남성: 'MALE',
  여성: 'FEMALE',
  모두: 'ALL',
};

interface GenderSelectFormProps {
  options: readonly string[];
  description?: string;
  nextPath: string;
  draftKey: 'gender' | 'receiveGender';
}

function GenderSelectForm({ options, description, nextPath, draftKey }: GenderSelectFormProps) {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  // 이전에 선택했던 값 복원
  useEffect(() => {
    const saved = signupDraftStore.get()[draftKey];
    if (!saved) return;

    const label = (Object.keys(LABEL_TO_VALUE) as GenderLabel[]).find((key) => LABEL_TO_VALUE[key] === saved);

    if (label && options.includes(label)) setSelectedGender(label);
  }, [draftKey, options]);

  const handleNext = () => {
    if (selectedGender === null) return;

    const value = LABEL_TO_VALUE[selectedGender as GenderLabel];
    // my-gender 스텝(options: 남성/여성)에서는 항상 MALE/FEMALE
    signupDraftStore.patch(draftKey === 'gender' ? { gender: value as Gender } : { receiveGender: value });

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
