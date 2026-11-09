import { TrackEvent } from '@/components/analytics/TrackEvent/TrackEvent';
import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import * as styles from './target-gender.css';
import GenderSelectForm from '@/components/signup/target-gender/GenderSelectForm';

export default function SignUpTargetgenderPage() {
  return (
    <>
      <div className={styles.targetgenderPageWrapper}>
        <TrackEvent event="onboarding_step_view" step_name="target_gender" step_index={2} />
        <MemoizedStepIcon step={2} />
        <h1 className={styles.titleWrapper}>
          내가 보낸 편지를 <br />
          받을 사람의 성별을 선택해주세요.
        </h1>
      </div>
      <GenderSelectForm options={['남성', '여성', '모두']} nextPath="/signup/profile-image" />
    </>
  );
}
