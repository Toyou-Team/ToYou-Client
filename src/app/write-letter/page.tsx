'use client';

import { ChangeEvent, useRef, useState } from 'react';

import Button from '@/components/common/Button/Button';
import * as styles from './write-letter.css';
import { IcClose, IcImage, IcMusic } from '@/assets/icons';
import { ImageActionSheet } from '@/components/signup/profile-image/ImageActionSheet/ImageActionSheet';
import { useRouter } from 'next/navigation';

const MAX_LENGTH = 500;

export default function WriteLetterPage() {
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    router.back();
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handlePhotoButtonClick = () => {
    if (backgroundImage) {
      setIsImageActionSheetOpen(true);
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    setBackgroundImage(URL.createObjectURL(file));
  };

  const handleChangeImage = () => {
    setIsImageActionSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    setBackgroundImage(null);
    setIsImageActionSheetOpen(false);
  };

  return (
    <main
      className={styles.page}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      <button type="button" className={styles.closeButton} aria-label="편지 쓰기 닫기" onClick={handleClose}>
        <IcClose />
      </button>

      <section className={styles.letter}>
        <div className={styles.messageWrapper}>
          <textarea
            value={message}
            onChange={handleMessageChange}
            maxLength={MAX_LENGTH}
            placeholder="오늘 어떤 하루를 보냈나요?"
            className={styles.message}
          />

          {message.length > 0 && (
            <span className={styles.characterCount}>
              {message.length} / {MAX_LENGTH}
            </span>
          )}
        </div>

        <div className={styles.attachments}>
          <button type="button" className={styles.attachmentButton} onClick={handlePhotoButtonClick}>
            <IcImage />
            사진
          </button>

          <button type="button" className={styles.attachmentButton}>
            <IcMusic />
            음악
          </button>
        </div>
      </section>

      <div className={styles.submitButtonWrapper}>
        <Button type="button" disabled={!message.trim()}>
          보내기
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleImageSelect}
      />
      <ImageActionSheet
        isOpen={isImageActionSheetOpen}
        onClose={() => setIsImageActionSheetOpen(false)}
        onChangeImage={handleChangeImage}
        onDeleteImage={handleDeleteImage}
      />
    </main>
  );
}
