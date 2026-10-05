'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { useDeleteAccountMutation } from '@/common/apis/auth';
import { useProfileQuery } from '@/common/apis/profile';
import { useModal } from '@/common/hooks/useModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import Button from '@/components/common/Button/Button';
import { CheckBox } from '@/components/common/CheckBox/CheckBox';
import { Header } from '@/components/common/Header/Header';
import { Modal } from '@/components/common/Modal/Modal';

import * as styles from '../withdraw.css';

const REJOIN_WAITING_DAYS = 7;

const getRejoinDateText = () => {
  const date = new Date();
  date.setDate(date.getDate() + REJOIN_WAITING_DAYS);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function WithdrawConfirmPage() {
  const router = useRouter();
  const { open } = useModal();
  const { data: profile } = useProfileQuery();
  const { mutate: deleteAccount, isPending } = useDeleteAccountMutation();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleWithdraw = () => {
    deleteAccount(undefined, {
      onSuccess: () => router.replace('/'),
      onError: (error) =>
        open(({ close }) => (
          <Modal
            title="탈퇴하지 못했어요"
            description={error.message}
            confirmText="확인"
            onConfirm={close}
            onClose={close}
          />
        )),
    });
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
              {/* TODO: 편지 수를 주는 API 가 생기면 연결 */}
              <dd className={styles.infoValue}>-</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>보유한 초코</dt>
              <dd className={styles.infoValue}>{profile?.chocolateBalance ?? 0}개</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>프로필과 계정 정보</dt>
              <dd className={styles.infoValue}>전체</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>상대방에게 남는 정보</h2>
          <p className={styles.bodyText}>
            {"이미 보낸 편지와 대화는 지워지지 않고,\n보낸 사람이 '탈퇴한 사용자'로 바뀌어요."}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>다시 가입하려면</h2>
          <p className={styles.bodyText}>
            <strong className={styles.infoValue}>{getRejoinDateText()}</strong>부터 다시 가입할 수 있어요.
          </p>
          <p className={styles.subText}>탈퇴 후 {REJOIN_WAITING_DAYS}일이 지나야 해요.</p>
        </section>

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
        <Button type="button" disabled={!isConfirmed || isPending} onClick={handleWithdraw}>
          탈퇴하기
        </Button>
      </div>
    </div>
  );
}
