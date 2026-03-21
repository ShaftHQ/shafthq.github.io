import React from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

interface ShaftRobotProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function ShaftRobot({
  size = 120,
  className = '',
  animated = true,
}: ShaftRobotProps): JSX.Element {
  return (
    <div
      className={`${styles.robotContainer} ${animated ? styles.animated : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="SHAFT Robot mascot"
    >
      <div className={styles.botShell}>
        <FontAwesomeIcon icon={faRobot} className={styles.botIcon} />
        <img
          src="/img/shaft_white.svg"
          alt=""
          aria-hidden="true"
          className={styles.chestLogo}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
