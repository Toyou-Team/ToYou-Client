// 앱 ↔ 웹 메시지 계약: ToYou-Server PR #44

export type PhotoPickResult =
  | { type: 'PHOTO_PICK_RESULT'; status: 'SUCCESS'; dataUrl: string; mimeType: string; width: number; height: number }
  | { type: 'PHOTO_PICK_RESULT'; status: 'CANCELED' | 'FAILED' }
  | { type: 'PHOTO_PICK_RESULT'; status: 'PERMISSION_DENIED'; source: 'LIBRARY' | 'CAMERA' };

// 사진 선택을 지원하는 iOS 앱 웹뷰에서만 true
export const isPhotoPickerSupported = () =>
  Boolean(window.ReactNativeWebView) && window.TOYOU_APP?.photoPicker === true;

export const requestPhotoPick = () =>
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'PHOTO_PICK_REQUEST' }));

// 앱이 보낸 JSON 문자열 중 사진 선택 결과만 추출
export const parsePhotoPickResult = (data: unknown): PhotoPickResult | null => {
  if (typeof data !== 'string') return null;

  try {
    const message = JSON.parse(data) as Partial<PhotoPickResult>;
    return message.type === 'PHOTO_PICK_RESULT' ? (message as PhotoPickResult) : null;
  } catch {
    return null;
  }
};

export const dataUrlToFile = (dataUrl: string, mimeType: string) => {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

  return new File([bytes], 'photo.jpg', { type: mimeType });
};
