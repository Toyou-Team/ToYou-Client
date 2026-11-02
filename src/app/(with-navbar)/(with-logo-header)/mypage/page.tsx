'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useLogoutMutation } from '@/common/apis/auth';
import { GENDER_LABEL, useProfileQuery } from '@/common/apis/profile';
import { useModal } from '@/common/hooks/useModal';
import { usePushSettings } from '@/common/hooks/usePushSettings';
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
  const push = usePushSettings();
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

        {/* TODO: 디자인 적용. 시안은 별도 '설정' 화면의 '이벤트 및 혜택 알림' 묶음 */}
        <div className={styles.settingGroup}>
          <h2 className={styles.sectionTitle}>알림</h2>
          <p className={styles.settingDescription}>
            새소식, 이벤트 및 혜택에 대한 알림을 받을 수 있어요. 서비스의 중요 안내사항 및 정보는 수신 여부와 관계없이
            발송돼요.
          </p>

          {push.devicePermission !== null && push.devicePermission !== 'GRANTED' && (
            <button type="button" className={styles.row} onClick={push.turnOnDeviceNotifications}>
              <span className={styles.settingDescription}>기기 알림이 꺼져 있어요</span>
              <span className={styles.rowValue}>
                {push.devicePermission === 'NOT_DETERMINED' ? '알림 켜기' : '설정에서 켜기'}
              </span>
            </button>
          )}

          <label className={styles.row}>
            <span>푸시 알림</span>
            <input
              type="checkbox"
              role="switch"
              className={styles.switchInput}
              checked={push.consents?.marketingPush.agreed ?? false}
              disabled={!push.consents || push.isPending}
              onChange={(event) => push.changeMarketing(event.target.checked)}
            />
          </label>

          <label className={styles.row}>
            <span>야간 수신 동의</span>
            <input
              type="checkbox"
              role="switch"
              className={styles.switchInput}
              checked={push.consents?.nightPush.agreed ?? false}
              disabled={!push.canChangeNight || push.isPending}
              onChange={(event) => push.changeNight(event.target.checked)}
            />
          </label>
          <p className={styles.settingDescription}>오후 9시부터 오전 8시 사이에 알림을 받을 수 있어요.</p>
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
