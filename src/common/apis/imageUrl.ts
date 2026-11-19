import type { ProfileImage } from './profile';

const EXPIRY_MARGIN_MS = 60_000;

interface KeptImage {
  url: string;
  expiresAt: number;
  element?: HTMLImageElement;
}

const keptImages = new Map<string, KeptImage>();

const removeExpiredImages = () => {
  keptImages.forEach(({ expiresAt }, id) => {
    if (expiresAt <= Date.now()) keptImages.delete(id);
  });
};

// 같은 사진은 만료 전까지 첫 임시 주소 유지
export const keepImageUrl = <T extends ProfileImage>(id: string, image: T | null, preload = true): T | null => {
  if (!image) {
    keptImages.delete(id);
    return null;
  }

  const kept = keptImages.get(id);
  if (kept && kept.expiresAt > Date.now()) return { ...image, url: kept.url };

  removeExpiredImages();
  keptImages.set(id, {
    url: image.url,
    expiresAt: Date.now() + image.urlExpiresInSeconds * 1000 - EXPIRY_MARGIN_MS,
    // 재진입 시 즉시 표시용 메모리 보관
    element: preload ? Object.assign(new Image(), { src: image.url }) : undefined,
  });

  return image;
};

export const forgetImageUrl = (id: string) => keptImages.delete(id);
