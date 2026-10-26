'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAccountStatusQuery } from '@/common/apis/auth';
import { getRestrictionPath } from '@/constants/restriction';

// 제재 정보가 있는 계정만 노출. 아니면 홈, 제재 종류가 다르면 맞는 화면으로
export function useRestrictionStatus() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isError } = useAccountStatusQuery();

  const restriction = data?.restricted ? data.sanction : null;
  const path = restriction ? getRestrictionPath(restriction) : '/home';

  useEffect(() => {
    if ((data || isError) && path !== pathname) router.replace(path);
  }, [data, isError, path, pathname, router]);

  return { restriction: path === pathname ? restriction : null, supportUrl: data?.supportUrl ?? null };
}
