'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header/Header';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { NavBar } from '@/components/common/NavBar/NavBar';
import TextField from '@/components/signup/nickname/textField/TextField';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';
import { GENDER_LABEL, mockUserStore, type Gender } from '@/common/mock/user';

import * as styles from './edit.css';

export default function MyPageEditPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>('FEMALE');
  const [birthYear, setBirthYear] = useState(0);

  // TODO: 유저 정보 조회 API 연동 전까지 사용하는 임시 데이터
  useEffect(() => {
    const user = mockUserStore.get();
    setNickname(user.nickname);
    setProfileImageUrl(user.profileImageUrl ?? null);
    setGender(user.gender);
    setBirthYear(user.birthYear);
  }, []);

  const trimmed = nickname.trim();
  const isValidNickname = trimmed.length >= 2 && trimmed.length <= 12;
  const isError = nickname !== '' && !isValidNickname;

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 12) return;
    setNickname(e.target.value);
  };

  const handleSave = () => {
    if (!isValidNickname) return;

    // TODO: 프로필 수정 API 연동
    mockUserStore.patch({ nickname: trimmed, profileImageUrl: profileImageUrl ?? undefined });
    router.back();
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        left={<BackButton />}
        center={<span className={styles.titleText}>프로필 수정</span>}
        right={
          <button type="button" className={styles.saveButton} onClick={handleSave} disabled={!isValidNickname}>
            저장
          </button>
        }
        bordered
      />

      <main className={styles.content}>
        <ImageUpload value={profileImageUrl} onChange={setProfileImageUrl} size={14.8} topSpacing={3.6} />

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
              <span className={styles.infoValue}>{GENDER_LABEL[gender]}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>생년</span>
              <span className={styles.infoValue}>{birthYear}</span>
            </div>
          </div>
        </section>
      </main>

      <NavBar />
    </div>
  );
}
