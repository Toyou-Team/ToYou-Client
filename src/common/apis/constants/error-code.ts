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
  // 카카오 서비스 일시 장애. 자동 재시도 X
  KAKAO_UNAVAILABLE: 'AUTH_KAKAO_UNAVAILABLE',
  // 서버가 앱(카카오 SDK) 로그인을 끈 환경. 웹 카카오 로그인으로 전환
  KAKAO_NATIVE_LOGIN_DISABLED: 'AUTH_KAKAO_NATIVE_LOGIN_DISABLED',
  // Apple 로그인 서비스 일시 장애. 자동 재시도 X
  APPLE_UNAVAILABLE: 'AUTH_APPLE_UNAVAILABLE',
  // 탈퇴 재인증 code 만료·재사용. 애플 재인증부터 다시
  APPLE_AUTHORIZATION_INVALID: 'AUTH_APPLE_AUTHORIZATION_INVALID',
  // 로그인한 계정과 다른 애플 계정으로 재인증
  APPLE_ACCOUNT_MISMATCH: 'AUTH_APPLE_ACCOUNT_MISMATCH',
  // 가입 화면을 중단하고 카카오 로그인부터 다시 시작
  REGISTRATION_TOKEN_INVALID: 'AUTH_REGISTRATION_TOKEN_INVALID',
  // 만 14세 미만 가입 불가 안내
  AGE_RESTRICTED: 'AUTH_AGE_RESTRICTED',
  // 가입을 중단하고 카카오 연령정보 확인 안내 표시
  AGE_VERIFICATION_UNAVAILABLE: 'AUTH_AGE_VERIFICATION_UNAVAILABLE',
  // 정지 계정 또는 재가입 제한 기간이 남은 계정은 랜딩에서 가입 제한 모달 표시
  ACCOUNT_UNAVAILABLE: 'AUTH_ACCOUNT_UNAVAILABLE',
  // 이미 가입된 계정. 카카오 로그인부터 다시 해서 계정 생성 여부 확인
  ACCOUNT_EXISTS: 'AUTH_ACCOUNT_EXISTS',
  // 카카오에서 성별을 받지 못한 경우. 안내만 표시
  GENDER_REQUIRED: 'AUTH_GENDER_REQUIRED',
} as const;

// 제재 중 막힌 기능 호출 시 403. 로그인 만료 X
export const ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED';

// 없는 대화방·비참여자·차단 관계. 안내 후 편지함으로
export const CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND';

// 편지/답장/닉네임에 금칙어나 외부 연락처가 있으면 message 를 그대로 안내
export const CONTENT_ERROR_CODE = {
  EXTERNAL_CONTACT: 'CONTENT_EXTERNAL_CONTACT',
  FORBIDDEN_WORD: 'CONTENT_FORBIDDEN_WORD',
} as const;

// 충전 알림 신청 조건(푸시 토큰, 광고성 수신 동의) 미충족. 설정을 켜도록 안내
export const CHARGE_ALERT_CONDITIONS_NOT_MET = 'CHARGE_ALERT_CONDITIONS_NOT_MET';

export const PROFILE_ERROR_CODE = {
  /** 닉네임 입력란에 중복 오류 표시 */
  NICKNAME_TAKEN: 'PROFILE_NICKNAME_TAKEN',
} as const;
