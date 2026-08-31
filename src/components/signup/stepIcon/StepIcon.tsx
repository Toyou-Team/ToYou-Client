import { memo } from 'react';

import { IcGreyCircle, IcPreviousStep, IcStep1, IcStep2, IcStep3, IcDottedLine, IcSolidLine } from '@/assets/icons';

import * as styles from './stepIcon.css';

interface StepIconProps {
  step: 1 | 2 | 3;
}

const TOTAL_STEPS = 3;

const currentStepIcons = {
  1: IcStep1,
  2: IcStep2,
  3: IcStep3,
} as const;

export function StepIcon({ step }: StepIconProps) {
  return (
    <div className={styles.stepIconContainer}>
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const currentStep = index + 1;
        const isLastStep = currentStep === TOTAL_STEPS;
        const isCurrentStep = currentStep === step;
        const isPreviousStep = currentStep < step;

        const Icon = isPreviousStep ? IcPreviousStep : isCurrentStep ? currentStepIcons[step] : IcGreyCircle;

        const LineIcon = isPreviousStep ? IcSolidLine : IcDottedLine;

        return (
          <div key={currentStep} className={styles.stepItem}>
            <div className={styles.stepIconWrapper}>
              <Icon aria-hidden className={styles.stepIcon({ isCurrentStep })} />
            </div>

            {!isLastStep && <LineIcon aria-hidden className={styles.stepLine} />}
          </div>
        );
      })}
    </div>
  );
}

export const MemoizedStepIcon = memo(StepIcon);
