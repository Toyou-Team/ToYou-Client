'use client';

import Button from '@/components/common/Button/Button';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo, useState } from 'react';

import { AllAgreeCheckboxField } from '../AllAgreeCheckboxField/AllAgreeCheckboxField';
import { TermCheckboxField } from '../TermCheckboxField/TermCheckboxField';
import { PolicySheet } from '../PolicySheet/PolicySheet';

import * as styles from './termsForm.css';

import { AGREE_DATA } from '@/constants';

interface TermsFormData {
  agree1: boolean;
  agree2: boolean;
  agree3: boolean;
}

export function TermsForm() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const selectedPolicy = AGREE_DATA.find((data) => data.id === selectedPolicyId);

  const { watch, setValue, handleSubmit } = useForm<TermsFormData>({
    defaultValues: {
      agree1: false,
      agree2: false,
      agree3: false,
    },
  });

  const agree1 = watch('agree1');
  const agree2 = watch('agree2');
  const agree3 = watch('agree3');

  const handleClickAllCheckBox = useCallback(() => {
    const formData = watch();
    const allChecked = Object.values(formData).every(Boolean);
    const newValue = !allChecked;

    (Object.keys(formData) as Array<keyof TermsFormData>).forEach((key) => {
      setValue(key, newValue, { shouldValidate: true });
    });
  }, [setValue, watch]);

  const handleSingleChecked = useCallback(
    (id: number, checked: boolean) => {
      const fieldName = `agree${id}` as keyof TermsFormData;

      setValue(fieldName, !checked, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const isAllRequired = useMemo(() => agree1 && agree2, [agree1, agree2]);

  const isAllChecked = useMemo(() => [agree1, agree2, agree3].every(Boolean), [agree1, agree2, agree3]);

  const onSubmit = () => {
    const termsArray = [agree1, agree2, agree3];
    localStorage.setItem('terms', JSON.stringify(termsArray));

    // TODO: 여기서 POST /api/v1/auth/signup 호출 후 홈
    //router.push('/home');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.termsFormWrapper}>
        <div>
          <AllAgreeCheckboxField isAllChecked={isAllChecked} onClick={handleClickAllCheckBox} />

          <div className={styles.termCheckboxListContainer}>
            {AGREE_DATA.map((data) => (
              <TermCheckboxField
                key={data.id}
                id={data.id}
                text={data.text}
                isChecked={watch(`agree${data.id}` as keyof TermsFormData)}
                isRequired={data.type === 'required'}
                onChangeChecked={handleSingleChecked}
                onClickView={() => setSelectedPolicyId(data.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.bottomButtonWrapper}>
          <Button type="submit" disabled={!isAllRequired}>
            다음
          </Button>
        </div>
      </form>

      <PolicySheet
        isOpen={selectedPolicy !== undefined}
        onClose={() => setSelectedPolicyId(null)}
        title={selectedPolicy?.text ?? ''}
        content={selectedPolicy?.content ?? ''}
      />
    </>
  );
}
