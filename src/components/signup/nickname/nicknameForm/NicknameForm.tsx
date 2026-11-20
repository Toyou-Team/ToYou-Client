'use client';

import React, { useEffect, useEffectEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useProfileNicknameCheckMutation } from '@/common/apis/profile';
import { signupDraftStore } from '@/common/apis/token';
import { useSignupDraft } from '@/common/hooks/useSignupDraft';
import Button from '@/components/common/Button/Button';
import { getNicknameError, getNicknameServerError, NICKNAME_LENGTH_ERROR, NICKNAME_MAX_LENGTH } from '@/utils/nickname';
import { sliceChars } from '@/utils/text';
import TextField from '../textField/TextField';
import * as styles from './nicknameForm.css';

const CHECK_DELAY = 400;

function NicknameForm() {
  const router = useRouter();
  const { mutateAsync: checkNickname } = useProfileNicknameCheckMutation();

  // 이전에 입력했던 값 복원
  const savedNickname = useSignupDraft('nickname');
  const savedError = useSignupDraft('nicknameError');
  const [nicknameInput, setNickname] = useState<string | null>(null);
  // 닉네임별 확인 결과. 응답이 늦게 와도 자기 닉네임에만 기록된다 (null 이면 통과)
  const [checkResults, setCheckResults] = useState(new Map<string, string | null>());
  const [isMoving, setIsMoving] = useState(false);

  const nickname = nicknameInput ?? savedNickname ?? '';
  const trimmed = nickname.trim();

  const isChecked = checkResults.has(trimmed);
  const nicknameError =
    getNicknameError(nickname) ??
    checkResults.get(trimmed) ??
    (nicknameInput === null && savedError ? savedError : null);
  const isAvailable = !nicknameError && isChecked;

  const saveCheckResult = (target: string, error: string | null) =>
    setCheckResults((results) => new Map(results).set(target, error));

  const runCheck = async () => {
    try {
      await checkNickname({ nickname: trimmed });
      saveCheckResult(trimmed, null);
      return true;
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === HTTP_STATUS_CODE.BAD_REQUEST || error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
      ) {
        saveCheckResult(trimmed, getNicknameServerError(error));
        return false;
      }

      // 그 외 오류는 온보딩 요청에서 재검사
      return true;
    }
  };

  const checkAfterPause = useEffectEvent(() => runCheck());

  useEffect(() => {
    if (nicknameError || isChecked) return;

    const timer = setTimeout(() => checkAfterPause(), CHECK_DELAY);
    return () => clearTimeout(timer);
  }, [trimmed, nicknameError, isChecked]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(sliceChars(e.target.value, NICKNAME_MAX_LENGTH));
  };

  const handleNext = async () => {
    setIsMoving(true);

    if (isAvailable || (await runCheck())) {
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
