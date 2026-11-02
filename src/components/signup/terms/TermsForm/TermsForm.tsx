'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { AGREE_DATA } from '@/constants';

import { AllAgreeCheckboxField } from '../AllAgreeCheckboxField/AllAgreeCheckboxField';
import { TermCheckboxField } from '../TermCheckboxField/TermCheckboxField';
import { PolicySheet } from '../PolicySheet/PolicySheet';

import * as styles from './termsForm.css';

// agree3: 광고성 정보 수신 동의(앱 푸시), agree4: 야간 수신 동의
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

  // 야간 수신은 광고성 동의가 있어야 선택할 수 있고, 광고성을 해제하면 함께 해제된다
  const handleSingleChecked = useCallback(
    (id: number, checked: boolean) => {
      if (id === NIGHT_ID && !watch('agree3')) return;

      const fieldName = `agree${id}` as keyof TermsFormData;

      setValue(fieldName, !checked, {
        shouldValidate: true,
      });
      if (id === MARKETING_ID && checked) setValue('agree4', false, { shouldValidate: true });
    },
    [setValue, watch],
  );

  const isAllRequired = useMemo(() => agree1 && agree2, [agree1, agree2]);

  const isAllChecked = useMemo(() => [agree1, agree2, agree3, agree4].every(Boolean), [agree1, agree2, agree3, agree4]);

  // 선택 동의는 가입 요청 때 함께 보낸다
  const onSubmit = () => {
    signupDraftStore.patch({ marketingPushAgreed: agree3, nightPushAgreed: agree3 && agree4 });
    router.push('/signup/nickname');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.termsFormWrapper}>
        <div>
          <AllAgreeCheckboxField isAllChecked={isAllChecked} onClick={handleClickAllCheckBox} />

          <div className={styles.termCheckboxListContainer}>
            {AGREE_DATA.map((data) => (
              <Fragment key={data.id}>
                <TermCheckboxField
                  id={data.id}
                  text={data.text}
                  isChecked={watch(`agree${data.id}` as keyof TermsFormData)}
                  isRequired={data.type === 'required'}
                  isDisabled={data.id === NIGHT_ID && !agree3}
                  onChangeChecked={handleSingleChecked}
                  onClickView={() => setSelectedPolicyId(data.id)}
                />
                {/* TODO: 디자인 적용. 시안은 광고성 정보 수신 동의 아래 '앱 푸시' 하위 항목 */}
                {data.id === MARKETING_ID && (
                  <p className={styles.marketingNote}>
                    앱 푸시로 기능 업데이트 및 이벤트, 할인 혜택까지 빠르게 받아보실 수 있어요.
                  </p>
                )}
              </Fragment>
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
