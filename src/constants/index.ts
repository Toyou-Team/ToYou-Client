import { PRIVACY_POLICY } from './privacy';
import { MARKETING_PUSH_CONSENT, NIGHT_PUSH_CONSENT } from './pushConsent';
import { TERMS_OF_SERVICE } from './terms';

export const AGREE_DATA = [
  {
    id: 1,
    type: 'required',
    text: '서비스 이용약관',
    content: TERMS_OF_SERVICE,
  },
  {
    id: 2,
    type: 'required',
    text: '개인정보 처리방침',
    content: PRIVACY_POLICY,
  },
  {
    id: 3,
    type: 'optional',
    text: '광고성 정보 수신 동의',
    content: MARKETING_PUSH_CONSENT,
  },
  {
    id: 4,
    type: 'optional',
    text: '야간 수신 동의',
    content: NIGHT_PUSH_CONSENT,
  },
] as const;
