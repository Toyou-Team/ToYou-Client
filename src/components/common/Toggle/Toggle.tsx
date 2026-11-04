import type { ComponentProps } from 'react';

import * as styles from './toggle.css';

export function Toggle(props: Omit<ComponentProps<'input'>, 'type' | 'role' | 'className'>) {
  return (
    <span className={styles.wrapper}>
      <input {...props} type="checkbox" role="switch" className={styles.input} />
      <span className={styles.track} />
    </span>
  );
}
