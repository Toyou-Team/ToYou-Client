import { memo } from 'react';

import {
  IcDottedLine,
  IcGreyCircle,
  IcPreviousStep,
  IcSolidLine,
  IcStep1,
  IcStep2,
  IcStep3,
  IcStep4,
} from '@/assets/icons';

import * as styles from './stepIcon.css';

interface StepIconProps {
  step: 1 | 2 | 3 | 4 | 5;
}

const TOTAL_STEPS = 4;

const currentStepIcons = {
  1: IcStep1,
  2: IcStep2,
  3: IcStep3,
  4: IcStep4,
} as const;

export function StepIcon({ step }: StepIconProps) {
  return (
    <div className={styles.stepIconContainer}>
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const currentStep = index + 1;
        const isLastStep = currentStep === TOTAL_STEPS;
        const isCurrentStep = currentStep === step;
        const isPreviousStep = currentStep < step;
        const isCompleted = step === 5 || isPreviousStep;

        const Icon = isCompleted ? IcPreviousStep : isCurrentStep ? currentStepIcons[step] : IcGreyCircle;

        const LineIcon = isCompleted ? IcSolidLine : IcDottedLine;

        return (
          <div key={currentStep} className={styles.stepItem}>
            <div className={styles.stepIconWrapper}>
              <Icon
                aria-hidden
                className={styles.stepIcon({
                  isCurrentStep: isCurrentStep && step !== 5,
                })}
              />
            </div>

            {!isLastStep && <LineIcon aria-hidden className={styles.stepLine} />}
          </div>
        );
      })}
    </div>
  );
}

export const MemoizedStepIcon = memo(StepIcon);
