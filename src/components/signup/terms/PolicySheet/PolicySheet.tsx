'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import * as styles from './policySheet.css';

interface PolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function PolicySheet({ isOpen, onClose, title, content }: PolicySheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerAction={
        <button type="button" className={styles.closeText} onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className={styles.scrollArea}>
        <div className={styles.content}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: (props) => (
                <div className={styles.tableWrapper}>
                  <table {...props} />
                </div>
              ),
              a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>
    </BottomSheet>
  );
}
