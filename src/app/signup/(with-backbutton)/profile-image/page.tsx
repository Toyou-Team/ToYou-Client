import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import * as styles from './profile-image.css';
import ImageUpload from '@/components/signup/profile-image/ImageUpload/ImageUpload';

export default function SignUpProfileImagePage() {
  return (
    <>
      <div className={styles.profileImagePageWrapper}>
        <MemoizedStepIcon step={4} />
        <h1 className={styles.titleWrapper}>프로필 사진을 설정해주세요.</h1>
      </div>

      <ImageUpload />
    </>
  );
}
