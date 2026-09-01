import Image, { StaticImageData } from 'next/image';

import ImgMockCard from '@/assets/imgs/img_mock_card.png';
import * as styles from './letterCard.css';

interface LetterCardProps {
  nickname: string;
  message: string;
  profileImage?: string | StaticImageData;
  profileImageSize?: number;
  expiresText?: string;
  width?: number;
  height?: number;
}

export function LetterCard({
  nickname,
  message,
  profileImage,
  profileImageSize = 4,
  expiresText = '3일 후 사라져요!',
  width = 300,
  height = 400,
}: LetterCardProps) {
  return (
    <div className={styles.letterCardWrapper} style={{ width: `${width}rem`, height: `${height}rem` }}>
      <Image src={ImgMockCard} alt="" fill className={styles.letterCardBackground} />

      <section className={styles.profileWrapper}>
        <div
          className={styles.profileImage}
          style={{
            width: `${profileImageSize}rem`,
            height: `${profileImageSize}rem`,
          }}
        >
          {profileImage && <Image src={profileImage} alt={`${nickname}의 프로필`} fill />}
        </div>

        <span className={styles.nickname}>{nickname}</span>

        <span className={styles.expiresText}>{expiresText}</span>
      </section>

      <div className={styles.messageWrapper}>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
