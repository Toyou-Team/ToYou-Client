import type { LetterContent } from '@/common/apis/delivery';

import * as styles from './letterPaper.css';

interface LetterPaperProps {
  letter: LetterContent;
  // 미리보기
  isPreview?: boolean;
}

// TODO: 본문이 이보다 짧을 때 미리보기 처리는 기획 논의 후 결정
const PREVIEW_LENGTH = 79;

const formatLetterDate = (isoString: string) => {
  const date = new Date(isoString);
  const pad = (value: number) => String(value).padStart(2, '0');
  const hours = date.getHours();

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${hours < 12 ? '오전' : '오후'} ${pad(hours % 12 || 12)}:${pad(date.getMinutes())}`;
};

export function LetterPaper({ letter, isPreview = false }: LetterPaperProps) {
  const { body, createdAt, spotify } = letter;

  return (
    <article className={styles.paper}>
      {isPreview ? (
        <>
          <p className={styles.body}>{body.slice(0, PREVIEW_LENGTH)}</p>

          <div className={styles.divider}>
            <span className={styles.dividerText}>편지를 선택하면 온전히 열려요.</span>
          </div>

          <p className={styles.hiddenBody} aria-hidden>
            {body.slice(PREVIEW_LENGTH)}
          </p>
        </>
      ) : (
        <p className={styles.body}>{body}</p>
      )}

      <time className={styles.date} dateTime={createdAt}>
        {formatLetterDate(createdAt)}
      </time>

      {spotify && (
        <div className={styles.song}>
          {spotify.albumImageUrl && <img src={spotify.albumImageUrl} alt="" className={styles.albumImage} />}

          <div className={styles.songInfo}>
            <p className={styles.songTitle}>{spotify.title}</p>
            <p className={styles.songArtist}>{spotify.artist}</p>
          </div>
        </div>
      )}
    </article>
  );
}
