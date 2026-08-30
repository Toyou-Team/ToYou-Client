import { MemoizedStepIcon } from '@/components/signup/stepIcon/StepIcon';
import * as styles from './terms.css';
import { TermsForm } from '@/components/signup/terms/TermsForm/TermsForm';

export default function SignUpTermsPage() {
  return (
    <div className={styles.termsPageWrapper}>
      <MemoizedStepIcon step={4} />
      <h1 className={styles.titleWrapper}>
        투유 이용을 위해 <br />
        약관 동의가 필요해요.
      </h1>
      <TermsForm />
    </div>
  );
}
