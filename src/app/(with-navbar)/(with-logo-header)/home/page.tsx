import Button from '@/components/common/Button/Button';
import { LetterCarousel, type CarouselLetter } from '@/components/home/LetterCarousel/LetterCarousel';
import * as styles from './home.css';
import { ImgMockAlbum } from '@/assets/imgs';

const LETTER_QUESTIONS = ['오늘,\n어떤 마음이었어?', '오늘 하루는\n어땠어?', '오늘 가장 기억에 남는 순간은?'];

// TODO: 임시 데이터
const MOCK_LETTERS: CarouselLetter[] = [
  {
    id: '1',
    nickname: '샤워젤과 소다수',
    message:
      '세상에서 가장 느린 산책로\n쓰러진 풍경을 사랑하는 게 우리의 재능이지\n\n네 손의 아이스크림과 내 손의 소다수는 맛이 달라도 우리는 같은 계절을 걷고 있어',
    song: {
      title: '한시 오분 (1:05)',
      artist: '검정치마',
      albumImage: ImgMockAlbum,
    },
  },
  {
    id: '2',
    nickname: '여름 복숭아',
    message:
      '오늘 하루, 잘 보내고 있나요?\n저는 평소와 똑같이 아침에 일어나 커피를 내렸어요. 무언가를 오래 좋아해본 적은 없지만 아침에 마시는 커피를 좋아해요. 산책도 다녀왔어요.',
  },
];

// 랜덤 질문
const question = LETTER_QUESTIONS[Math.floor(Math.random() * LETTER_QUESTIONS.length)];

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <h1 className={styles.titleText}>{question}</h1>

      <div className={styles.carouselWrapper}>
        <LetterCarousel letters={MOCK_LETTERS} />
      </div>

      <div className={styles.moreButtonWrapper}>
        <Button type="button" outlined>
          더 받기
        </Button>
      </div>
    </div>
  );
}
