import Link from 'next/link';

import * as styles from './receivedLetterList.css';

export interface ReceivedLetter {
  id: string;
  nickname: string;
  message: string;
  receivedAtText: string;
  profileImage?: string;
  isUnread?: boolean;
}

interface ReceivedLetterListProps {
  letters: ReceivedLetter[];
}

export function ReceivedLetterList({ letters }: ReceivedLetterListProps) {
  if (letters.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <p className={styles.emptyText}>주고받은 편지가 없어요.</p>

        <Link href="/write-letter" className={styles.writeLetterButton}>
          편지 쓰기
        </Link>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {letters.map((letter) => (
        <li key={letter.id} className={styles.item}>
          <div className={styles.profileImage}>
            {letter.profileImage && (
              <img src={letter.profileImage} alt={`${letter.nickname}의 프로필`} className={styles.profileImg} />
            )}
          </div>

          <section className={styles.content}>
            <div className={styles.topRow}>
              <span className={styles.nickname}>{letter.nickname}</span>
              <span className={styles.receivedAt}>{letter.receivedAtText}</span>
            </div>

            <div className={styles.bottomRow}>
              <p className={styles.message}>{letter.message}</p>
              {letter.isUnread && <span className={styles.unreadDot} aria-label="읽지 않음" />}
            </div>
          </section>
        </li>
      ))}
    </ul>
  );
}
