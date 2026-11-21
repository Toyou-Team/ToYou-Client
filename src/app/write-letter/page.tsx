'use client';

import { use, useEffect, useRef, useState } from 'react';

import { getScreenName, trackEvent } from '@/common/analytics/gtm';
import Button from '@/components/common/Button/Button';
import * as styles from './write-letter.css';
import { IcClose, IcImage, IcMusic, IcXNeutral600 } from '@/assets/icons';
import { ImageActionSheet } from '@/components/signup/profile-image/ImageActionSheet/ImageActionSheet';
import { MusicPicker } from '@/components/write-letter/MusicPicker/MusicPicker';
import type { SpotifyTrack } from '@/common/apis/music';
import {
  deleteLetterImage,
  useContentCheckMutation,
  useCreateLetterMutation,
  useUploadLetterImageMutation,
  useWritingPromptQuery,
} from '@/common/apis/letter';
import { useAccountStatusQuery } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { ACCOUNT_SUSPENDED_EVENT } from '@/components/restriction/AccountStatusGate/AccountStatusGate';
import { ACCOUNT_SUSPENDED, CONTENT_ERROR_CODE } from '@/common/apis/constants/error-code';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useSendMessageMutation } from '@/common/apis/conversation';
import { useReplyMutation } from '@/common/apis/delivery';
import { useModal } from '@/common/hooks/useModal';
import { usePhotoPicker } from '@/common/hooks/usePhotoPicker';
import { Modal } from '@/components/common/Modal/Modal';
import { showToast } from '@/components/common/Toast/Toast';
import { decodeImage, isDarkImageTop } from '@/utils/image';
import { countChars, sliceChars } from '@/utils/text';
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
  const { data: writingPrompt } = useWritingPromptQuery();
  const { mutate: createLetter, isPending: isCreating } = useCreateLetterMutation();
  const { mutate: sendReply, isPending: isReplying } = useReplyMutation();
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessageMutation();
  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadLetterImageMutation();
  const { mutate: checkContent, isPending: isCheckingContent } = useContentCheckMutation();
  const isSending = isCreating || isReplying || isSendingMessage || isCheckingContent;

  const [message, setMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // 업로드가 끝난 사진의 key. 편지를 보내기 전까지는 편지에 연결되지 않은 상태
  const [imageObjectKey, setImageObjectKey] = useState<string | null>(null);
  const [isDarkImage, setIsDarkImage] = useState<boolean>();
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);

  // 같은 답장을 재전송할 때는 같은 id 를 쓰고, 내용을 고치면 새로 만든다
  const clientMessageIdRef = useRef<string | null>(null);
  // 마지막으로 고른 사진의 미리보기 주소
  const latestPreviewRef = useRef<string | null>(null);

  const messageLength = countChars(message);
  const isValidBody = countChars(message.trim()) >= MIN_LENGTH;

  // 제재 중이면 편지작성 탭 클릭 시 안내 시트 노출
  const { data: accountStatus } = useAccountStatusQuery();
  const isRestricted = accountStatus?.restricted === true;

  useEffect(() => {
    if (!isRestricted) return;
    window.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
    router.back();
  }, [isRestricted, router]);

  // 교체된 미리보기 메모리 해제
  useEffect(
    () => () => {
      if (backgroundImage) URL.revokeObjectURL(backgroundImage);
    },
    [backgroundImage],
  );

  // 새 편지만 보낸다. 답장은 제외
  useEffect(() => {
    if (!replyTo && !conversationId) trackEvent({ event: 'letter_write_start', screen_name: getScreenName() });
  }, [replyTo, conversationId]);

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

  // 한글 조합 중에 글자를 자르면 앞 글자가 지워져서, 조합이 끝난 뒤에 자른다
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clientMessageIdRef.current = null;
    const { value } = e.target;
    setMessage((e.nativeEvent as InputEvent).isComposing ? value : sliceChars(value, MAX_LENGTH));
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

  const openForbiddenWordModal = (error: Error) => {
    if (!(error instanceof ApiError) || error.code !== CONTENT_ERROR_CODE.FORBIDDEN_WORD) return false;

    const words = error.details?.forbiddenWords;
    openAlertModal(
      '전송 불가',
      words?.length
        ? `${words.join(', ')}은(는) 보낼 수 없는 표현이에요.\n다른 표현으로 작성해 주세요.`
        : error.message,
    );
    return true;
  };

  const submit = () => {
    const body = message.trim();
    const spotifyTrackId = selectedTrack?.id;
    const attachment = {
      spotifyTrackId,
      imageObjectKey: imageObjectKey ?? undefined,
      isDarkImage: imageObjectKey ? isDarkImage : undefined,
    };

    if (!replyTo && !conversationId) {
      createLetter(
        { body, ...attachment },
        {
          onSuccess: ({ bonusChocolateAmount }) => {
            trackEvent({ event: 'letter_send', char_count: countChars(body) });
            if (bonusChocolateAmount > 0) showToast(`${bonusChocolateAmount}초코가 지급됐어요.`, { isExpanding: true });
            router.push('/home');
          },
          onError: (error) => {
            if (openForbiddenWordModal(error)) return;
            if (error instanceof ApiError && error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY) {
              openAlertModal('편지를 보내지 못했어요', error.message);
            }
          },
        },
      );
      return;
    }

    clientMessageIdRef.current ??= crypto.randomUUID();
    const clientMessageId = clientMessageIdRef.current;

    // 답장은 성공·실패 모두 답장 화면을 열기 직전 페이지로 돌아간다
    const replyOptions = {
      onSuccess: () => {
        trackEvent({ event: 'reply_send', char_count: countChars(body) });
        // 첫 답장이면 대화방이 생긴다
        if (replyTo) trackEvent({ event: 'chat_room_open' });
        router.back();
      },
      onError: (error: Error) => {
        if (!(error instanceof ApiError) || openForbiddenWordModal(error)) return;

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

  const clearPreview = () => {
    latestPreviewRef.current = null;
    setBackgroundImage(null);
  };

  const handleImageSelect = (file: File) => {
    discardUploadedImage();

    const previewUrl = URL.createObjectURL(file);
    latestPreviewRef.current = previewUrl;
    decodeImage(previewUrl).then(() => {
      if (latestPreviewRef.current === previewUrl) setBackgroundImage(previewUrl);
      else URL.revokeObjectURL(previewUrl);
    });
    isDarkImageTop(file).then(setIsDarkImage);

    uploadImage(file, {
      onSuccess: ({ key }) => setImageObjectKey(key),
      onError: (error) => {
        clearPreview();
        openAlertModal('사진을 올리지 못했어요', error.message);
      },
    });
  };

  const { fileInputRef, openPicker, handleFileChange } = usePhotoPicker(handleImageSelect);

  const handlePhotoButtonClick = () => {
    if (backgroundImage) {
      setIsImageActionSheetOpen(true);
      return;
    }

    openPicker();
  };

  const handleChangeImage = () => {
    setIsImageActionSheetOpen(false);
    openPicker();
  };

  const handleDeleteImage = () => {
    discardUploadedImage();
    clearPreview();
    setIsImageActionSheetOpen(false);
  };

  const openSendConfirm = () => {
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

  // 편지 보내기 전 사전 검사 추가
  const handleSubmitClick = () => {
    checkContent(message.trim(), {
      onSuccess: openSendConfirm,
      onError: (error) => {
        if (openForbiddenWordModal(error)) return;

        const code = error instanceof ApiError ? error.code : undefined;
        // 정지 안내는 전역에서 표시
        if (code === ACCOUNT_SUSPENDED) return;
        if (code === CONTENT_ERROR_CODE.EXTERNAL_CONTACT) {
          openAlertModal(
            replyTo || conversationId ? '답장을 보내지 못했어요' : '편지를 보내지 못했어요',
            error.message,
          );
          return;
        }
        openSendConfirm();
      },
    });
  };

  if (isRestricted) return null;

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
          <div className={styles.messageField} data-value={message || writingPrompt || ''}>
            <textarea
              value={message}
              onChange={handleMessageChange}
              onCompositionEnd={(e) => setMessage(sliceChars(e.currentTarget.value, MAX_LENGTH))}
              placeholder={writingPrompt ?? undefined}
              className={styles.message}
            />
          </div>

          <span className={styles.characterCount}>
            {messageLength === 0
              ? `${MIN_LENGTH}자 이상 써야 보낼 수 있어요`
              : `${messageLength} / ${messageLength > MIN_LENGTH ? MAX_LENGTH : MIN_LENGTH}`}
          </span>
        </div>

        {selectedTrack && (
          <div className={styles.selectedTrackChip}>
            {selectedTrack.albumImageUrl ? (
              <img src={selectedTrack.albumImageUrl} alt="" className={styles.selectedTrackImage} />
            ) : (
              <span className={styles.selectedTrackImage} />
            )}

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
        onChange={handleFileChange}
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
