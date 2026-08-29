import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import * as styles from './nickname.css';

import NicknameForm from '@/components/signup/nickname/nicknameForm/NicknameForm';

export default function SignUpNicknamePage() {
  return (
    <>
      <div className={styles.nicknamePageWrapper}>
        <MemoizedStepIcon step={1} />
        <h1 className={styles.titleWrapper}>닉네임을 적어주세요.</h1>
      </div>
      <NicknameForm />
    </>
  );
}
