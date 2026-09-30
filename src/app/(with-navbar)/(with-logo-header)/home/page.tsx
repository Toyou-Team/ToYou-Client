import { DeliverySection } from '@/components/home/DeliverySection/DeliverySection';

import * as styles from './home.css';

const LETTER_QUESTIONS = ['오늘,\n어떤 마음이었어?', '오늘 하루는\n어땠어?', '오늘\n가장 기억에 남는 순간은?'];

// 랜덤 질문
const question = LETTER_QUESTIONS[Math.floor(Math.random() * LETTER_QUESTIONS.length)];

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <h1 className={styles.titleText}>{question}</h1>
      <DeliverySection />
    </div>
  );
}
