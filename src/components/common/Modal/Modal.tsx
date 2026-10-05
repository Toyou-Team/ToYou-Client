'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

import clsx from 'clsx';

import Button from '@/components/common/Button/Button';

import * as styles from './modal.css';

interface ModalProps {
  title: string;
  description?: ReactNode;
  subDescription?: ReactNode;
  confirmText: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  cancelText?: string;
  isVertical?: boolean;
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
  isVertical = false,
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
    <div
      ref={cardRef}
      className={clsx(styles.card, isVertical && styles.verticalCard)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <section className={styles.textGroup}>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        <div className={styles.descriptionWrapper}>
          {description != null && <h2 className={styles.description}>{description}</h2>}

          {subDescription != null && <h3 className={styles.subDescription}>{subDescription}</h3>}
        </div>
      </section>

      <section className={clsx(styles.buttonWrapper, isVertical && styles.verticalButtonWrapper)}>
        {cancelText != null && (
          <Button type="button" variant="secondary" size="medium" onClick={onClose}>
            {cancelText}
          </Button>
        )}
        <Button type="button" size="medium" onClick={onConfirm} disabled={confirmDisabled}>
          {confirmText}
        </Button>
      </section>
    </div>
  );
}
