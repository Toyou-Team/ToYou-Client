import type { LetterContent } from '@/common/apis/delivery';

import * as styles from './letterPaper.css';

interface LetterPaperProps {
  letter: Pick<LetterContent, 'body' | 'createdAt' | 'spotify'>;
  isPreview?: boolean;
}

const formatLetterDate = (isoString: string) => {
  const date = new Date(isoString);
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = date.getHours();

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${hours < 12 ? '오전' : '오후'} ${pad(hours % 12 || 12)}:${pad(date.getMinutes())}`;
};

export function LetterPaper({ letter, isPreview = false }: LetterPaperProps) {
  const { body, createdAt, spotify } = letter;

  return (
    <div className={styles.paper}>
      <article className={styles.letter}>
        {isPreview ? (
          <>
            <p className={styles.body}>{body}</p>

            <div className={styles.divider}>
              <span className={styles.dividerText}>편지를 선택하면 온전히 열려요.</span>
            </div>

            {/* 나머지 본문은 서버가 주지 않아 보이는 본문을 흐리게 채운다 */}
            <p className={styles.hiddenBody} aria-hidden>
              {body.repeat(3)}
            </p>
          </>
        ) : (
          <p className={styles.body}>{body}</p>
        )}

        <time className={styles.date} dateTime={createdAt}>
          {formatLetterDate(createdAt)}
        </time>
      </article>

      {spotify && (
        <div className={styles.song}>
          {spotify.albumImageUrl && <img src={spotify.albumImageUrl} alt="" className={styles.albumImage} />}

          <div className={styles.songInfo}>
            <p className={styles.songTitle}>{spotify.title}</p>
            <p className={styles.songArtist}>{spotify.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
}
