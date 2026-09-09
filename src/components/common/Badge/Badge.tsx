import * as styles from './badge.css';

interface BadgeProps {
  count: number;
}

function Badge({ count }: BadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>초코</span>
    </div>
  );
}

export default Badge;
