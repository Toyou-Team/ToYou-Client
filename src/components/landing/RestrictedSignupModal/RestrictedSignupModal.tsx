'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

export function RestrictedSignupModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open } = useModal();
  // 개발 모드에서 effect 가 두 번 실행돼도 모달은 한 번만 띄운다
  const openedRef = useRef(false);

  const isRestricted = searchParams.get('blocked') === 'restricted';

  useEffect(() => {
    if (!isRestricted || openedRef.current) return;
    openedRef.current = true;

    open(({ close }) => {
      // 새로고침해도 다시 뜨지 않도록 주소의 표시를 지운다
      const handleClose = () => {
        close();
        router.replace('/');
      };

      return (
        <Modal
          title="가입이 제한됐어요"
          description={'이전에 운영정책 위반으로\n영구 이용 제한된 이력이 있어요.'}
          subDescription="자세한 내용은 카카오톡 채널로 문의해주세요."
          confirmText="닫기"
          onConfirm={handleClose}
          onClose={handleClose}
        />
      );
    });
  }, [isRestricted, open, router]);

  return null;
}
