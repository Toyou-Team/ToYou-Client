'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useLogoutMutation } from '@/common/apis/auth';
import { GENDER_LABEL, useProfileQuery } from '@/common/apis/profile';
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

  const { data: profile } = useProfileQuery();
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

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

  if (!profile) return null;

  return (
    <div className={styles.mypageWrapper}>
      <Link href="/mypage/edit" className={styles.profileCard}>
        <div className={styles.profileImageWrapper}>
          {profile.profileImage ? (
            <img src={profile.profileImage.url} alt={`${profile.nickname}의 프로필`} className={styles.profileImage} />
          ) : (
            <IcProfileImage className={styles.profileImage} />
          )}
        </div>

        <div className={styles.profileTextWrapper}>
          <span className={styles.nickname}>{profile.nickname}</span>
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
              <span className={styles.rowValue}>{GENDER_LABEL[profile.receiveGender]}</span>
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

        <button type="button" className={styles.withdrawButton} onClick={() => router.push('/mypage/withdraw')}>
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
