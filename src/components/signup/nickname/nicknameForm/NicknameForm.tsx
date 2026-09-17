'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signupDraftStore } from '@/common/apis/token';
import Button from '@/components/common/Button/Button';
import TextField from '../textField/TextField';
import * as styles from './nicknameForm.css';

function NicknameForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  // 이전에 입력했던 값 복원
  useEffect(() => {
    const draft = signupDraftStore.get();

    setNickname(draft.nickname ?? '');
  }, []);

  const trimmed = nickname.trim();
  const isValidNickname = trimmed.length >= 2 && trimmed.length <= 12;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length > 12) return;
    setNickname(inputValue);
  };

  const isError = nickname !== '' && !isValidNickname;

  const handleNext = () => {
    signupDraftStore.patch({ nickname: trimmed });
    router.push('/signup/my-gender');
  };

  const helperText =
    nickname === ''
      ? '닉네임은 최소 2자에서 12자까지 작성 가능합니다.'
      : isError
        ? '닉네임은 최소 2자에서 12자까지 작성 가능합니다.'
        : '사용 가능한 닉네임입니다.';

  const helperTextType = nickname === '' ? 'default' : isError ? 'error' : 'success';

  return (
    <div className={styles.nicknameFormWrapper}>
      <div className={styles.nicknameFieldWrapper}>
        <TextField
          isError={isError}
          onChange={handleNicknameChange}
          value={nickname}
          helperText={helperText}
          helperTextType={helperTextType}
        />
      </div>
      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={!isValidNickname} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default NicknameForm;
