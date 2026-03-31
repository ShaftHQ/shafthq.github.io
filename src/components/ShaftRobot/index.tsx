import React from 'react';
import styles from './styles.module.css';

interface ShaftRobotProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function ShaftRobot({
  size = 120,
  className = '',
  animated = false,
}: ShaftRobotProps): JSX.Element {
  return (
    <div
      className={`${styles.robotContainer} ${animated ? styles.animated : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="AutoBot mascot"
    >
      <div className={styles.botShell}>
        <img
          src="/img/autobot-avatar.svg"
          alt="AutoBot"
          className={styles.botIcon}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
