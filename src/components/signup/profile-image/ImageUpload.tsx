'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button/Button';
import { IcProfileImage } from '@/assets/icons';

import * as styles from './imageUpload.css';

export function ImageUpload() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleNext = () => {
    // TODO: 이미지 업로드/useKakaoProfileImage 값 저장은 가입 API 붙일 때
    router.push('/signup/terms');
  };

  return (
    <>
      <div className={styles.profileWrapper}>
        <label htmlFor="profile-image" className={styles.profileImageWrapper}>
          {previewUrl ? (
            <img src={previewUrl} alt="선택한 프로필 사진" className={styles.profileImage} />
          ) : (
            <IcProfileImage />
          )}

          <span className={styles.imageUploadButton}>+</span>
        </label>

        <input
          id="profile-image"
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleImageChange}
        />
      </div>

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={!imageFile} onClick={handleNext}>
          다음
        </Button>
      </div>
    </>
  );
}

export default ImageUpload;
