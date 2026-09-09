'use client';

import { useRef, useState } from 'react';

import clsx from 'clsx';
import * as styles from './letterCarousel.css';
import { LetterCard } from '@/components/common/LetterCard/LetterCard';
import { LetterSong } from '@/types/letterCardTypes';

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
}

export function LetterCarousel({ letters }: LetterCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <div className={styles.carousel}>
      <ul ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {letters.map((letter) => (
          <li key={letter.id} className={styles.slide}>
            <LetterCard
              nickname={letter.nickname}
              message={letter.message}
              profileImage={letter.profileImage}
              expiresText={letter.expiresText}
              song={letter.song}
            />
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
