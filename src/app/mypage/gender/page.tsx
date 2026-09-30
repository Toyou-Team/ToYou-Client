'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header/Header';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { IcCheckNeutral900 } from '@/assets/icons';
import type { ReceiveGender } from '@/common/apis/auth';
import { GENDER_LABEL, useProfileQuery, useUpdateProfileMutation } from '@/common/apis/profile';

import * as styles from './gender.css';

const RECEIVE_GENDER_OPTIONS: ReceiveGender[] = ['MALE', 'FEMALE', 'ALL'];

export default function MyPageGenderPage() {
  const router = useRouter();
  const { data: profile } = useProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const [picked, setSelected] = useState<ReceiveGender | null>(null);
  const selected = picked ?? profile?.receiveGender ?? null;

  const handleSelect = (value: ReceiveGender) => {
    if (isPending || value === selected) return;

    setSelected(value);
    updateProfile({ receiveGender: value }, { onSuccess: () => router.back() });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header left={<BackButton />} center={<span className={styles.titleText}>받는 사람 성별</span>} bordered />

      <main className={styles.content}>
        <p className={styles.description}>편지를 받고 싶은 사람의 성별을 선택해요.</p>

        <ul className={styles.list}>
          {RECEIVE_GENDER_OPTIONS.map((option) => (
            <li key={option}>
              <button type="button" className={styles.optionRow} onClick={() => handleSelect(option)} disabled={isPending}>
                <span className={styles.optionLabel}>{GENDER_LABEL[option]}</span>
                {selected === option && <IcCheckNeutral900 />}
              </button>
            </li>
          ))}
        </ul>

        <p className={styles.note}>
          {`성별을 바꾸면 새로 도착하는 편지부터 반영돼요.
        이미 주고받은 편지에는 영향을 주지 않아요.`}
        </p>
      </main>
    </div>
  );
}
