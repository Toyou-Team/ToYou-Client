'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import Button from '@/components/common/Button/Button';
import { IcCheckCircleNeutral900, IcChevronLeft, IcSearch, IcSpotify } from '@/assets/icons';
import { useDebouncedValue } from '@/common/hooks/useDebouncedValue';
import { SEARCH_QUERY_MAX_LENGTH, useSpotifyTrackSearchQuery, type SpotifyTrack } from '@/common/apis/music';

import * as styles from './musicPicker.css';
import { Header } from '@/components/common/Header/Header';
import { IconButton } from '@/components/common/IconButton';

interface MusicPickerProps {
  initialTrack: SpotifyTrack | null;
  onClose: () => void;
  onConfirm: (track: SpotifyTrack) => void;
}

export function MusicPicker({ initialTrack, onClose, onConfirm }: MusicPickerProps) {
  const [query, setQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(initialTrack);
  const debouncedQuery = useDebouncedValue(query, 350);

  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);

  const {
    data: tracks = [],
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useSpotifyTrackSearchQuery(debouncedQuery);
  const hasSearched = debouncedQuery.trim().length > 0;

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const latestRef = useRef({ fetchNextPage, isFetchingNextPage });
  useEffect(() => {
    latestRef.current = { fetchNextPage, isFetchingNextPage };
  }, [fetchNextPage, isFetchingNextPage]);

  // 스크롤이 목록 하단 근처(sentinel)에 닿으면 다음 10개를 불러온다.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !latestRef.current.isFetchingNextPage) {
          latestRef.current.fetchNextPage();
        }
      },
      { root: listRef.current, rootMargin: '160px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage]);

  const handleConfirm = () => {
    if (!selectedTrack) return;
    onConfirm(selectedTrack);
  };

  return (
    <div className={styles.overlay}>
      <Header
        bordered
        left={<IconButton icon={<IcChevronLeft />} label="뒤로가기" onClick={onClose} />}
        center={<span className={styles.titleText}>음악 선택</span>}
      />

      <div className={styles.searchFieldWrapper}>
        <IcSearch />
        <input
          className={styles.searchInput}
          value={query}
          onChange={handleQueryChange}
          maxLength={SEARCH_QUERY_MAX_LENGTH}
          placeholder="검색"
        />
      </div>

      <ul ref={listRef} className={styles.list}>
        {!hasSearched && <li className={styles.emptyText}>노래 제목이나 가수를 검색해보세요.</li>}

        {hasSearched && isError && (
          <li className={styles.emptyText}>
            검색에 실패했어요.
            <br />
            <button type="button" className={styles.retryButton} onClick={() => refetch()}>
              다시 시도
            </button>
          </li>
        )}

        {hasSearched && !isLoading && !isError && tracks.length === 0 && (
          <li className={styles.emptyText}>검색 결과가 없어요.</li>
        )}

        {tracks.map((track) => {
          const isSelected = selectedTrack?.id === track.id;

          return (
            <li key={track.id}>
              <button type="button" className={styles.trackRow} onClick={() => setSelectedTrack(track)}>
                <img src={track.albumImageUrl} alt="" className={styles.albumImage} />

                <div className={styles.trackInfo}>
                  <p className={styles.trackTitle}>{track.title}</p>
                  <div className={styles.trackArtist}>
                    <IcSpotify />
                    <span className={styles.artistName}>{track.artists.join(', ')}</span>
                  </div>
                </div>

                {isSelected && <IcCheckCircleNeutral900 aria-hidden className={styles.checkIcon} />}
              </button>
            </li>
          );
        })}

        {hasNextPage && <li ref={sentinelRef} className={styles.sentinel} aria-hidden />}

        {isFetchingNextPage && <li className={styles.loadingText}>불러오는 중...</li>}
      </ul>

      <div className={styles.confirmButtonWrapper}>
        <Button type="button" disabled={!selectedTrack} onClick={handleConfirm}>
          완료
        </Button>
      </div>
    </div>
  );
}
