'use client';

import React, { useEffect, useEffectEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useNicknameCheckMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { registrationTokenStore, signupDraftStore } from '@/common/apis/token';
import { useModal } from '@/common/hooks/useModal';
import { useSignupDraft } from '@/common/hooks/useSignupDraft';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { getNicknameError, getNicknameServerError, NICKNAME_LENGTH_ERROR } from '@/utils/nickname';
import TextField from '../textField/TextField';
import * as styles from './nicknameForm.css';

const CHECK_DELAY = 400;

function NicknameForm() {
  const router = useRouter();
  const { open } = useModal();
  const { mutateAsync: checkNickname } = useNicknameCheckMutation();

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

  const openAlert = (title: string, description: string, path?: string) =>
    open(({ close }) => {
      const handleClose = () => {
        close();
        if (path) router.replace(path);
      };

      return (
        <Modal
          title={title}
          description={description}
          confirmText="확인"
          onConfirm={handleClose}
          onClose={handleClose}
        />
      );
    });

  const saveCheckResult = (target: string, error: string | null) =>
    setCheckResults((results) => new Map(results).set(target, error));

  const runCheck = async () => {
    const registrationToken = registrationTokenStore.get();

    if (!registrationToken) {
      openAlert('가입하지 못했어요', '가입 시간이 지났어요.\n로그인부터 다시 진행해 주세요.', '/');
      return false;
    }

    try {
      await checkNickname({ registrationToken, nickname: trimmed });
      saveCheckResult(trimmed, null);
      return true;
    } catch (error) {
      if (!(error instanceof ApiError)) return false;

      if (error.code === AUTH_ERROR_CODE.REGISTRATION_TOKEN_INVALID) {
        openAlert('가입하지 못했어요', error.message, '/');
      } else if (
        error.status === HTTP_STATUS_CODE.BAD_REQUEST ||
        error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY
      ) {
        saveCheckResult(trimmed, getNicknameServerError(error));
      } else {
        openAlert('닉네임을 확인하지 못했어요', error.message);
      }

      return false;
    }
  };

  const checkAfterPause = useEffectEvent(() => runCheck());

  useEffect(() => {
    if (nicknameError || isChecked) return;

    const timer = setTimeout(() => checkAfterPause(), CHECK_DELAY);
    return () => clearTimeout(timer);
  }, [trimmed, nicknameError, isChecked]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length > 12) return;
    setNickname(inputValue);
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
          onChange={handleNicknameChange}
          value={nickname}
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
