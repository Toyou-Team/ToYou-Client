import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { request } from './client';

export interface SpotifyTrack {
  id: string;
  title: string;
  artists: string[];
  albumImageUrl: string | null;
  externalUrl: string;
  durationMs: number;
}

export interface SpotifyTrackSearchResult {
  items: SpotifyTrack[];
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset: number | null;
}

// 검색 전에 보여줄 추천곡 (최대 20곡)
export const getSpotifyRecommendations = () =>
  request<{ items: SpotifyTrack[] }>('get', '/api/v1/music/spotify/recommendations', undefined, { retry: 0 });

export const useSpotifyRecommendationsQuery = () =>
  useQuery({
    queryKey: ['spotify-recommendations'],
    queryFn: getSpotifyRecommendations,
    select: (data) => data.items,
    // 서버 캐시(5분)에 맞추고, 자동으로 다시 부르지 않는다
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

const SEARCH_PAGE_SIZE = 10;
export const SEARCH_QUERY_MAX_LENGTH = 100;

export const searchSpotifyTracks = (query: string, offset: number) => {
  const params = new URLSearchParams({ query, limit: String(SEARCH_PAGE_SIZE), offset: String(offset) });

  return request<SpotifyTrackSearchResult>('get', `/api/v1/music/spotify/tracks?${params.toString()}`);
};

export const useSpotifyTrackSearchQuery = (query: string) => {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ['spotify-tracks', trimmed],
    queryFn: ({ pageParam }) => searchSpotifyTracks(trimmed, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextOffset ?? undefined) : undefined),
    // 페이지를 이어 붙일 때 이미 있는 곡 id 는 제외
    select: (data) => {
      const seen = new Set<string>();
      return data.pages
        .flatMap((page) => page.items)
        .filter((track) => {
          if (seen.has(track.id)) return false;
          seen.add(track.id);
          return true;
        });
    },
    enabled: trimmed.length > 0,
  });
};
