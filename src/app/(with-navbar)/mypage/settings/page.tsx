'use client';

import { useState } from 'react';
import Link from 'next/link';

import { IcAlarmOff, IcChevronRight } from '@/assets/icons';
import { usePushSettings } from '@/common/hooks/usePushSettings';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { Header } from '@/components/common/Header/Header';
import { Toggle } from '@/components/common/Toggle/Toggle';
import { PolicySheet } from '@/components/signup/terms/PolicySheet/PolicySheet';
import { AGREE_DATA } from '@/constants';

import * as styles from './settings.css';

// TODO: 앱에서 실제 버전을 받을 수 있게 되면 교체
const APP_VERSION = '1.0.0';

export default function SettingsPage() {
  const push = usePushSettings();
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

  const selectedPolicy = AGREE_DATA.find((data) => data.id === selectedPolicyId);

  return (
    <div className={styles.pageWrapper}>
      <Header isSticky bordered left={<BackButton />} center={<span className={styles.headerTitle}>설정</span>} />

      <main className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>알림 설정</h2>

          <div className={styles.rowList}>
            {push.devicePermission !== null && push.devicePermission !== 'GRANTED' && (
              <button type="button" className={styles.deviceBanner} onClick={push.openDeviceNotificationModal}>
                <span className={styles.deviceBannerContent}>
                  <IcAlarmOff aria-hidden className={styles.deviceBannerIcon} />
                  <span className={styles.deviceBannerText}>
                    <strong className={styles.deviceBannerTitle}>기기 알림이 꺼져 있어요</strong>
                    현재 알림을 받을 수 없어요
                  </span>
                </span>
                <span className={styles.deviceBannerButton}>설정으로 이동</span>
              </button>
            )}

            <label className={styles.row}>
              <span>서비스 알림</span>
              {/* 서비스 알림은 항상 ON. 실제 수신은 기기 알림 권한에 따른다 */}
              <Toggle checked onChange={push.openDeviceNotificationModal} />
            </label>

            <div className={styles.toggleGroup}>
              <label className={styles.row}>
                <span>광고 · 이벤트 알림</span>
                {push.consents && (
                  <Toggle
                    checked={push.consents.marketingPush.agreed}
                    onChange={(event) => push.changeMarketing(event.target.checked)}
                  />
                )}
              </label>
              <p className={styles.description}>
                새소식, 이벤트 및 혜택에 대한 알림이나 메시지를 받을 수 있어요.
                <br />
                서비스의 중요 안내사항 및 정보는 수신 여부와 관계없이 발송돼요.
              </p>
            </div>

            <div className={styles.toggleGroup}>
              <label className={styles.row}>
                <span>야간 수신 동의</span>
                {push.consents && (
                  <Toggle
                    checked={push.consents.nightPush.agreed}
                    onChange={(event) => push.changeNight(event.target.checked)}
                  />
                )}
              </label>
              <p className={styles.description}>오후 9시부터 오전 8시 사이에 알림을 받을 수 있어요.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>앱 버전 정보</h2>
          <div className={styles.row}>
            <span>현재</span>
            <span className={styles.version}>{APP_VERSION}</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>이용약관 및 정책</h2>
          <div className={styles.rowList}>
            <button type="button" className={styles.row} onClick={() => setSelectedPolicyId(1)}>
              이용약관 및 정책
              <IcChevronRight />
            </button>
            <button type="button" className={styles.row} onClick={() => setSelectedPolicyId(2)}>
              개인정보 처리방침
              <IcChevronRight />
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>서비스 탈퇴</h2>
          <Link href="/mypage/withdraw" className={styles.withdrawLink}>
            탈퇴하기
          </Link>
        </section>
      </main>

      <PolicySheet
        isOpen={selectedPolicy !== undefined}
        onClose={() => setSelectedPolicyId(null)}
        title={selectedPolicy?.text ?? ''}
        content={selectedPolicy?.content ?? ''}
      />
    </div>
  );
}
