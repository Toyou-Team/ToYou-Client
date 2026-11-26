'use client';

import clsx from 'clsx';

import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';

import * as styles from './actionSheet.css';

interface Action {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // false 면 숨김
  actions: (Action | false)[];
  closeText?: string;
}

export function ActionSheet({ isOpen, onClose, actions, closeText = '취소' }: ActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className={styles.actionList}>
        {actions.map(
          (action) =>
            action && (
              <button
                key={action.label}
                type="button"
                className={clsx(styles.actionButton, action.isDanger && styles.deleteButton)}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ),
        )}

        <button type="button" className={styles.actionButton} onClick={onClose}>
          {closeText}
        </button>
      </div>
    </BottomSheet>
  );
}
