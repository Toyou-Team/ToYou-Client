'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header/Header';
import { BackButton } from '@/components/common/BackButton/BackButton';
import { IcCheckNeutral900 } from '@/assets/icons';
import { GENDER_LABEL, mockUserStore, type ReceiveGender } from '@/common/mock/user';

import * as styles from './gender.css';

const RECEIVE_GENDER_OPTIONS: ReceiveGender[] = ['MALE', 'FEMALE', 'ALL'];

export default function MyPageGenderPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ReceiveGender | null>(null);

  // TODO: 유저 정보 조회 API 연동 전까지 사용하는 임시 데이터
  useEffect(() => {
    setSelected(mockUserStore.get().receiveGender);
  }, []);

  const handleSelect = (value: ReceiveGender) => {
    setSelected(value);

    // TODO: 받는 사람 성별 수정 API 연동
    mockUserStore.patch({ receiveGender: value });
    router.back();
  };

  return (
    <div className={styles.pageWrapper}>
      <Header left={<BackButton />} center={<span className={styles.titleText}>받는 사람 성별</span>} bordered />

      <main className={styles.content}>
        <p className={styles.description}>편지를 받고 싶은 사람의 성별을 선택해요.</p>

        <ul className={styles.list}>
          {RECEIVE_GENDER_OPTIONS.map((option) => (
            <li key={option}>
              <button type="button" className={styles.optionRow} onClick={() => handleSelect(option)}>
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
