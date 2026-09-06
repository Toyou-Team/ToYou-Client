'use client';

import { ReactNode } from 'react';

import * as styles from './bottomSheet.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, headerAction, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
      >
        <div className={styles.handle} />

        {(title || headerAction) && (
          <header className={styles.header}>
            {title && (
              <h2 id="bottom-sheet-title" className={styles.title}>
                {title}
              </h2>
            )}
            {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
          </header>
        )}

        <div className={styles.content}>{children}</div>
      </section>
    </>
  );
}
