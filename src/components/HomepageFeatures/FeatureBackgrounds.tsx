import React from 'react';

/**
 * SVG background illustrations for each homepage feature.
 * These render as subtle, large watermark-style visuals behind feature cards.
 */

export function RoiBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Upward trending chart with coins */}
      <line x1="20" y1="170" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="20" y1="170" x2="180" y2="170" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <polyline
        points="30,150 60,130 90,110 120,80 150,50 175,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="130" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="90" cy="110" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="120" cy="80" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="150" cy="50" r="4" fill="currentColor" opacity="0.1" />
      {/* Arrow tip */}
      <polygon points="175,30 165,40 170,35" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

export function AllInOneBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Connected hub-and-spoke diagram */}
      <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1" />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.08" />
      {/* Spokes */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 70 * Math.cos(rad);
        const y = 100 + 70 * Math.sin(rad);
        return (
          <g key={i}>
            <line x1="100" y1="100" x2={x} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <circle cx={x} cy={y} r="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
            <circle cx={x} cy={y} r="4" fill="currentColor" opacity="0.08" />
          </g>
        );
      })}
    </svg>
  );
}

export function WizardBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Code brackets with sparkles */}
      <text x="30" y="120" fontSize="80" fontFamily="monospace" fill="currentColor" opacity="0.08">{'{'}</text>
      <text x="130" y="120" fontSize="80" fontFamily="monospace" fill="currentColor" opacity="0.08">{'}'}</text>
      {/* Sparkles */}
      {[
        [80, 50], [120, 40], [100, 70], [70, 150], [130, 155], [150, 80],
      ].map(([cx, cy], i) => (
        <g key={i} opacity="0.1">
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="currentColor" strokeWidth="1.5" />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="currentColor" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

export function TrophyBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Star constellation */}
      {[
        [100, 40], [60, 80], [140, 80], [75, 140], [125, 140],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="currentColor" opacity="0.08" />
      ))}
      {/* Connection lines forming a star */}
      <polygon
        points="100,40 125,140 60,80 140,80 75,140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
      />
      {/* Outer glow ring */}
      <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.06" strokeDasharray="8 4" />
    </svg>
  );
}

export function GlobeBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Globe with grid lines */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.08" />
      <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <ellipse cx="100" cy="100" rx="30" ry="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      {/* Network dots */}
      {[
        [70, 65], [130, 65], [60, 100], [140, 100], [80, 135], [120, 135],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.1" />
      ))}
    </svg>
  );
}

export function FutureProofBackground(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shield with circuit pattern */}
      <path
        d="M100 30 L155 60 L155 120 Q155 160 100 180 Q45 160 45 120 L45 60 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.08"
      />
      {/* Circuit lines inside shield */}
      <line x1="70" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <line x1="100" y1="60" x2="100" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <line x1="75" y1="110" x2="125" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      {/* Circuit nodes */}
      {[
        [100, 80], [100, 110], [75, 110], [125, 110], [100, 60], [100, 150],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.1" />
      ))}
    </svg>
  );
}
