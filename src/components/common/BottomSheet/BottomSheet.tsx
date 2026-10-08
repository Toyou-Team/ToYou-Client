'use client';

import { ReactNode, useRef, useState, type PointerEvent } from 'react';

import * as styles from './bottomSheet.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

const CLOSE_THRESHOLD_PX = 80;

export function BottomSheet({ isOpen, onClose, title, headerAction, children }: BottomSheetProps) {
  const startYRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;

    // 위로는 끌어올리지 않고 아래로만 따라오도록
    setDragY(Math.max(0, e.clientY - startYRef.current));
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;

    const distance = e.clientY - startYRef.current;
    startYRef.current = null;
    setDragY(null);

    if (distance > CLOSE_THRESHOLD_PX) onClose();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        style={dragY !== null ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        <div
          className={styles.handleArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className={styles.handle} />
        </div>

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

        {children}
      </section>
    </>
  );
}
