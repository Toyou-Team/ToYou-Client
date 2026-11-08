// 상태 바/홈 바 높이. 화면을 가장자리까지 그릴 때(viewport-fit=cover) 값이 생기고, 그 밖에는 0
export const SAFE_AREA = {
  top: 'var(--safe-area-top)',
  bottom: 'var(--safe-area-bottom)',
};

export const withSafeTop = (value: string) => `calc(${value} + ${SAFE_AREA.top})`;
export const withSafeBottom = (value: string) => `calc(${value} + ${SAFE_AREA.bottom})`;
