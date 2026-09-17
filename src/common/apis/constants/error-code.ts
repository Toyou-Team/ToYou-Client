export const AUTH_ERROR_CODE = {
  // Refresh를 한 번 시도하고 실패하면 로그인 화면
  TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  // 토큰을 확인하고 로그인 화면
  TOKEN_REQUIRED: 'AUTH_TOKEN_REQUIRED',
  // 토큰 전체 삭제 후 카카오 로그인
  REFRESH_TOKEN_INVALID: 'AUTH_REFRESH_TOKEN_INVALID',
  // 카카오 로그인을 처음부터 다시 시도
  INVALID_AUTHORIZATION_CODE: 'AUTH_INVALID_AUTHORIZATION_CODE',
  // 카카오 로그인을 처음부터 다시 시도
  KAKAO_TOKEN_EXCHANGE_FAILED: 'AUTH_KAKAO_TOKEN_EXCHANGE_FAILED',
  // 가입 화면을 중단하고 카카오 로그인부터 다시 시작
  REGISTRATION_TOKEN_INVALID: 'AUTH_REGISTRATION_TOKEN_INVALID',
  // 만 14세 미만 가입 불가 안내
  AGE_RESTRICTED: 'AUTH_AGE_RESTRICTED',
  // 가입을 중단하고 카카오 연령정보 확인 안내 표시
  AGE_VERIFICATION_UNAVAILABLE: 'AUTH_AGE_VERIFICATION_UNAVAILABLE',
} as const;

export const PROFILE_ERROR_CODE = {
  /** 닉네임 입력란에 중복 오류 표시 */
  NICKNAME_TAKEN: 'PROFILE_NICKNAME_TAKEN',
} as const;
