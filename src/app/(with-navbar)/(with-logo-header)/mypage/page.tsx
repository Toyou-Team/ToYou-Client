'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useDeleteAccountMutation, useLogoutMutation } from '@/common/apis/auth';
import { GENDER_LABEL, mockUserStore, type MockUser } from '@/common/mock/user';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { PolicySheet } from '@/components/signup/terms/PolicySheet/PolicySheet';
import { AGREE_DATA } from '@/constants';
import { IcChevronRight, IcProfileImage } from '@/assets/icons';

import * as styles from './mypage.css';

export default function MyPage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: logout } = useLogoutMutation();
  const { mutate: deleteAccount } = useDeleteAccountMutation();

  const [user, setUser] = useState<MockUser | null>(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

  // TODO: 유저 정보 조회 API 연동 전까지 사용하는 임시 데이터
  useEffect(() => {
    setUser(mockUserStore.get());
  }, []);

  const selectedPolicy = AGREE_DATA.find((data) => data.id === selectedPolicyId);

  const handleLogout = () => {
    open(({ close }) => (
      <Modal
        title="로그아웃 하기"
        description={
          <>
            다시 로그인하면 편지와 초코는
            <br />
            그대로 남아 있어요.
          </>
        }
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={() => {
          close();
          logout(undefined, { onSuccess: () => router.replace('/') });
        }}
        onClose={close}
      />
    ));
  };

  const handleWithdraw = () => {
    open(({ close }) => (
      <Modal
        title="탈퇴하기"
        description={
          <>
            탈퇴하면 편지와 초코가 모두 사라지고
            <br />
            복구할 수 없어요.
          </>
        }
        confirmText="탈퇴"
        cancelText="취소"
        onConfirm={() => {
          close();
          deleteAccount(undefined, { onSuccess: () => router.replace('/') });
        }}
        onClose={close}
      />
    ));
  };

  if (!user) return null;

  return (
    <div className={styles.mypageWrapper}>
      <Link href="/mypage/edit" className={styles.profileCard}>
        <div className={styles.profileImageWrapper}>
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={`${user.nickname}의 프로필`} className={styles.profileImage} />
          ) : (
            <IcProfileImage className={styles.profileImage} />
          )}
        </div>

        <div className={styles.profileTextWrapper}>
          <span className={styles.nickname}>{user.nickname}</span>
          <span className={styles.profileEditText}>프로필 수정</span>
        </div>

        <IcChevronRight />
      </Link>

      <div className={styles.settingSection}>
        <div className={styles.settingGroup}>
          <h2 className={styles.sectionTitle}>편지 설정</h2>
          <Link href="/mypage/gender" className={styles.row}>
            <span className={styles.settingItem}>받는 사람 성별</span>
            <span className={styles.rowRight}>
              <span className={styles.rowValue}>{GENDER_LABEL[user.receiveGender]}</span>
              <IcChevronRight />
            </span>
          </Link>
        </div>

        <div className={styles.settingGroup}>
          <h2 className={styles.sectionTitle}>계정</h2>
          <span className={styles.settingItem} onClick={handleLogout}>
            로그아웃
          </span>
        </div>
      </div>
      <div className={styles.policyWrapper}>
        <div className={styles.policyRow}>
          <button type="button" className={styles.policyLink} onClick={() => setSelectedPolicyId(1)}>
            이용약관
          </button>

          <button type="button" className={styles.policyLink} onClick={() => setSelectedPolicyId(2)}>
            개인정보처리방침
          </button>
        </div>

        <button type="button" className={styles.withdrawButton} onClick={handleWithdraw}>
          탈퇴하기
        </button>
      </div>

      <PolicySheet
        isOpen={selectedPolicy !== undefined}
        onClose={() => setSelectedPolicyId(null)}
        title={selectedPolicy?.text ?? ''}
        content={selectedPolicy?.content ?? ''}
      />
    </div>
  );
}
