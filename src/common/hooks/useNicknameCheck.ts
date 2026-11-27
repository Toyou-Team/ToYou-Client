'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { hasErrorStatus } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useProfileNicknameCheckMutation } from '@/common/apis/profile';
import { getNicknameServerError } from '@/utils/nickname';

const CHECK_DELAY = 400;

// 입력을 멈추면 서버에 닉네임 사용 가능 여부를 묻는다
export function useNicknameCheck(nickname: string, shouldCheck: boolean) {
  const { mutateAsync: checkNickname } = useProfileNicknameCheckMutation();
  // 닉네임별 결과 (null 이면 통과)
  const [results, setResults] = useState(new Map<string, string | null>());

  const saveResult = (target: string, error: string | null) => setResults((prev) => new Map(prev).set(target, error));

  // 400·422 만 오류로 기록. 그 밖의 실패는 저장할 때 다시 검사하므로 통과로 본다
  const check = async () => {
    const target = nickname;

    try {
      await checkNickname({ nickname: target });
      saveResult(target, null);
      return true;
    } catch (error) {
      if (hasErrorStatus(error, HTTP_STATUS_CODE.BAD_REQUEST, HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)) {
        saveResult(target, getNicknameServerError(error));
        return false;
      }
      return true;
    }
  };

  const checkAfterPause = useEffectEvent(() => check());
  const isChecked = results.has(nickname);

  useEffect(() => {
    if (!shouldCheck || isChecked) return;

    const timer = setTimeout(() => checkAfterPause(), CHECK_DELAY);
    return () => clearTimeout(timer);
  }, [nickname, shouldCheck, isChecked]);

  return { checkError: results.get(nickname), isChecked, check };
}
