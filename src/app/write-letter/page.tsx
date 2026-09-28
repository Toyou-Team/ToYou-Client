'use client';

import { ChangeEvent, useRef, useState } from 'react';

import Button from '@/components/common/Button/Button';
import * as styles from './write-letter.css';
import { IcClose, IcImage, IcMusic, IcXNeutral600 } from '@/assets/icons';
import { ImageActionSheet } from '@/components/signup/profile-image/ImageActionSheet/ImageActionSheet';
import { MusicPicker } from '@/components/write-letter/MusicPicker/MusicPicker';
import type { SpotifyTrack } from '@/common/apis/music';
import { useCreateLetterMutation } from '@/common/apis/letter';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { useRouter } from 'next/navigation';

const MIN_LENGTH = 30;
const MAX_LENGTH = 500;

export default function WriteLetterPage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: createLetter, isPending: isSending } = useCreateLetterMutation();

  const [message, setMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidBody = message.trim().length >= MIN_LENGTH;

  const handleClose = () => {
    router.back();
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value.slice(0, MAX_LENGTH));
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

  const handleSubmitClick = () => {
    open(({ close }) => (
      <Modal
        title="편지 보내기"
        description={
          <>
            보낸 편지는 수정하거나 되돌릴 수 없어요.
            <br />
            이대로 보낼까요?
          </>
        }
        confirmText="보내기"
        cancelText="다음에"
        onConfirm={() => {
          close();
          createLetter(
            { body: message.trim(), spotifyTrackId: selectedTrack?.id },
            { onSuccess: () => router.push('/home') },
          );
        }}
        onClose={close}
      />
    ));
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

      <section className={styles.letter({ withTrack: Boolean(selectedTrack) })}>
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

        {selectedTrack && (
          <div className={styles.selectedTrackChip}>
            <img src={selectedTrack.albumImageUrl} alt="" className={styles.selectedTrackImage} />

            <div className={styles.selectedTrackInfo}>
              <div className={styles.selectedTrackTitleRow}>
                <p className={styles.selectedTrackTitle}>{selectedTrack.title}</p>

                <button
                  type="button"
                  className={styles.removeTrackButton}
                  onClick={() => setSelectedTrack(null)}
                  aria-label="음악 제거"
                >
                  <IcXNeutral600 />
                </button>
              </div>

              <p className={styles.selectedTrackArtist}>{selectedTrack.artists.join(', ')}</p>
            </div>
          </div>
        )}

        <div className={styles.attachments}>
          <button
            type="button"
            className={styles.attachmentButton({ active: Boolean(backgroundImage) })}
            onClick={handlePhotoButtonClick}
          >
            <IcImage />
            사진
          </button>

          <button
            type="button"
            className={styles.attachmentButton({ active: Boolean(selectedTrack) })}
            onClick={() => setIsMusicPickerOpen(true)}
          >
            <IcMusic />
            음악
          </button>
        </div>
      </section>

      <div className={styles.submitButtonWrapper}>
        <Button type="button" disabled={!isValidBody || isSending} onClick={handleSubmitClick}>
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

      {isMusicPickerOpen && (
        <MusicPicker
          initialTrack={selectedTrack}
          onClose={() => setIsMusicPickerOpen(false)}
          onConfirm={(track) => {
            setSelectedTrack(track);
            setIsMusicPickerOpen(false);
          }}
        />
      )}
    </main>
  );
}
