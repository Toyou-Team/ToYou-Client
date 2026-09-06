import { PRIVACY_POLICY } from './privacy';
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
    text: '개인정보처리방침',
    content: PRIVACY_POLICY,
  },
  {
    id: 3,
    type: 'optional',
    text: '푸시 알림 기능',
    content: '',
  },
] as const;
