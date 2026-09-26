'use client';

import { ChangeEvent, useRef, useState, type CSSProperties } from 'react';

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

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onSelectFile?: (file: File) => void;
  onRemove?: () => void;
  size?: number;
  topSpacing?: number;
}

export function ImageUpload({
  value,
  onChange,
  onSelectFile,
  onRemove,
  size = 20,
  topSpacing = 6.3,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = '';

    if (!file) return;
    onChange(await readFileAsDataUrl(file));
    onSelectFile?.(file);
  };

  const handleImageClick = () => {
    if (value) {
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
    onChange(null);
    onRemove?.();
  };

  return (
    <section
      className={styles.profileWrapper}
      style={
        {
          '--profile-wrapper-top-spacing': `${topSpacing}rem`,
          '--profile-image-size': `${size}rem`,
          '--profile-image-button-size': `${size * 0.24}rem`,
        } as CSSProperties
      }
    >
      <div className={styles.profileImageWrapper}>
        {value ? (
          <img src={value} alt="선택한 프로필 사진" className={styles.profileImage} onClick={handleImageClick} />
        ) : (
          <IcProfileImage className={styles.profileImage} onClick={handleImageClick} />
        )}

        <button
          type="button"
          className={styles.imageChangeButton}
          onClick={handleImageClick}
          aria-label={value ? '프로필 사진 변경 또는 삭제' : '프로필 사진 선택'}
        >
          {value ? <IcTrashCan /> : '+'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleImageChange}
      />

      <ImageActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onChangeImage={handleChangeImage}
        onDeleteImage={handleDeleteImage}
      />
    </section>
  );
}

export default ImageUpload;
