'use client';

import { ChangeEvent, use, useRef, useState } from 'react';

import Button from '@/components/common/Button/Button';
import * as styles from './write-letter.css';
import { IcClose, IcImage, IcMusic, IcXNeutral600 } from '@/assets/icons';
import { ImageActionSheet } from '@/components/signup/profile-image/ImageActionSheet/ImageActionSheet';
import { MusicPicker } from '@/components/write-letter/MusicPicker/MusicPicker';
import type { SpotifyTrack } from '@/common/apis/music';
import { deleteLetterImage, useCreateLetterMutation, useUploadLetterImageMutation } from '@/common/apis/letter';
import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useSendMessageMutation } from '@/common/apis/conversation';
import { useReplyMutation } from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { useRouter } from 'next/navigation';

const MIN_LENGTH = 30;
const MAX_LENGTH = 500;

interface WriteLetterPageProps {
  // replyTo: 첫 답장할 편지의 deliveryId, conversationId: 대화방에서 이어 보내는 답장
  searchParams: Promise<{ replyTo?: string; conversationId?: string }>;
}

export default function WriteLetterPage({ searchParams }: WriteLetterPageProps) {
  const { replyTo, conversationId } = use(searchParams);
  const router = useRouter();
  const { open } = useModal();
  const { mutate: createLetter, isPending: isCreating } = useCreateLetterMutation();
  const { mutate: sendReply, isPending: isReplying } = useReplyMutation();
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessageMutation();
  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadLetterImageMutation();
  const isSending = isCreating || isReplying || isSendingMessage;

  const [message, setMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // 업로드가 끝난 사진의 key. 편지를 보내기 전까지는 편지에 연결되지 않은 상태
  const [imageObjectKey, setImageObjectKey] = useState<string | null>(null);
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 같은 답장을 재전송할 때는 같은 id 를 쓰고, 내용을 고치면 새로 만든다
  const clientMessageIdRef = useRef<string | null>(null);

  const isValidBody = message.trim().length >= MIN_LENGTH;

  // 사진을 지우거나 바꾸거나 작성을 취소하면, 편지에 연결되지 않은 업로드 사진을 지운다
  const discardUploadedImage = () => {
    if (imageObjectKey) deleteLetterImage(imageObjectKey);
    setImageObjectKey(null);
    clientMessageIdRef.current = null;
  };

  const handleClose = () => {
    discardUploadedImage();
    router.back();
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clientMessageIdRef.current = null;
    setMessage(e.target.value.slice(0, MAX_LENGTH));
  };

  const handleSelectTrack = (track: SpotifyTrack | null) => {
    clientMessageIdRef.current = null;
    setSelectedTrack(track);
  };

  const openAlertModal = (title: string, description: string, onConfirm?: () => void) => {
    open(({ close }) => (
      <Modal
        title={title}
        description={description}
        confirmText="확인"
        onConfirm={() => {
          close();
          onConfirm?.();
        }}
        onClose={close}
      />
    ));
  };

  const submit = () => {
    const body = message.trim();
    const spotifyTrackId = selectedTrack?.id;
    const attachment = { spotifyTrackId, imageObjectKey: imageObjectKey ?? undefined };

    if (!replyTo && !conversationId) {
      createLetter({ body, ...attachment }, { onSuccess: () => router.push('/home') });
      return;
    }

    clientMessageIdRef.current ??= crypto.randomUUID();
    const clientMessageId = clientMessageIdRef.current;

    // 답장은 성공·실패 모두 답장 화면을 열기 직전 페이지로 돌아간다
    const replyOptions = {
      onSuccess: () => router.back(),
      onError: (error: Error) => {
        if (!(error instanceof ApiError)) return;

        if (error.status === HTTP_STATUS_CODE.CONFLICT) {
          openAlertModal('답장을 보낼 수 없어요', error.message, () => router.back());
          return;
        }

        if (error.status === HTTP_STATUS_CODE.NOT_FOUND) {
          openAlertModal('답장할 수 없어요', error.message, () => router.back());
          return;
        }

        openAlertModal('답장을 보내지 못했어요', error.message);
      },
    };

    if (conversationId) {
      sendMessage({ conversationId, clientMessageId, body, ...attachment }, replyOptions);
    } else if (replyTo) {
      sendReply({ deliveryId: replyTo, clientMessageId, body, ...attachment }, replyOptions);
    }
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

    discardUploadedImage();
    setBackgroundImage(URL.createObjectURL(file));

    uploadImage(file, {
      onSuccess: ({ key }) => setImageObjectKey(key),
      onError: (error) => {
        setBackgroundImage(null);
        openAlertModal('사진을 올리지 못했어요', error.message);
      },
    });
  };

  const handleChangeImage = () => {
    setIsImageActionSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    discardUploadedImage();
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
          submit();
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
                  onClick={() => handleSelectTrack(null)}
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
        <Button type="button" disabled={!isValidBody || isSending || isUploadingImage} onClick={handleSubmitClick}>
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
            handleSelectTrack(track);
            setIsMusicPickerOpen(false);
          }}
        />
      )}
    </main>
  );
}
