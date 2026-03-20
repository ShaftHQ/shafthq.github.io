import React from 'react';
import styles from './styles.module.css';

interface ShaftRobotProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * SHAFT Robot mascot — a friendly AI-themed robot character
 * that represents the SHAFT automation engine.
 * Uses pure CSS/SVG for lightweight rendering.
 */
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
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Antenna */}
        <line
          x1="100" y1="30" x2="100" y2="10"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="100" cy="8" r="5"
          fill="var(--robot-accent, #0060a8)"
          className={animated ? styles.antennaPulse : ''}
        />

        {/* Head */}
        <rect
          x="55" y="30" width="90" height="65" rx="18" ry="18"
          fill="var(--robot-head, #e8f4fd)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2.5"
        />

        {/* Eyes */}
        <circle
          cx="80" cy="58" r="10"
          fill="var(--robot-accent, #0060a8)"
          className={animated ? styles.eyeBlink : ''}
        />
        <circle
          cx="120" cy="58" r="10"
          fill="var(--robot-accent, #0060a8)"
          className={animated ? styles.eyeBlink : ''}
        />
        {/* Eye highlights */}
        <circle cx="76" cy="54" r="3" fill="white" opacity="0.8" />
        <circle cx="116" cy="54" r="3" fill="white" opacity="0.8" />

        {/* Mouth - friendly smile */}
        <path
          d="M 80 75 Q 100 88 120 75"
          fill="none"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect
          x="90" y="95" width="20" height="12" rx="3"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="1.5"
        />

        {/* Body */}
        <rect
          x="50" y="107" width="100" height="60" rx="14" ry="14"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2.5"
        />

        {/* SHAFT logo on body */}
        <text
          x="100" y="143"
          textAnchor="middle"
          fill="var(--robot-accent, #0060a8)"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
        >
          SHAFT
        </text>

        {/* Chest light */}
        <circle
          cx="100" cy="122" r="5"
          fill="var(--robot-glow, #25c2a0)"
          className={animated ? styles.chestGlow : ''}
        />

        {/* Arms */}
        <rect
          x="25" y="112" width="22" height="40" rx="10"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2"
          className={animated ? styles.armWave : ''}
        />
        <rect
          x="153" y="112" width="22" height="40" rx="10"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2"
        />

        {/* Legs */}
        <rect
          x="65" y="167" width="24" height="25" rx="8"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2"
        />
        <rect
          x="111" y="167" width="24" height="25" rx="8"
          fill="var(--robot-body, #d1e8f8)"
          stroke="var(--robot-accent, #0060a8)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
