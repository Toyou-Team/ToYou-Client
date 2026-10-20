'use client';

import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import type { Delivery } from '@/common/apis/delivery';
import { LetterCard } from '@/components/common/LetterCard/LetterCard';
import { formatExpiresIn } from '@/utils/date';

import * as styles from './letterCarousel.css';

interface LetterCarouselProps {
  deliveries: Delivery[];
  onSelect?: (delivery: Delivery) => void;
}

// 편지를 보고 홈으로 돌아왔을 때 보던 편지에서 다시 시작하도록, 마지막으로 누른 편지를 기억한다
const LAST_SELECTED_KEY = 'toyou_home_last_letter';

const getLastSelectedId = () => (typeof window === 'undefined' ? null : sessionStorage.getItem(LAST_SELECTED_KEY));

const scrollTrackToIndex = (track: HTMLUListElement | null, index: number, behavior: ScrollBehavior) => {
  const slide = track?.children[index] as HTMLElement | undefined;
  if (!track || !slide) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth;
  const centeredLeft = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

  track.scrollTo({ left: Math.min(Math.max(centeredLeft, 0), maxScrollLeft), behavior });
};

export function LetterCarousel({ deliveries, onSelect }: LetterCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [initialIndex] = useState(() =>
    Math.max(
      0,
      deliveries.findIndex(({ id }) => id === getLastSelectedId()),
    ),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // 돌아온 위치로 애니메이션 없이 바로 이동
  useEffect(() => {
    scrollTrackToIndex(trackRef.current, initialIndex, 'instant');
  }, [initialIndex]);

  const handleSelect = (delivery: Delivery) => {
    sessionStorage.setItem(LAST_SELECTED_KEY, delivery.id);
    onSelect?.(delivery);
  };

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

  const scrollToIndex = (index: number) => scrollTrackToIndex(trackRef.current, index, 'smooth');

  return (
    <div className={styles.carousel}>
      <ul ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {deliveries.map((delivery) => (
          <li key={delivery.id} className={styles.slide}>
            <div
              className={styles.cardButton}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(delivery)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSelect(delivery);
                }
              }}
            >
              <LetterCard
                nickname={delivery.content.author.nickname}
                message={delivery.content.body}
                profileImage={delivery.content.author.profileImage?.url}
                backgroundImage={delivery.content.image?.url}
                expiresText={formatExpiresIn(delivery.expiresAt)}
                song={
                  delivery.content.spotify
                    ? {
                        title: delivery.content.spotify.title,
                        artist: delivery.content.spotify.artist,
                        albumImage: delivery.content.spotify.albumImageUrl ?? undefined,
                      }
                    : undefined
                }
              />
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.dots} role="tablist" aria-label="편지 목록">
        {deliveries.map((delivery, index) => (
          <button
            key={delivery.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${index + 1}번째 편지 보기`}
            className={clsx(styles.dot, index === activeIndex && styles.dotActive)}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
