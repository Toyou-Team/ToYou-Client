import { ReceivedLetterList, type ReceivedLetter } from '@/components/letter-box/ReceivedLetterList/ReceivedLetterList';

import * as styles from './letter-box.css';

// TODO: 임시 데이터
const MOCK_LETTERS: ReceivedLetter[] = [
  {
    id: '1',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
  {
    id: '2',
    nickname: '뽀야미',
    message: '아직 고구마를 맛보지 않은 친구들이 없겠지? 감자보다 고구마가 짱이야',
    receivedAtText: '어제',
    isUnread: true,
  },
  {
    id: '3',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
  {
    id: '4',
    nickname: '뽀야미',
    message: '아직 고구마를 맛보지 않은 친구들이 없겠지? 감자보다 고구마가 짱이야',
    receivedAtText: '어제',
    isUnread: true,
  },
  {
    id: '5',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
  {
    id: '6',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
  {
    id: '7',
    nickname: '뽀야미',
    message: '아직 고구마를 맛보지 않은 친구들이 없겠지? 감자보다 고구마가 짱이야',
    receivedAtText: '어제',
    isUnread: true,
  },
  {
    id: '8',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
  {
    id: '9',
    nickname: '뽀야미',
    message: '아직 고구마를 맛보지 않은 친구들이 없겠지? 감자보다 고구마가 짱이야',
    receivedAtText: '어제',
    isUnread: true,
  },
  {
    id: '10',
    nickname: '대장',
    message: '오늘 아주 멋진 하루였어. 하늘에 별이 가득해서 내 마음도 가득해졌어',
    receivedAtText: 'PM 09:33',
  },
];

export default function LetterBoxPage() {
  return (
    <div className={styles.letterBoxWrapper}>
      <ReceivedLetterList letters={MOCK_LETTERS} />
    </div>
  );
}
