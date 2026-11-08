'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { AGREE_DATA } from '@/constants';

import { AllAgreeCheckboxField } from '../AllAgreeCheckboxField/AllAgreeCheckboxField';
import { TermCheckboxField } from '../TermCheckboxField/TermCheckboxField';
import { PolicySheet } from '../PolicySheet/PolicySheet';

import * as styles from './termsForm.css';

interface TermsFormData {
  agree1: boolean;
  agree2: boolean;
  agree3: boolean;
  agree4: boolean;
}

const MARKETING_ID = 3;
const NIGHT_ID = 4;

export function TermsForm() {
  const router = useRouter();

  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const selectedPolicy = AGREE_DATA.find((data) => data.id === selectedPolicyId);

  const { watch, setValue, handleSubmit } = useForm<TermsFormData>({
    defaultValues: {
      agree1: false,
      agree2: false,
      agree3: false,
      agree4: false,
    },
  });

  const agree1 = watch('agree1');
  const agree2 = watch('agree2');
  const agree3 = watch('agree3');
  const agree4 = watch('agree4');

  const handleClickAllCheckBox = useCallback(() => {
    const formData = watch();
    const allChecked = Object.values(formData).every(Boolean);
    const newValue = !allChecked;

    (Object.keys(formData) as Array<keyof TermsFormData>).forEach((key) => {
      setValue(key, newValue, { shouldValidate: true });
    });
  }, [setValue, watch]);

  // 야간은 광고성 동의가 있어야 해서, 야간을 켜면 광고성도 켜고 광고성을 끄면 야간도 끈다
  const handleSingleChecked = useCallback(
    (id: number, checked: boolean) => {
      const next = !checked;
      setValue(`agree${id}` as keyof TermsFormData, next, { shouldValidate: true });

      if (id === NIGHT_ID && next) setValue('agree3', true, { shouldValidate: true });
      if (id === MARKETING_ID && !next) setValue('agree4', false, { shouldValidate: true });
    },
    [setValue],
  );

  const isAllRequired = useMemo(() => agree1 && agree2, [agree1, agree2]);

  const isAllChecked = useMemo(() => [agree1, agree2, agree3, agree4].every(Boolean), [agree1, agree2, agree3, agree4]);

  const onSubmit = () => {
    signupDraftStore.patch({ marketingPushAgreed: agree3, nightPushAgreed: agree4 });
    router.push('/signup/nickname');
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
                detail={data.detail}
                description={data.description}
                onChangeChecked={handleSingleChecked}
                onClickView={() => setSelectedPolicyId(data.policyId ?? data.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.bottomButtonWrapper}>
          <Button type="submit" disabled={!isAllRequired}>
            완료
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
