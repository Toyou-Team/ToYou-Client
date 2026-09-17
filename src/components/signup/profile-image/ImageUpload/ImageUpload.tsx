'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import { IcProfileImage, IcTrashCan } from '@/assets/icons';
import { ImageActionSheet } from '../ImageActionSheet/ImageActionSheet';

import * as styles from './imageUpload.css';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export function ImageUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // 이전에 골랐던 사진 기억
  useEffect(() => {
    const draft = signupDraftStore.get();

    if (draft.profileImagePreview) setPreviewUrl(draft.profileImagePreview);
  }, []);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = '';

    if (!file) return;
    setPreviewUrl(await readFileAsDataUrl(file));
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
    signupDraftStore.patch({
      useKakaoProfileImage: false,
      profileImagePreview: previewUrl ?? undefined,
    });
    router.push('/signup/terms');
  };

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
