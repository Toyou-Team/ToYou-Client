'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signupDraftStore } from '@/common/apis/token';
import { useNicknameCheck } from '@/common/hooks/useNicknameCheck';
import { useSignupDraft } from '@/common/hooks/useSignupDraft';
import Button from '@/components/common/Button/Button';
import { getNicknameError, NICKNAME_LENGTH_ERROR, NICKNAME_MAX_LENGTH } from '@/utils/nickname';
import { sliceChars } from '@/utils/text';
import TextField from '../textField/TextField';
import * as styles from './nicknameForm.css';

function NicknameForm() {
  const router = useRouter();

  // 이전에 입력했던 값 복원
  const savedNickname = useSignupDraft('nickname');
  const savedError = useSignupDraft('nicknameError');
  const [nicknameInput, setNickname] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const nickname = nicknameInput ?? savedNickname ?? '';
  const trimmed = nickname.trim();

  const formatError = getNicknameError(nickname);
  // 온보딩 요청에서 받은 오류는 다시 입력하기 전까지 표시
  const savedServerError = (nicknameInput === null && savedError) || null;
  const { checkError, isChecked, check } = useNicknameCheck(trimmed, !formatError && !savedServerError);
  const nicknameError = formatError ?? checkError ?? savedServerError;
  const isAvailable = !nicknameError && isChecked;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(sliceChars(e.target.value, NICKNAME_MAX_LENGTH));
  };

  const handleNext = async () => {
    setIsMoving(true);

    // 확인 중 서버 오류가 나면 온보딩 요청에서 다시 검사
    if (isAvailable || (await check())) {
      signupDraftStore.patch({ nickname: trimmed, nicknameError: undefined });
      router.push('/signup/target-gender');
    } else {
      setIsMoving(false);
    }
  };

  const isError = nickname !== '' && Boolean(nicknameError);

  const helperText = isError ? nicknameError! : isAvailable ? '사용 가능한 닉네임입니다.' : NICKNAME_LENGTH_ERROR;

  const helperTextType = isError ? 'error' : isAvailable ? 'success' : 'default';

  return (
    <div className={styles.nicknameFormWrapper}>
      <div className={styles.nicknameFieldWrapper}>
        <TextField
          isError={isError}
          value={nickname}
          onChange={handleNicknameChange}
          helperText={helperText}
          helperTextType={helperTextType}
        />
      </div>
      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={Boolean(nicknameError) || isMoving} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default NicknameForm;
