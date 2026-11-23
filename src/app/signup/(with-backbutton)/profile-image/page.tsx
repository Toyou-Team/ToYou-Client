'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TrackEvent } from '@/components/analytics/TrackEvent/TrackEvent';
import { toAnalyticsGender, trackEvent } from '@/common/analytics/gtm';
import { useOnboardingMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { CONTENT_ERROR_CODE, PROFILE_ERROR_CODE } from '@/common/apis/constants/error-code';
import { getProfile, useUploadProfileImageMutation } from '@/common/apis/profile';
import { clearSignupData, loginProviderStore, signupDraftStore } from '@/common/apis/token';
import { useModal } from '@/common/hooks/useModal';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { showToast } from '@/components/common/Toast/Toast';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import { ImageUpload } from '@/components/signup/profile-image/ImageUpload/ImageUpload';
import { formatDotDate } from '@/utils/date';

import { getNicknameServerError } from '@/utils/nickname';

import * as styles from './profile-image.css';

export default function SignUpProfileImagePage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: completeOnboarding, isPending: isCompleting } = useOnboardingMutation();
  const { mutate: uploadProfileImage, isPending: isUploading } = useUploadProfileImageMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const goOnboarding = () => router.replace('/onboarding');

  const uploadImage = (file: File) =>
    uploadProfileImage(file, {
      onSuccess: goOnboarding,
      onError: () =>
        showToast('업로드가 되지 않았어요. 다시 시도해 주세요.', {
          type: 'error',
          above: 'guideButton',
          id: 'upload-error',
        }),
    });

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
    // 가입 후 사진 업로드만 실패한 경우 업로드만 재시도
    if (isRegistered) {
      if (imageFile) uploadImage(imageFile);
      else goOnboarding();
      return;
    }

    const draft = signupDraftStore.get();

    // 입력값이 없으면 닉네임부터
    if (!draft.nickname || !draft.receiveGender) {
      router.replace('/signup/nickname');
      return;
    }

    completeOnboarding(
      {
        nickname: draft.nickname,
        receiveGender: draft.receiveGender,
        // 직접 고른 사진은 온보딩 후 별도 업로드
        useKakaoProfileImage: false,
      },
      {
        onSuccess: () => {
          setIsRegistered(true);
          // 성별은 본인인증 정보라 프로필에서 읽는다
          const method = loginProviderStore.get() === 'APPLE' ? 'apple' : 'kakao';
          getProfile()
            .catch(() => null)
            .then((profile) => trackEvent({ event: 'sign_up', method, gender: toAnalyticsGender(profile?.gender) }));
          clearSignupData();
          // 광고성 정보 수신 동의 처리 결과 안내 (정보통신망법)
          if (draft.marketingPushAgreed) {
            const scope = draft.nightPushAgreed ? '광고성·야간 광고성 정보' : '광고성 정보';
            showToast(`to you ${scope} 수신에 동의했어요. (${formatDotDate(new Date())})`);
          }

          if (imageFile) uploadImage(imageFile);
          else goOnboarding();
        },
        onError: (error) => {
          const code = error instanceof ApiError ? error.code : undefined;

          // 금칙어/연락처는 닉네임 화면에서 안내
          if (code === CONTENT_ERROR_CODE.FORBIDDEN_WORD || code === CONTENT_ERROR_CODE.EXTERNAL_CONTACT) {
            signupDraftStore.patch({ nicknameError: getNicknameServerError(error) });
            router.replace('/signup/nickname');
            return;
          }

          alertAndGo(error.message, code === PROFILE_ERROR_CODE.NICKNAME_TAKEN ? '/signup/nickname' : undefined);
        },
      },
    );
  };

  return (
    <>
      <div className={styles.profileImagePageWrapper}>
        <TrackEvent event="onboarding_step_view" step_name="profile_image" step_index={5} />
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
        <Button type="button" disabled={isCompleting || isUploading} onClick={handleComplete}>
          완료
        </Button>
      </div>
    </>
  );
}
