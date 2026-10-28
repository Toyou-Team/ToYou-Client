const SAMPLE_SIZE = 20;

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
