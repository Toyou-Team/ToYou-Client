import Image, { StaticImageData } from 'next/image';

import ImgMockCard from '@/assets/imgs/img_mock_card.png';
import * as styles from './letterCard.css';
import { LetterSong } from '@/types/letterCardTypes';

interface LetterCardProps {
  nickname: string;
  message: string;
  profileImage?: string | StaticImageData;
  profileImageSize?: number;
  expiresText?: string;
  width?: number;
  height?: number;
  song?: LetterSong;
}

export function LetterCard({
  nickname,
  message,
  profileImage,
  profileImageSize = 4.3,
  expiresText = '3일 후 사라져요!',
  width,
  height = 40,
  song,
}: LetterCardProps) {
  return (
    <div
      className={styles.letterCardWrapper}
      style={{
        width: width ? `${width}rem` : '100%',
        height: `${height}rem`,
      }}
    >
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

      <section className={styles.messageWrapper}>
        <p className={styles.message}>{message}</p>

        {song && (
          <div className={styles.songWrapper}>
            <div className={styles.songImageWrapper}>
              <Image src={song.albumImage} alt="" fill className={styles.songImage} />
            </div>

            <div className={styles.songInfo}>
              <p className={styles.songTitle}>{song.title}</p>
              <p className={styles.songArtist}>{song.artist}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
