import React, { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const updateEyeOffset = () => {
    setEyeOffset((previous) => ({
      x: previous.x + (targetOffsetRef.current.x - previous.x) * 0.35,
      y: previous.y + (targetOffsetRef.current.y - previous.y) * 0.35,
    }));
    animationFrameRef.current = 0;
  };

  const queueEyeUpdate = () => {
    if (animationFrameRef.current) return;
    animationFrameRef.current = requestAnimationFrame(updateEyeOffset);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = event.clientX - (bounds.left + bounds.width / 2);
    const relativeY = event.clientY - (bounds.top + bounds.height / 2);
    const maxDistanceX = bounds.width * 0.32;
    const maxDistanceY = bounds.height * 0.32;
    const clampedX = Math.max(-1, Math.min(1, relativeX / maxDistanceX));
    const clampedY = Math.max(-1, Math.min(1, relativeY / maxDistanceY));

    targetOffsetRef.current = {
      x: clampedX * 2.6,
      y: clampedY * 2.2,
    };
    queueEyeUpdate();
  };

  const handlePointerLeave = () => {
    targetOffsetRef.current = { x: 0, y: 0 };
    queueEyeUpdate();
  };

  const robotStyle = {
    width: size,
    height: size,
    '--eye-offset-x': `${eyeOffset.x}px`,
    '--eye-offset-y': `${eyeOffset.y}px`,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`${styles.robotContainer} ${animated ? styles.animated : ''} ${className}`}
      style={robotStyle}
      role="img"
      aria-label="SHAFT Robot mascot with SHAFT logo"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.botShell}>
        <span className={styles.waveArm} aria-hidden="true" />
        <FontAwesomeIcon icon={faRobot} className={styles.botIcon} />
        <div className={styles.eyeRow} aria-hidden="true">
          <span className={styles.eye}><span className={styles.pupil} /></span>
          <span className={styles.eye}><span className={styles.pupil} /></span>
        </div>
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
