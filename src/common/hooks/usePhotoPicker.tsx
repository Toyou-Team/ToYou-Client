'use client';

import { useEffect, useEffectEvent, useRef, type ChangeEvent } from 'react';

import {
  dataUrlToFile,
  isPhotoPickerSupported,
  parsePhotoPickResult,
  requestPhotoPick,
} from '@/common/apis/photoPicker';
import { useModal } from '@/common/hooks/useModal';
import { Modal } from '@/components/common/Modal/Modal';

// iOS 앱은 앱 사진 선택, 그 외는 파일 선택 사용
export function usePhotoPicker(onSelect: (file: File) => void) {
  const { open } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const waitingAppRef = useRef(false);

  const openFailModal = () =>
    open(({ close }) => (
      <Modal
        title="사진을 불러오지 못했어요"
        description="다시 시도해 주세요."
        confirmText="확인"
        onConfirm={close}
        onClose={close}
      />
    ));

  const handleAppResult = useEffectEvent((data: unknown) => {
    const result = parsePhotoPickResult(data);
    if (!result || !waitingAppRef.current) return;
    waitingAppRef.current = false;

    if (result.status === 'FAILED') {
      openFailModal();
      return;
    }
    if (result.status !== 'SUCCESS') return;

    try {
      onSelect(dataUrlToFile(result.dataUrl, result.mimeType));
    } catch {
      openFailModal();
    }
  });

  useEffect(() => {
    const listener = (event: MessageEvent) => handleAppResult(event.data);
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  const openPicker = () => {
    if (isPhotoPickerSupported()) {
      waitingAppRef.current = true;
      requestPhotoPick();
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일 재선택용 초기화
    e.target.value = '';

    if (file) onSelect(file);
  };

  return { fileInputRef, openPicker, handleFileChange };
}
