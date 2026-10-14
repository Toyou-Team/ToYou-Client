'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupMutation } from '@/common/apis/auth';
import { useUploadProfileImageMutation } from '@/common/apis/profile';
import { kakaoProfileStore, registrationTokenStore, setTokens, signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';

import * as styles from './profile-image.css';

export default function SignUpProfileImagePage() {
  const router = useRouter();
  const { mutate: signup, isPending: isSigningUp } = useSignupMutation();
  const { mutate: uploadProfileImage, isPending: isUploading } = useUploadProfileImageMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const goHome = () => router.replace('/home');

  // TODO: 업로드 실패 안내(토스트) 기획 확정 후 추가. 지금은 실패해도 사진 없이 홈으로 이동
  const uploadImage = (file: File) => uploadProfileImage(file, { onSettled: goHome });

  const handleComplete = () => {
    const registrationToken = registrationTokenStore.get();
    const draft = signupDraftStore.get();

    // 가입 정보가 비어 있으면 처음부터
    if (!registrationToken || !draft.nickname || !draft.gender || !draft.receiveGender) {
      router.replace('/signup/terms');
      return;
    }

    signup(
      {
        registrationToken,
        nickname: draft.nickname,
        // 카카오 성별이 아닌, 가입 화면에서 고른 성별 사용
        gender: draft.gender,
        receiveGender: draft.receiveGender,
        // 직접 고른 사진은 가입 후 사진 업로드 API로 따로 저장
        useKakaoProfileImage: false,
      },
      {
        onSuccess: (result) => {
          setTokens(result);
          signupDraftStore.clear();
          registrationTokenStore.clear();
          kakaoProfileStore.clear();

          if (imageFile) uploadImage(imageFile);
          else goHome();
        },
        onError: (error) => {
          // TODO: 닉네임 중복 · 가입 토큰 만료 등 에러 안내
          console.error('[signup]', error);
        },
      },
    );
  };

  return (
    <>
      <div className={styles.profileImagePageWrapper}>
        <MemoizedStepIcon step={4} />
        <h1 className={styles.titleWrapper}>프로필 사진을 설정해주세요.</h1>
      </div>

      <ImageUpload
        value={previewUrl}
        onChange={setPreviewUrl}
        onSelectFile={setImageFile}
        onRemove={() => setImageFile(null)}
      />

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={isSigningUp || isUploading} onClick={handleComplete}>
          완료
        </Button>
      </div>
    </>
  );
}
