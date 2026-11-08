'use client';

import { useEffect, useState } from 'react';

import {
  isPushAppSupported,
  openNotificationSettings,
  parsePushPermissionResult,
  parsePushTokenResult,
  type PushPermission,
  requestPushPermission,
  requestPushToken,
} from '@/common/apis/push';
import {
  type PushConsents,
  type UpdatedPushConsents,
  usePushConsentsQuery,
  useUpdatePushConsentsMutation,
} from '@/common/apis/pushConsent';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';
import { showToast } from '@/components/common/Toast/Toast';
import { formatDotDate } from '@/utils/date';

// 동의·철회 처리 결과 안내 (정보통신망법). 바뀐 항목이 없으면 null
const consentChangeMessage = (before: PushConsents, after: UpdatedPushConsents) => {
  const date = formatDotDate(new Date(after.processedAt));
  const marketingChanged = before.marketingPush.agreed !== after.marketingPush.agreed;
  const nightChanged = before.nightPush.agreed !== after.nightPush.agreed;

  if (marketingChanged && after.marketingPush.agreed) {
    const scope = nightChanged ? '광고성·야간 광고성 정보' : '광고성 정보';
    return `to you ${scope} 수신에 동의했어요. (${date})`;
  }
  // 광고성을 끄면 서버가 야간도 함께 끈다
  if (marketingChanged) {
    const scope = nightChanged ? '광고성·야간 광고성 정보' : '광고성 정보';
    return `to you ${scope} 수신 동의를 철회했어요. (${date})`;
  }
  if (nightChanged) {
    return after.nightPush.agreed
      ? `to you 야간 광고성 정보 수신에 동의했어요. (${date})`
      : `to you 야간 광고성 정보 수신 동의를 철회했어요. (${date})`;
  }
  return null;
};

// 앱 웹뷰에서만 기기 알림 권한을 알 수 있다. 브라우저면 null
function useDevicePushPermission() {
  const [permission, setPermission] = useState<PushPermission | null>(null);

  useEffect(() => {
    if (!isPushAppSupported()) return;

    // 설정 앱에서 알림을 바꾸고 돌아오면 앱이 먼저 보내 주고, 권한 창에 답하면 토큰 결과로 알 수 있다
    const listener = (event: MessageEvent) => {
      const next = parsePushPermissionResult(event.data);
      if (next) {
        setPermission(next);
        return;
      }

      const tokenResult = parsePushTokenResult(event.data);
      if (tokenResult && tokenResult.status !== 'FAILED') setPermission(tokenResult.status);
    };
    window.addEventListener('message', listener);
    requestPushPermission();
    return () => window.removeEventListener('message', listener);
  }, []);

  return { permission };
}

// 설정 화면 알림: 광고성·야간 수신 동의 토글 + 기기 알림 상태
export function usePushSettings() {
  const { open } = useModal();
  const { data: consents } = usePushConsentsQuery();
  const { mutate } = useUpdatePushConsentsMutation({
    onUpdated: (before, after) => {
      const message = consentChangeMessage(before, after);
      if (message) showToast(message);
    },
    onFailed: () =>
      open(({ close }) => (
        <Modal
          title="알림 설정을 바꾸지 못했어요"
          description="잠시 후 다시 시도해 주세요."
          confirmText="확인"
          onConfirm={close}
          onClose={close}
        />
      )),
  });
  const device = useDevicePushPermission();

  const change = (payload: { marketingPushAgreed?: boolean; nightPushAgreed?: boolean }) => {
    if (consents) mutate(payload);
  };

  // 야간 동의 클릭 시 광고성 동의 함께 동의할지 확인 모달창
  const changeNight = (agreed: boolean) => {
    if (!agreed || consents?.marketingPush.agreed) {
      change({ nightPushAgreed: agreed });
      return;
    }

    open(({ close }) => (
      <Modal
        title="광고·이벤트 알림도 함께 받을까요?"
        description={'야간 알림을 받으려면\n광고·이벤트 알림 수신에도 동의해야 해요.'}
        cancelText="취소"
        confirmText="함께 동의하기"
        onConfirm={() => {
          close();
          change({ marketingPushAgreed: true, nightPushAgreed: true });
        }}
        onClose={close}
      />
    ));
  };

  // 기기 알림이 꺼져 있을 때만 안내
  const openDeviceNotificationModal = () => {
    if (device.permission === null || device.permission === 'GRANTED') return;

    open(({ close }) => (
      <Modal
        title="기기 알림이 꺼져 있어요"
        description={'편지가 도착했을 때 알림을 받으려면\n아이폰 설정에서 to you 알림을 켜주세요.'}
        cancelText="취소"
        confirmText="설정으로 이동"
        onConfirm={() => {
          close();
          if (device.permission === 'NOT_DETERMINED') requestPushToken();
          else openNotificationSettings();
        }}
        onClose={close}
      />
    ));
  };

  return {
    consents,
    changeMarketing: (agreed: boolean) => change({ marketingPushAgreed: agreed }),
    changeNight,
    devicePermission: device.permission,
    openDeviceNotificationModal,
  };
}
