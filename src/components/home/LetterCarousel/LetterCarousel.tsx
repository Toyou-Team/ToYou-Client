'use client';

import { useRef, useState } from 'react';

import clsx from 'clsx';

import type { Delivery } from '@/common/apis/delivery';
import { LetterCard } from '@/components/common/LetterCard/LetterCard';
import { formatExpiresIn } from '@/utils/date';

import * as styles from './letterCarousel.css';

interface LetterCarouselProps {
  deliveries: Delivery[];
  onSelect?: (delivery: Delivery) => void;
}

export function LetterCarousel({ deliveries, onSelect }: LetterCarouselProps) {
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

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const centeredLeft = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

    track.scrollTo({
      left: Math.min(Math.max(centeredLeft, 0), maxScrollLeft),
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.carousel}>
      <ul ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {deliveries.map((delivery) => (
          <li key={delivery.id} className={styles.slide}>
            <div
              className={styles.cardButton}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(delivery)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect?.(delivery);
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
