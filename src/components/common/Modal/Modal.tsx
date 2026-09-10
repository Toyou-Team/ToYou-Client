'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

import clsx from 'clsx';

import * as styles from './modal.css';

interface ModalProps {
  title: string;
  description?: ReactNode;
  subDescription?: ReactNode;
  confirmText: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  cancelText?: string;
  onClose: () => void;
}

export function Modal({
  title,
  description,
  subDescription,
  confirmText,
  onConfirm,
  confirmDisabled = false,
  cancelText,
  onClose,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div ref={cardRef} className={styles.card} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <section className={styles.textGroup}>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        <div className={styles.descriptionWrapper}>
          {description != null && <h2 className={styles.description}>{description}</h2>}

          {subDescription != null && <h3 className={styles.subDescription}>{subDescription}</h3>}
        </div>
      </section>

      <section className={styles.buttonWrapper}>
        {cancelText != null && (
          <button type="button" className={clsx(styles.button, styles.cancelButton)} onClick={onClose}>
            {cancelText}
          </button>
        )}
        <button
          type="button"
          className={clsx(styles.button, styles.confirmButton)}
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {confirmText}
        </button>
      </section>
    </div>
  );
}
