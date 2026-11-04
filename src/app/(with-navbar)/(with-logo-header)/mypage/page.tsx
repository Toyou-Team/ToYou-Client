'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAccountStatusQuery, useLogoutMutation } from '@/common/apis/auth';
import { GENDER_LABEL, useProfileQuery } from '@/common/apis/profile';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { IcChevronRight, IcProfileImage } from '@/assets/icons';

import * as styles from './mypage.css';

export default function MyPage() {
  const router = useRouter();
  const { open } = useModal();
  const { mutate: logout } = useLogoutMutation();

  const { data: profile } = useProfileQuery();
  // 정지 중에는 조회만 되고 수정은 403 이라 수정 진입을 막는다
  const { data: accountStatus } = useAccountStatusQuery();
  const canEdit = !accountStatus?.restricted;

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
          logout(undefined, {
            onSuccess: () => router.replace('/'),
            onError: (error) =>
              open(({ close: closeError }) => (
                <Modal
                  title="로그아웃하지 못했어요"
                  description={error.message}
                  confirmText="확인"
                  onConfirm={closeError}
                  onClose={closeError}
                />
              )),
          });
        }}
        onClose={close}
      />
    ));
  };

  if (!profile) return null;

  const profileSummary = (
    <>
      <div className={styles.profileImageWrapper}>
        {profile.profileImage ? (
          <img src={profile.profileImage.url} alt={`${profile.nickname}의 프로필`} className={styles.profileImage} />
        ) : (
          <IcProfileImage className={styles.profileImage} />
        )}
      </div>

      <div className={styles.profileTextWrapper}>
        <span className={styles.nickname}>{profile.nickname}</span>
        {canEdit && <span className={styles.profileEditText}>프로필 수정</span>}
      </div>
    </>
  );

  return (
    <div className={styles.mypageWrapper}>
      {canEdit ? (
        <Link href="/mypage/edit" className={styles.profileCard}>
          {profileSummary}
          <IcChevronRight />
        </Link>
      ) : (
        <div className={styles.profileCard}>{profileSummary}</div>
      )}

      <div className={styles.settingSection}>
        <div className={styles.settingGroup}>
          <h2 className={styles.sectionTitle}>편지 설정</h2>
          {canEdit ? (
            <Link href="/mypage/gender" className={styles.row}>
              <span className={styles.settingItem}>받는 사람 성별</span>
              <span className={styles.rowRight}>
                <span className={styles.rowValue}>{GENDER_LABEL[profile.receiveGender]}</span>
                <IcChevronRight />
              </span>
            </Link>
          ) : (
            <div className={styles.row}>
              <span className={styles.settingItem}>받는 사람 성별</span>
              <span className={styles.rowValue}>{GENDER_LABEL[profile.receiveGender]}</span>
            </div>
          )}
        </div>

        <div className={styles.settingGroup}>
          <h2 className={styles.sectionTitle}>설정</h2>
          <Link href="/mypage/settings" className={styles.row}>
            <span className={styles.settingItem}>설정</span>
            <IcChevronRight />
          </Link>
        </div>

        {accountStatus?.supportUrl && (
          <div className={styles.settingGroup}>
            <h2 className={styles.sectionTitle}>문의하기</h2>
            <a className={styles.row} href={accountStatus.supportUrl} target="_blank" rel="noopener noreferrer">
              <span className={styles.settingItem}>카카오톡 채널로 문의하기</span>
              <IcChevronRight />
            </a>
          </div>
        )}

        <div className={styles.accountGroup}>
          <h2 className={styles.sectionTitle}>계정</h2>
          <span className={styles.settingItem} onClick={handleLogout}>
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
}
