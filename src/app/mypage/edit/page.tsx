'use client';

import { useEffect, useEffectEvent, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import { ApiError } from '@/common/apis/client';
import { ACCOUNT_SUSPENDED } from '@/common/apis/constants/error-code';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useModal } from '@/common/hooks/useModal';
import { Header } from '@/components/common/Header/Header';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { Modal } from '@/components/common/Modal/Modal';
import { NavBar } from '@/components/common/NavBar/NavBar';
import TextField from '@/components/signup/nickname/textField/TextField';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';
import {
  GENDER_LABEL,
  useDeleteProfileImageMutation,
  useProfileNicknameCheckMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from '@/common/apis/profile';
import { getNicknameError, getNicknameServerError, NICKNAME_LENGTH_ERROR, NICKNAME_MAX_LENGTH } from '@/utils/nickname';

import * as styles from './edit.css';

const CHECK_DELAY = 400;

const isSuspended = (error: Error) => error instanceof ApiError && error.code === ACCOUNT_SUSPENDED;

export default function MyPageEditPage() {
  const router = useRouter();
  const { open } = useModal();

  const { data: profile } = useProfileQuery();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileMutation();
  const { mutate: uploadProfileImage } = useUploadProfileImageMutation();
  const { mutate: deleteProfileImage } = useDeleteProfileImageMutation();
  const { mutate: checkNickname } = useProfileNicknameCheckMutation();

  // 사용자가 바꾸기 전까지는 프로필 값을 그대로 보여준다
  const [nicknameInput, setNickname] = useState<string | null>(null);
  const [imageInput, setProfileImageUrl] = useState<string | null | undefined>(undefined);
  // 닉네임별 서버 확인 결과. 응답이 늦게 와도 자기 닉네임에만 기록된다 (null 이면 통과)
  const [checkResults, setCheckResults] = useState(new Map<string, string | null>());
  const [serverError, setServerError] = useState<string | null>(null);

  const nickname = nicknameInput ?? profile?.nickname ?? '';
  const profileImageUrl = imageInput === undefined ? (profile?.profileImage?.url ?? null) : imageInput;

  const trimmed = nickname.trim();
  // 기존 닉네임은 그대로 유지할 수 있어서 바꿀 때만 검사한다
  const isChanged = trimmed !== profile?.nickname;
  const localError = isChanged ? getNicknameError(nickname) : null;
  const nicknameError = serverError ?? localError ?? checkResults.get(trimmed) ?? null;
  const isValidNickname = !nicknameError;
  const isFull = nicknameInput !== null && nickname.length >= NICKNAME_MAX_LENGTH;
  const isError = (nickname !== '' && !isValidNickname) || isFull;

  const saveCheckResult = (target: string, error: string | null) =>
    setCheckResults((results) => new Map(results).set(target, error));

  // 형식 오류·금칙어만 표시하고, 그 밖의 실패는 저장할 때 다시 검사
  const checkAfterPause = useEffectEvent((target: string) =>
    checkNickname(
      { nickname: target },
      {
        onSuccess: () => saveCheckResult(target, null),
        onError: (error) => {
          if (
            error instanceof ApiError &&
            (error.status === HTTP_STATUS_CODE.BAD_REQUEST || error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
          ) {
            saveCheckResult(target, getNicknameServerError(error));
          }
        },
      },
    ),
  );

  const isChecked = checkResults.has(trimmed);

  useEffect(() => {
    if (!isChanged || localError || isChecked) return;

    const timer = setTimeout(() => checkAfterPause(trimmed), CHECK_DELAY);
    return () => clearTimeout(timer);
  }, [trimmed, isChanged, localError, isChecked]);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value.slice(0, NICKNAME_MAX_LENGTH));
    setServerError(null);
  };

  const handleSave = () => {
    if (!isValidNickname) return;

    if (!isChanged) {
      router.back();
      return;
    }

    updateProfile(
      { nickname: trimmed },
      {
        onSuccess: () => router.back(),
        onError: (error) => {
          if (!isSuspended(error)) setServerError(getNicknameServerError(error));
        },
      },
    );
  };

  // 실패하면 기존 사진으로 되돌리고 안내한다. 제재는 공통 안내 시트가 띄워진다
  const handleImageError = (error: Error) => {
    setProfileImageUrl(undefined);
    if (isSuspended(error)) return;

    open(({ close }) => (
      <Modal
        title="사진을 변경하지 못했어요"
        description={error.message}
        confirmText="확인"
        onConfirm={close}
        onClose={close}
      />
    ));
  };

  const handleSelectFile = (file: File) => {
    uploadProfileImage(file, {
      onSuccess: (updated) => setProfileImageUrl(updated.profileImage?.url ?? null),
      onError: handleImageError,
    });
  };

  const handleRemoveImage = () => {
    deleteProfileImage(undefined, {
      onSuccess: (updated) => setProfileImageUrl(updated.profileImage?.url ?? null),
      onError: handleImageError,
    });
  };

  if (!profile) return null;

  return (
    <div className={styles.pageWrapper}>
      <Header
        left={<BackButton />}
        center={<span className={styles.titleText}>프로필 수정</span>}
        right={
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!isValidNickname || isSaving}
          >
            저장
          </button>
        }
        bordered
      />

      <main className={styles.content}>
        <ImageUpload
          value={profileImageUrl}
          onChange={setProfileImageUrl}
          onSelectFile={handleSelectFile}
          onRemove={handleRemoveImage}
          size={14.8}
          topSpacing={3.6}
        />

        <div className={styles.nicknameFieldWrapper}>
          <span className={styles.fieldLabel}>닉네임</span>
          <TextField
            isError={isError}
            value={nickname}
            maxLength={NICKNAME_MAX_LENGTH}
            onChange={handleNicknameChange}
            helperText={nicknameError ?? NICKNAME_LENGTH_ERROR}
            helperTextType={isError ? 'error' : 'default'}
          />
        </div>

        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>기본 정보</h2>

          <div className={styles.infoRowWrapper}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>성별</span>
              <span className={styles.infoValue}>{profile.gender ? GENDER_LABEL[profile.gender] : '-'}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>생년</span>
              <span className={styles.infoValue}>{profile.birthDate?.slice(0, 4) ?? '-'}</span>
            </div>
          </div>
        </section>
      </main>

      <NavBar />
    </div>
  );
}
