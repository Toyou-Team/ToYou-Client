'use client';

import { useState } from 'react';

import Button from '@/components/common/Button/Button';
import * as styles from './write-letter.css';
import { IcClose, IcImage, IcMusic } from '@/assets/icons';

const MAX_LENGTH = 500;

export default function WriteLetterPage() {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <main className={styles.page}>
      <button type="button" className={styles.closeButton} aria-label="편지 쓰기 닫기">
        <IcClose />
      </button>

      <section className={styles.letter}>
        <div className={styles.messageWrapper}>
          <textarea
            value={message}
            onChange={handleMessageChange}
            maxLength={MAX_LENGTH}
            placeholder="오늘 어떤 하루를 보냈나요?"
            className={styles.message}
          />

          {message.length > 0 && (
            <span className={styles.letterCount}>
              {message.length} / {MAX_LENGTH}
            </span>
          )}
        </div>

        <div className={styles.attachments}>
          <button type="button" className={styles.attachmentButton}>
            <IcImage />
            사진
          </button>

          <button type="button" className={styles.attachmentButton}>
            <IcMusic />
            음악
          </button>
        </div>
      </section>

      <div className={styles.submitButtonWrapper}>
        <Button type="button" disabled={!message.trim()}>
          보내기
        </Button>
      </div>
    </main>
  );
}
