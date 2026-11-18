'use client';

import { useRouter } from 'next/navigation';

import { useIdentityVerificationMutation } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { registrationTokenStore } from '@/common/apis/token';
import { useModal } from '@/common/hooks/useModal';
import Button from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { openKgInicis } from '@/utils/kgInicis';

import * as styles from './verify.css';

export default function SignupVerifyPage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: startVerification, isPending } = useIdentityVerificationMutation();

  const handleNext = () => {
    const registrationToken = registrationTokenStore.get();
    if (!registrationToken) {
      router.replace('/');
      return;
    }

    startVerification(registrationToken, {
      onSuccess: ({ launchUrl, launch }) => openKgInicis(launchUrl, launch),
      onError: (error) => {
        const code = error instanceof ApiError ? error.code : undefined;

        if (code === AUTH_ERROR_CODE.REGISTRATION_TOKEN_INVALID) {
          router.replace('/');
          return;
        }
        if (code === AUTH_ERROR_CODE.CONSENT_REQUIRED) {
          router.replace('/signup/terms');
          return;
        }

        open(({ close }) => (
          <Modal
            title="본인인증을 시작하지 못했어요"
            description={error.message}
            confirmText="확인"
            onConfirm={close}
            onClose={close}
          />
        ));
      },
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>
        <span className={styles.firstLine}>안전한 이용을 위해</span>
        <span className={styles.secondLine}>본인인증이 필요해요.</span>
      </h1>

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={isPending} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
