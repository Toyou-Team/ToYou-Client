'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useSignupMutation, type SignupPayload } from '@/common/apis/auth';
import { kakaoProfileStore, registrationTokenStore, setTokens, signupDraftStore } from '@/common/apis/token';
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
}

export function TermsForm() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignupMutation();

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
    const registrationToken = registrationTokenStore.get();
    const draft = signupDraftStore.get();

    // 가입 정보가 비어 있으면 처음부터
    if (!registrationToken || !draft.nickname || !draft.receiveGender) {
      router.replace('/signup/nickname');
      return;
    }

    const kakaoGender = kakaoProfileStore.get()?.gender;
    const payload: SignupPayload = {
      registrationToken,
      nickname: draft.nickname,
      receiveGender: draft.receiveGender,
      useKakaoProfileImage: draft.useKakaoProfileImage ?? false,
      // 카카오 응답에 성별이 없을 때만 gender 전달
      ...(!kakaoGender && draft.gender ? { gender: draft.gender } : {}),
    };

    signup(payload, {
      onSuccess: (result) => {
        setTokens(result);
        signupDraftStore.clear();
        registrationTokenStore.clear();
        kakaoProfileStore.clear();
        router.replace('/home');
      },
      onError: (error) => {
        // TODO: 닉네임 중복 · 가입 토큰 만료 등 에러 안내
        console.error('[signup]', error);
      },
    });
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
          <Button type="submit" disabled={!isAllRequired || isPending}>
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
