'use client';

import { useRouter } from 'next/navigation';

import { ApiError } from '@/common/apis/client';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { formatKoreanDay } from '@/utils/date';

// 403 AUTH_ACCOUNT_UNAVAILABLE. 재가입 가능일이 없으면 랜딩의 가입 제한 모달로
export function useAccountUnavailable() {
  const router = useRouter();
  const { open } = useModal();

  return (error: Error) => {
    const details = error instanceof ApiError ? error.details : undefined;
    const rejoinAvailableAt = details?.rejoinAvailableAt;

    if (!rejoinAvailableAt) {
      router.replace('/?blocked=restricted');
      return;
    }

    open(({ close }) => {
      const handleClose = () => {
        close();
        router.replace('/');
      };

      return (
        <Modal
          title="가입이 제한됐어요"
          description={`${formatKoreanDay(rejoinAvailableAt)}부터 다시 가입할 수 있어요.`}
          subDescription={details.sanctionReasonTitle ? `제한 사유: ${details.sanctionReasonTitle}` : undefined}
          confirmText="닫기"
          onConfirm={handleClose}
          onClose={handleClose}
        />
      );
    });
  };
}
