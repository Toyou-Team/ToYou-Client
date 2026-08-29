'use client';

import Button from '@/components/common/Button/Button';
import TextField from '../textField/TextField';
import * as styles from './nicknameForm.css';
import React, { useState } from 'react';

function NicknameForm() {
  const [nickname, setNickname] = useState('');

  const isValidNickname = nickname.length >= 2 && nickname.length <= 12;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length > 12) return;
    setNickname(inputValue);
  };

  const isError = nickname !== '' && !isValidNickname;

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
        <Button disabled={!isValidNickname}>다음</Button>
      </div>
    </div>
  );
}

export default NicknameForm;
