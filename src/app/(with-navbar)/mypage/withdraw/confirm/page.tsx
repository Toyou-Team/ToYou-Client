'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { type AppleWithdrawalPayload, useDeleteAccountMutation, useWithdrawalSummaryQuery } from '@/common/apis/auth';
import { ApiError } from '@/common/apis/client';
import { AUTH_ERROR_CODE } from '@/common/apis/constants/error-code';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { APPLE_WEB_CLIENT_ID } from '@/common/apis/oAuth';
import { loginProviderStore, withdrawalReasonStore } from '@/common/apis/token';
import { type AppleAuthorization, useAppleAuthorization } from '@/common/hooks/useAppleAuthorization';
import { useModal } from '@/common/hooks/useModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import Button from '@/components/common/Button/Button';
import { CheckBox } from '@/components/common/CheckBox/CheckBox';
import { Header } from '@/components/common/Header/Header';
import { Modal } from '@/components/common/Modal/Modal';
import { formatKoreanDay } from '@/utils/date';

import * as styles from '../withdraw.css';

const getWithdrawErrorMessage = (error: Error) => {
  if (!(error instanceof ApiError)) return error.message;

  // 재발급 후 재시도할 때도 애플 계정은 새 code 가 필요하다
  if (error.status === HTTP_STATUS_CODE.UNAUTHORIZED) return '탈퇴하기를 다시 눌러 애플 인증을 진행해 주세요.';
  if (error.code === AUTH_ERROR_CODE.APPLE_AUTHORIZATION_INVALID) return '애플 인증을 다시 진행해 주세요.';
  if (error.code === AUTH_ERROR_CODE.APPLE_ACCOUNT_MISMATCH) return '가입한 애플 계정으로 다시 인증해 주세요.';
  if (error.code === AUTH_ERROR_CODE.APPLE_UNAVAILABLE)
    return '애플 서버가 원활하지 않아요. 잠시 후 다시 시도해 주세요.';

  return error.message;
};

export default function WithdrawConfirmPage() {
  const router = useRouter();
  const { open } = useModal();
  const { data: summary, isError: isSummaryError, refetch: refetchSummary } = useWithdrawalSummaryQuery();
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccountMutation();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAppleAccount] = useState(() => loginProviderStore.get() === 'APPLE');
  // 재시도할 때도 같은 사유를 다시 보낸다
  const [reasonPayload] = useState(() => withdrawalReasonStore.get());

  const openErrorModal = (description: string) =>
    open(({ close }) => (
      <Modal
        title="탈퇴를 완료하지 못했어요"
        description={description}
        confirmText="확인"
        onConfirm={close}
        onClose={close}
      />
    ));

  const withdraw = async (applePayload?: AppleWithdrawalPayload) => {
    try {
      await deleteAccount({ ...reasonPayload, ...applePayload });
      router.replace('/');
    } catch (error) {
      openErrorModal(getWithdrawErrorMessage(error as Error));
    }
  };

  const handleAppleResult = async (result: AppleAuthorization) => {
    // 재인증을 취소하면 탈퇴 화면에 그대로 머문다
    if (result.status === 'CANCELED') return;

    if (result.status === 'SUCCESS' && result.authorizationCode) {
      await withdraw({
        appleAuthorizationCode: result.authorizationCode,
        appleClientId: appleAuth.mode === 'web' ? APPLE_WEB_CLIENT_ID : undefined,
      });
      return;
    }

    openErrorModal('애플 인증을 완료하지 못했어요. 다시 시도해 주세요.');
  };

  const appleAuth = useAppleAuthorization({ enabled: isAppleAccount, onResult: handleAppleResult });

  const handleWithdraw = () => {
    if (isAppleAccount) appleAuth.authorize();
    else withdraw();
  };

  return (
    <div className={styles.pageWrapper}>
      <Header isSticky bordered left={<BackButton />} center={<span className={styles.headerTitle}>회원 탈퇴</span>} />

      <main className={styles.content}>
        <h1 className={styles.title}>
          탈퇴 전에
          <br />꼭 확인해 주세요
        </h1>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>사라지는 정보</h2>
          <dl className={styles.infoCard}>
            <div className={styles.infoRow}>
              <dt>내 편지함의 편지</dt>
              <dd className={styles.infoValue}>{summary ? `${summary.letterCount}개` : '-'}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>보유한 초코</dt>
              <dd className={styles.infoValue}>{summary ? `${summary.chocolateBalance}개` : '-'}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>프로필과 계정 정보</dt>
              <dd className={styles.infoValue}>전체</dd>
            </div>
          </dl>

          {isSummaryError && (
            <p className={styles.subText}>
              정보를 불러오지 못했어요.{' '}
              <button type="button" className={styles.retryButton} onClick={() => refetchSummary()}>
                다시 시도
              </button>
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>상대방에게 남는 정보</h2>
          <p className={styles.bodyText}>
            {"이미 보낸 편지와 대화는 지워지지 않고,\n보낸 사람이 '탈퇴한 사용자'로 바뀌어요."}
          </p>
        </section>

        {summary && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>다시 가입하려면</h2>
            {summary.rejoinRestriction.availableAt ? (
              <>
                <p className={styles.bodyText}>
                  <strong className={styles.infoValue}>{formatKoreanDay(summary.rejoinRestriction.availableAt)}</strong>
                  부터 다시 가입할 수 있어요.
                </p>
                <p className={styles.subText}>탈퇴 후 {summary.rejoinRestriction.days}일이 지나야 해요.</p>
              </>
            ) : (
              <p className={styles.bodyText}>바로 다시 가입할 수 있어요.</p>
            )}
          </section>
        )}

        <button
          type="button"
          role="checkbox"
          aria-checked={isConfirmed}
          className={clsx(styles.reasonButton, styles.confirmCheck)}
          onClick={() => setIsConfirmed((prev) => !prev)}
        >
          <CheckBox isChecked={isConfirmed} />위 내용을 모두 확인했어요.
        </button>
      </main>

      <div className={styles.bottomButtonWrapper}>
        <Button
          type="button"
          disabled={!isConfirmed || isPending || (isAppleAccount && appleAuth.isDisabled)}
          onClick={handleWithdraw}
        >
          탈퇴하기
        </Button>
      </div>
    </div>
  );
}
