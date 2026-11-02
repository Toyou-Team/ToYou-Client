import { PRIVACY_POLICY } from './privacy';
import { TERMS_OF_SERVICE } from './terms';

interface AgreeData {
  id: number;
  type: 'required' | 'optional';
  text: string;
  content?: string;
  // 보기를 누르면 이 항목의 약관을 보여준다
  policyId?: number;
  detail?: { title: string; description: string };
}

export const AGREE_DATA: AgreeData[] = [
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
    policyId: 1,
    detail: {
      title: '광고·이벤트 알림',
      description: '마케팅 정보 수집에 동의하시면, 기능 업데이트 및 이벤트, 할인 혜택까지 빠르게 받아보실 수 있습니다.',
    },
  },
  {
    id: 4,
    type: 'optional',
    text: '야간 수신 동의',
    policyId: 1,
  },
];
