import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import * as styles from './my-gender.css';
import GenderSelectForm from '@/components/signup/my-gender/GenderSelectForm';

export default function SignUpMygenderPage() {
  return (
    <>
      <div className={styles.mygenderPageWrapper}>
        <MemoizedStepIcon step={2} />
        <h1 className={styles.titleWrapper}>성별을 선택해주세요.</h1>
      </div>
      <GenderSelectForm
        options={['남성', '여성']}
        description="성별은 선택 후 변경이 불가능합니다."
        nextPath="/signup/target-gender"
      />
    </>
  );
}
