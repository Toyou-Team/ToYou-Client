'use client';

import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header/Header';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { NavBar } from '@/components/common/NavBar/NavBar';
import TextField from '@/components/signup/nickname/textField/TextField';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';
import {
  GENDER_LABEL,
  useDeleteProfileImageMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from '@/common/apis/profile';

import * as styles from './edit.css';

export default function MyPageEditPage() {
  const router = useRouter();

  const { data: profile } = useProfileQuery();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileMutation();
  const { mutate: uploadProfileImage } = useUploadProfileImageMutation();
  const { mutate: deleteProfileImage } = useDeleteProfileImageMutation();

  // 사용자가 바꾸기 전까지는 프로필 값을 그대로 보여준다
  const [nicknameInput, setNickname] = useState<string | null>(null);
  const [imageInput, setProfileImageUrl] = useState<string | null | undefined>(undefined);

  const nickname = nicknameInput ?? profile?.nickname ?? '';
  const profileImageUrl = imageInput === undefined ? (profile?.profileImage?.url ?? null) : imageInput;

  const trimmed = nickname.trim();
  const isValidNickname = trimmed.length >= 2 && trimmed.length <= 12;
  const isError = nickname !== '' && !isValidNickname;

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 12) return;
    setNickname(e.target.value);
  };

  const handleSave = () => {
    if (!isValidNickname) return;

    if (trimmed === profile?.nickname) {
      router.back();
      return;
    }

    updateProfile({ nickname: trimmed }, { onSuccess: () => router.back() });
  };

  const handleSelectFile = (file: File) => {
    uploadProfileImage(file, {
      onSuccess: (updated) => setProfileImageUrl(updated.profileImage?.url ?? null),
    });
  };

  const handleRemoveImage = () => {
    deleteProfileImage(undefined, {
      onSuccess: (updated) => setProfileImageUrl(updated.profileImage?.url ?? null),
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
            onChange={handleNicknameChange}
            helperText="닉네임은 최소 2자에서 12자까지 작성 가능합니다."
            helperTextType={isError ? 'error' : 'default'}
          />
        </div>

        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>기본 정보</h2>

          <div className={styles.infoRowWrapper}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>성별</span>
              <span className={styles.infoValue}>{GENDER_LABEL[profile.gender]}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>생년</span>
              <span className={styles.infoValue}>{profile.birthDate.slice(0, 4)}</span>
            </div>
          </div>
        </section>
      </main>

      <NavBar />
    </div>
  );
}
