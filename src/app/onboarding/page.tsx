'use client';

import { useRef, useState, type UIEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import * as styles from './onboarding.css';
import { IcClock } from '@/assets/icons';
import { ImgOnboarding01, ImgOnboarding02, ImgOnboarding03, ImgOnboarding04 } from '@/assets/imgs';
import Button from '@/components/common/Button/Button';
import { dot, dotActive, dots } from '@/components/home/LetterCarousel/letterCarousel.css';

const STEPS = [
  {
    image: ImgOnboarding01,
    title: '하루 세 번,\n편지가 배송돼요.',
    description: '매일 12시, 18시, 21시에\n새로운 편지가 두 통씩 도착해요.',
  },
  {
    image: ImgOnboarding02,
    title: '첫 편지를 쓰면\n40초코를 드려요.',
    description: '처음 쓰는 편지 한 통에\n환영 선물을 담아 보내드릴게요.',
  },
  {
    image: ImgOnboarding03,
    title: '마음에 드는 편지를\n열어보고 답장해요.',
    description: '도착한 두 통 중 하나를 골라 5초코로 열어보면,\n그 편지에 답장할 수 있어요.',
  },
  {
    image: ImgOnboarding04,
    title: '매일 자정,\n20초코가 충전돼요.',
    description: '초코는 최대 60개까지 모을 수 있어요.',
    notice: '초코 충전 기능은 곧 업데이트 될 예정이에요.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const trackRef = useRef<HTMLUListElement>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const isLastStep = stepIndex === STEPS.length - 1;

  const goHome = () => router.replace('/home');

  const goToStep = (index: number) => {
    const track = trackRef.current;
    track?.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = ({ currentTarget }: UIEvent<HTMLUListElement>) => {
    setStepIndex(Math.round(currentTarget.scrollLeft / currentTarget.clientWidth));
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.skipArea}>
        <button type="button" className={styles.skipButton} onClick={goHome}>
          건너뛰기
        </button>
      </div>

      <ul ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {STEPS.map(({ image, title, description, notice }) => (
          <li key={title} className={styles.slide}>
            <Image src={image} alt="" className={styles.image} priority unoptimized />
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>

            {notice && (
              <p className={styles.notice}>
                <IcClock aria-hidden />
                {notice}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.bottomArea}>
        <div className={clsx(dots, styles.dots)} role="tablist" aria-label="온보딩 단계">
          {STEPS.map(({ title }, index) => (
            <button
              key={title}
              type="button"
              role="tab"
              aria-selected={index === stepIndex}
              aria-label={`${index + 1}번째 안내 보기`}
              className={clsx(dot, index === stepIndex && dotActive)}
              onClick={() => goToStep(index)}
            />
          ))}
        </div>

        <Button type="button" onClick={isLastStep ? goHome : () => goToStep(stepIndex + 1)}>
          {isLastStep ? '완료' : '다음'}
        </Button>
      </div>
    </main>
  );
}
