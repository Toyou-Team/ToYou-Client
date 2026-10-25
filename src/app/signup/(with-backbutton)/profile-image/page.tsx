'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE, PROFILE_ERROR_CODE } from '@/common/apis/constants/error-code';
import { useUploadProfileImageMutation } from '@/common/apis/profile';
import {
  clearSignupData,
  kakaoProfileStore,
  registrationTokenStore,
  setTokens,
  signupDraftStore,
} from '@/common/apis/token';
import { useModal } from '@/common/hooks/useModal';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';

import * as styles from './profile-image.css';

// 가입 실패 안내를 닫은 뒤 이동할 화면
const RETRY_PATH: Record<string, string> = {
  [AUTH_ERROR_CODE.REGISTRATION_TOKEN_INVALID]: '/',
  [AUTH_ERROR_CODE.ACCOUNT_EXISTS]: '/',
  [PROFILE_ERROR_CODE.NICKNAME_TAKEN]: '/signup/nickname',
};

export default function SignUpProfileImagePage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: signup, isPending: isSigningUp } = useSignupMutation();
  const { mutate: uploadProfileImage, isPending: isUploading } = useUploadProfileImageMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const goHome = () => router.replace('/home');

  // TODO: 업로드 실패 안내(토스트) 기획 확정 후 추가. 지금은 실패해도 사진 없이 홈으로 이동
  const uploadImage = (file: File) => uploadProfileImage(file, { onSettled: goHome });

  const alertAndGo = (message: string, path?: string) =>
    open(({ close }) => {
      const handleClose = () => {
        close();
        if (path) router.replace(path);
      };

      return (
        <Modal
          title="가입하지 못했어요"
          description={message}
          confirmText="확인"
          onConfirm={handleClose}
          onClose={handleClose}
        />
      );
    });

  const handleComplete = () => {
    const registrationToken = registrationTokenStore.get();
    const draft = signupDraftStore.get();

    // 가입용 토큰은 카카오 로그인 때만 받을 수 있어서 로그인부터 다시 한다
    if (!registrationToken) {
      alertAndGo('가입 시간이 지났어요.\n카카오 로그인부터 다시 진행해 주세요.', '/');
      return;
    }

    // 입력값만 비어 있으면 가입 화면 처음부터
    if (!draft.nickname || !draft.receiveGender) {
      router.replace('/signup/terms');
      return;
    }

    signup(
      {
        registrationToken,
        nickname: draft.nickname,
        // 성별 선택 화면이 없어져 카카오에서 받은 성별을 보낸다
        gender: kakaoProfileStore.get()?.gender,
        receiveGender: draft.receiveGender,
        // 직접 고른 사진은 가입 후 사진 업로드 API로 따로 저장
        useKakaoProfileImage: false,
      },
      {
        onSuccess: (result) => {
          setTokens(result);
          clearSignupData();

          if (imageFile) uploadImage(imageFile);
          else goHome();
        },
        onError: (error) => {
          const code = error instanceof ApiError ? error.code : undefined;

          if (code === AUTH_ERROR_CODE.ACCOUNT_UNAVAILABLE) {
            router.replace('/?blocked=restricted');
            return;
          }

          alertAndGo(error.message, code && RETRY_PATH[code]);
        },
      },
    );
  };

  return (
    <>
      <div className={styles.profileImagePageWrapper}>
        <MemoizedStepIcon step={3} />
        <h1 className={styles.titleWrapper}>프로필 사진을 설정해주세요.</h1>
      </div>

      <ImageUpload
        value={previewUrl}
        onChange={setPreviewUrl}
        onSelectFile={setImageFile}
        onRemove={() => setImageFile(null)}
      />

      <div className={styles.bottomButtonWrapper}>
        <p className={styles.guideText}>기본 이미지를 원할 경우 완료 버튼을 눌러주세요.</p>
        <Button type="button" disabled={isSigningUp || isUploading} onClick={handleComplete}>
          완료
        </Button>
      </div>
    </>
  );
}
