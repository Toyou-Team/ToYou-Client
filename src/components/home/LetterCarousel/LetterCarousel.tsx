'use client';

import { useRef, useState } from 'react';

import clsx from 'clsx';

import { useModal } from '@/common/hooks/useModal';
import { LetterCard } from '@/components/common/LetterCard/LetterCard';
import { Modal } from '@/components/common/Modal/Modal';
import { LetterSong } from '@/types/letterCardTypes';

import * as styles from './letterCarousel.css';

export interface CarouselLetter {
  id: string;
  nickname: string;
  message: string;
  profileImage?: string;
  expiresText?: string;
  song?: LetterSong;
}

interface LetterCarouselProps {
  letters: CarouselLetter[];
  // 보유 초코 (API 연결 전)
  myChoco: number;
}

// 편지 오픈하는데 필요한 초코
const REQUIRED_CHOCO = 5;

export function LetterCarousel({ letters, myChoco }: LetterCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { open } = useModal();

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const slides = Array.from(track.children) as HTMLElement[];

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;

    if (!track || !slide) return;

    const scrollPadding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;

    track.scrollTo({
      left: slide.offsetLeft - scrollPadding,
      behavior: 'smooth',
    });
  };

  const handleCardClick = () => {
    if (myChoco >= REQUIRED_CHOCO) {
      open(({ close }) => (
        <Modal
          title="새 카드 받기"
          description="편지 두 장을 새로 받을까요?"
          subDescription={`초코 ${REQUIRED_CHOCO}개를 사용해요.`}
          cancelText="다음에"
          confirmText="받기"
          onConfirm={() => {
            // TODO: 편지 받기 API 호출 + 초코 차감
            close();
          }}
          onClose={close}
        />
      ));
      return;
    }

    open(({ close }) => (
      <Modal
        title="초코가 부족해요"
        description={`편지를 새로 받으면 초코 ${REQUIRED_CHOCO}개가 필요해요.`}
        subDescription={
          <>
            지금은 <strong>초코 {myChoco}개</strong>를 가지고 있어요.
          </>
        }
        cancelText="다음에"
        confirmText="열기"
        confirmDisabled
        onConfirm={() => {}}
        onClose={close}
      />
    ));
  };

  return (
    <div className={styles.carousel}>
      <ul ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {letters.map((letter) => (
          <li key={letter.id} className={styles.slide}>
            <div
              className={styles.cardButton}
              role="button"
              tabIndex={0}
              onClick={handleCardClick}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleCardClick();
                }
              }}
            >
              <LetterCard
                nickname={letter.nickname}
                message={letter.message}
                profileImage={letter.profileImage}
                expiresText={letter.expiresText}
                song={letter.song}
              />
            </div>
          </li>
        ))}
      </ul>

      {letters.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="편지 목록">
          {letters.map((letter, index) => (
            <button
              key={letter.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 편지 보기`}
              className={clsx(styles.dot, index === activeIndex && styles.dotActive)}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
