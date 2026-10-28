import Image, { StaticImageData } from 'next/image';
import clsx from 'clsx';

import * as styles from './letterCard.css';
import { LetterSong } from '@/types/letterCardTypes';

interface LetterCardProps {
  nickname: string;
  message: string;
  profileImage?: string | StaticImageData;
  backgroundImage?: string | StaticImageData;
  isDarkBackground?: boolean;
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
  backgroundImage,
  isDarkBackground = false,
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
      {backgroundImage && (
        <Image src={backgroundImage} alt="" fill unoptimized className={styles.letterCardBackground} />
      )}

      <section className={styles.profileWrapper}>
        <div
          className={styles.profileImage}
          style={{
            width: `${profileImageSize}rem`,
            height: `${profileImageSize}rem`,
          }}
        >
          {profileImage && (
            <Image src={profileImage} alt={`${nickname}의 프로필`} fill unoptimized className={styles.profileImg} />
          )}
        </div>

        <span className={clsx(styles.nickname, isDarkBackground && styles.nicknameOnDark)}>{nickname}</span>
        <span className={styles.expiresText}>{expiresText}</span>
      </section>

      <section className={styles.messageWrapper}>
        <p className={styles.message}>{message}</p>

        {song && (
          <div className={styles.songWrapper}>
            <div className={styles.songImageWrapper}>
              {song.albumImage && <Image src={song.albumImage} alt="" fill unoptimized className={styles.songImage} />}
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
