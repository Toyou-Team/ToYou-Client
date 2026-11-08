'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { WithdrawalReason } from '@/common/apis/auth';
import { withdrawalReasonStore } from '@/common/apis/token';
import { BackButton } from '@/components/common/BackButton/BackButton';
import Button from '@/components/common/Button/Button';
import { CheckBox } from '@/components/common/CheckBox/CheckBox';
import { Header } from '@/components/common/Header/Header';

import * as styles from './withdraw.css';

const REASONS: { id: WithdrawalReason; label: string; placeholder?: string }[] = [
  { id: 'NO_DESIRED_LETTERS', label: '받고 싶은 편지가 오지 않았어요.' },
  { id: 'CONVERSATION_NOT_CONTINUING', label: '답장이나 대화가 잘 이어지지 않았어요.' },
  { id: 'WRITING_BURDEN', label: '편지를 쓰는 게 부담스러워요.' },
  {
    id: 'UNPLEASANT_EXPERIENCE',
    label: '불쾌하거나 불편한 경험이 있어요.',
    placeholder: '어떤 일이 있었는지 알려주시면 조치할게요. (선택)',
  },
  { id: 'LOST_INTEREST', label: '흥미가 떨어졌어요.' },
  { id: 'TAKING_BREAK', label: '잠깐 쉬어갈래요.' },
  { id: 'OTHER', label: '기타', placeholder: '자유롭게 적어주세요. (선택)' },
];

const DETAIL_MAX_LENGTH = 500;

export default function WithdrawReasonPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<WithdrawalReason[]>([]);
  const [details, setDetails] = useState<Partial<Record<WithdrawalReason, string>>>({});

  const canNext = selectedIds.length > 0;

  const toggleReason = (id: WithdrawalReason) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const getDetail = (id: WithdrawalReason) => (selectedIds.includes(id) && details[id]?.trim()) || undefined;

  const handleNext = () => {
    withdrawalReasonStore.set({
      reasons: REASONS.filter(({ id }) => selectedIds.includes(id)).map(({ id }) => id),
      unpleasantExperienceDetail: getDetail('UNPLEASANT_EXPERIENCE'),
      otherDetail: getDetail('OTHER'),
    });
    router.push('/mypage/withdraw/confirm');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header isSticky bordered left={<BackButton />} center={<span className={styles.headerTitle}>회원 탈퇴</span>} />

      <main className={styles.content}>
        <h1 className={styles.title}>
          떠나기 전에,
          <br />
          가시는 이유를 들려주시겠어요?
        </h1>
        <p className={styles.description}>투유가 더 좋은 방향으로 나아가는데 큰 도움이 돼요.</p>

        <ul className={styles.reasonList}>
          {REASONS.map(({ id, label, placeholder }) => {
            const isSelected = selectedIds.includes(id);

            return (
              <li key={id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  className={styles.reasonButton}
                  onClick={() => toggleReason(id)}
                >
                  <CheckBox isChecked={isSelected} />
                  {label}
                </button>

                {isSelected && placeholder && (
                  <textarea
                    className={styles.detailInput}
                    value={details[id] ?? ''}
                    onChange={(e) => setDetails((prev) => ({ ...prev, [id]: e.target.value }))}
                    maxLength={DETAIL_MAX_LENGTH}
                    placeholder={placeholder}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </main>

      <div className={styles.bottomButtonWrapper}>
        <Button type="button" disabled={!canNext} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
