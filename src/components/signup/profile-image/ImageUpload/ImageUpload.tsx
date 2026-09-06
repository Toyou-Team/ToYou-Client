'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button/Button';
import { IcProfileImage, IcTrashCan } from '@/assets/icons';
import { ImageActionSheet } from '../ImageActionSheet/ImageActionSheet';

import * as styles from './imageUpload.css';

export function ImageUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = '';

    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageClick = () => {
    if (previewUrl) {
      setIsActionSheetOpen(true);
      return;
    }
    openFilePicker();
  };

  const handleChangeImage = () => {
    setIsActionSheetOpen(false);
    openFilePicker();
  };

  const handleDeleteImage = () => {
    setIsActionSheetOpen(false);
    setPreviewUrl(null);
  };

  const handleNext = () => {
    // TODO: 가입 API 연결 시 이미지 파일 전달
    router.push('/signup/terms');
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <section className={styles.profileWrapper}>
        <div className={styles.profileImageWrapper}>
          {previewUrl ? (
            <img src={previewUrl} alt="선택한 프로필 사진" className={styles.profileImage} onClick={handleImageClick} />
          ) : (
            <IcProfileImage className={styles.profileImage} onClick={handleImageClick} />
          )}

          <button
            type="button"
            className={styles.imageChangeButton}
            onClick={handleImageClick}
            aria-label={previewUrl ? '프로필 사진 변경 또는 삭제' : '프로필 사진 선택'}
          >
            {previewUrl ? <IcTrashCan /> : '+'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleImageChange}
        />
      </section>

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" onClick={handleNext}>
          다음
        </Button>
      </div>

      <ImageActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onChangeImage={handleChangeImage}
        onDeleteImage={handleDeleteImage}
      />
    </>
  );
}

export default ImageUpload;
