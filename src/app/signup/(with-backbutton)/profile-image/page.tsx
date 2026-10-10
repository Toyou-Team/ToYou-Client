'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupMutation, type SignupPayload } from '@/common/apis/auth';
import { kakaoProfileStore, registrationTokenStore, setTokens, signupDraftStore } from '@/common/apis/token';
import { useSignupDraft } from '@/common/hooks/useSignupDraft';
import Button from '@/components/common/Button/Button';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';

import * as styles from './profile-image.css';

export default function SignUpProfileImagePage() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignupMutation();
  // 이전에 골랐던 사진 기억
  const savedPreviewUrl = useSignupDraft('profileImagePreview');
  const [pickedUrl, setPreviewUrl] = useState<string | null | undefined>(undefined);
  const previewUrl = pickedUrl === undefined ? (savedPreviewUrl ?? null) : pickedUrl;

  // 가입 마지막 단계
  const handleComplete = () => {
    signupDraftStore.patch({
      useKakaoProfileImage: false,
      profileImagePreview: previewUrl ?? undefined,
    });

    const registrationToken = registrationTokenStore.get();
    const draft = signupDraftStore.get();

    // 가입 정보가 비어 있으면 처음부터
    if (!registrationToken || !draft.nickname || !draft.receiveGender) {
      router.replace('/signup/terms');
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
      <div className={styles.profileImagePageWrapper}>
        <MemoizedStepIcon step={4} />
        <h1 className={styles.titleWrapper}>프로필 사진을 설정해주세요.</h1>
      </div>

      <ImageUpload value={previewUrl} onChange={setPreviewUrl} />

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={isPending} onClick={handleComplete}>
          완료
        </Button>
      </div>
    </>
  );
}
