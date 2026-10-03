'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { IcCheckNeutral300 } from '@/assets/icons';
import { ApiError } from '@/common/apis/client';
import { HTTP_STATUS_CODE } from '@/common/apis/constants/http';
import { useReportMutation, type ReportReason } from '@/common/apis/conversation';
import { useBlockConversation } from '@/common/hooks/useBlockConversation';
import { useModal } from '@/common/hooks/useModal';
import { BackButton } from '@/components/common/BackButton/BackButton';
import Button from '@/components/common/Button/Button';
import { Header } from '@/components/common/Header/Header';
import { Modal } from '@/components/common/Modal/Modal';

import * as styles from './report.css';

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'SEXUAL_OR_UNCOMFORTABLE_CONTENT', label: '성적이거나 불쾌한 콘텐츠' },
  { value: 'ABUSE_THREAT_OR_HATE', label: '욕설 및 혐오 · 비하 발언' },
  { value: 'FRAUD_SPAM_OR_PROMOTION', label: '사기나 스팸 · 홍보' },
  { value: 'OTHER', label: '기타' },
];

const DETAIL_MAX_LENGTH = 500;

export default function ReportPage() {
  const { conversationId, messageId } = useParams<{ conversationId: string; messageId: string }>();
  const router = useRouter();
  const { open } = useModal();

  const { mutate: report, isPending } = useReportMutation(conversationId);
  const openBlockConfirm = useBlockConversation(conversationId);

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');

  const isOther = reason === 'OTHER';
  const canSubmit = reason !== null && (!isOther || detail.trim().length > 0);

  const openAlertModal = (title: string, description?: string, onConfirm?: () => void) => {
    open(({ close }) => (
      <Modal
        title={title}
        description={description}
        confirmText="확인"
        onConfirm={() => {
          close();
          onConfirm?.();
        }}
        onClose={close}
      />
    ));
  };

  // 신고 화면을 닫은 뒤에도 떠 있도록 전역 모달로 띄운다
  const openReportedModal = () => {
    open(({ close }) => (
      <Modal
        title="신고가 접수 됐어요"
        description={'24시간 안에 검토하고 조치할게요.\n조금만 기다려 주세요.'}
        confirmText="이 사용자 차단하기"
        cancelText="차단 없이 닫기"
        isVertical
        onConfirm={() => {
          close();
          openBlockConfirm();
        }}
        onClose={close}
      />
    ));
  };

  const handleSubmit = () => {
    if (!reason) return;

    report(
      { messageId, reason, detail: isOther ? detail.trim() : undefined },
      {
        onSuccess: ({ alreadyReportedUser }) => {
          router.back();

          if (alreadyReportedUser) {
            openAlertModal('이미 접수된 신고가 있어요', '24시간 이내 검토할 예정이니 조금만 기다려 주세요.');
          } else {
            openReportedModal();
          }
        },
        onError: (error) => {
          if (!(error instanceof ApiError)) return;

          if (error.status === HTTP_STATUS_CODE.NOT_FOUND) {
            openAlertModal('신고할 수 없는 편지예요', error.message, () => router.replace('/letter-box'));
            return;
          }

          openAlertModal('신고하지 못했어요', error.message);
        },
      },
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Header bordered left={<BackButton />} center={<span className={styles.titleText}>신고</span>} />

      <main className={styles.content}>
        <h1 className={styles.title}>어떤 점이 문제였나요?</h1>
        <p className={styles.description}>신고 내용은 상대에게 전달 되지 않아요. 안심하고 알려주세요.</p>

        <ul className={styles.reasonList}>
          {REASONS.map(({ value, label }) => {
            const isSelected = reason === value;

            return (
              <li key={value}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={styles.reasonButton}
                  onClick={() => setReason(value)}
                >
                  <span className={clsx(styles.checkBox, isSelected && styles.checkBoxSelected)}>
                    <IcCheckNeutral300 aria-hidden />
                  </span>
                  <span className={styles.reasonOption}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {isOther && (
          <textarea
            className={styles.detailInput}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={DETAIL_MAX_LENGTH}
            placeholder="어떤 일이 있었는지 알려주시면 조치할게요. (선택)"
          />
        )}

        <p className={styles.notice}>
          접수된 신고는 24시간 안에 검토하고, 위반이 확인되면 이용 제한 등의 조치를 해요. 급하거나 위급한 상황이라면
          관계 기관에도 함께 신고해 주세요.
        </p>
      </main>

      <div className={styles.submitButtonWrapper}>
        <Button type="button" disabled={!canSubmit || isPending} onClick={handleSubmit}>
          신고하기
        </Button>
      </div>
    </div>
  );
}
