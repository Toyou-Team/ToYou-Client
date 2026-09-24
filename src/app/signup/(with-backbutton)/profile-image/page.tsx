'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';

import * as styles from './profile-image.css';

export default function SignUpProfileImagePage() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이전에 골랐던 사진 기억
  useEffect(() => {
    const draft = signupDraftStore.get();

    if (draft.profileImagePreview) setPreviewUrl(draft.profileImagePreview);
  }, []);

  const handleNext = () => {
    signupDraftStore.patch({
      useKakaoProfileImage: false,
      profileImagePreview: previewUrl ?? undefined,
    });
    router.push('/signup/terms');
  };

  return (
    <>
      <div className={styles.profileImagePageWrapper}>
        <MemoizedStepIcon step={4} />
        <h1 className={styles.titleWrapper}>프로필 사진을 설정해주세요.</h1>
      </div>

      <ImageUpload value={previewUrl} onChange={setPreviewUrl} />

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" onClick={handleNext}>
          다음
        </Button>
      </div>
    </>
  );
}
