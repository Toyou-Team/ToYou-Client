const SAMPLE_SIZE = 20;
const UPLOAD_MAX_SIDE = 1440;
const UPLOAD_QUALITY = 0.85;
const DECODE_TIMEOUT_MS = 500;

// 화면 교체 전 디코딩, 실패/지연 시 그대로 진행
export const decodeImage = (url: string) =>
  Promise.race([
    Object.assign(new Image(), { src: url })
      .decode()
      .catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, DECODE_TIMEOUT_MS)),
  ]);

// 업로드용 JPEG 변환, 실패 시 원본 사용
export async function resizeImageForUpload(file: File) {
  let bitmap: ImageBitmap | undefined;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

    const scale = Math.min(1, UPLOAD_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = Object.assign(document.createElement('canvas'), {
      width: Math.round(bitmap.width * scale),
      height: Math.round(bitmap.height * scale),
    });
    const context = canvas.getContext('2d');
    if (!context) return file;

    // 투명 영역 검게 변환 방지
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', UPLOAD_QUALITY));
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;

    return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}

// 사진 윗부분(헤더/닉네임)이 어두운지 확인
export async function isDarkImageTop(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const context = Object.assign(document.createElement('canvas'), {
      width: SAMPLE_SIZE,
      height: SAMPLE_SIZE,
    }).getContext('2d');
    if (!context) return undefined;

    context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height * 0.2, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    bitmap.close();

    const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    let total = 0;
    for (let i = 0; i < data.length; i += 4) total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

    return total / (data.length / 4) < 128;
  } catch {
    return undefined;
  }
}
