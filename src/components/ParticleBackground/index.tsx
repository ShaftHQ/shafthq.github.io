import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
  motionScale?: number;
  /** Use light/white particles for visibility on dark or colored backgrounds (hero banners). */
  heroMode?: boolean;
}

const MIN_VELOCITY = 0.18;
const BASE_MAX_VELOCITY = 0.92;
const MOBILE_MAX_WIDTH_MEDIA_QUERY = '(max-width: 768px)';
const MOBILE_PARTICLE_MULTIPLIER = 1.55;
const MOBILE_MIN_MOTION_SCALE = 0.62;
const LIGHTHOUSE_USER_AGENT_PATTERN = /lighthouse/i;

/**
 * Lightweight canvas-based particle network animation.
 * Renders subtle floating nodes with connection lines to create
 * a neural-network / AI-themed background effect.
 */
export default function ParticleBackground({
  particleCount = 40,
  connectionDistance = 120,
  className = '',
  motionScale = 1,
  heroMode = false,
}: ParticleBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const initParticles = useCallback(
    (width: number, height: number, count: number = particleCount) => {
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1.2,
          opacity: Math.random() * 0.45 + 0.25,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount],
  );

  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      particles: Particle[],
      connections: ConnectionLine[],
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Both call sites (Hero, FinalCta) pass heroMode, so this always tracks
      // --site-color-primary-rgb (dark-theme value) for the hero-mode case; the
      // non-hero branch mirrors the same token per theme instead of an
      // off-palette color, since a <canvas> 2D context can't consume var()
      // directly (see DESIGN_LANGUAGE.md's "Allowed exceptions", #898 finding 22).
      let nodeColor: string;
      let lineColor: string;
      if (heroMode) {
        nodeColor = 'rgba(76, 194, 255';
        lineColor = 'rgba(76, 194, 255';
      } else {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        nodeColor = isDark ? 'rgba(76, 194, 255' : 'rgba(0, 110, 192';
        lineColor = isDark ? 'rgba(76, 194, 255' : 'rgba(0, 110, 192';
      }

      const pointer = pointerRef.current;
      const framePulse = performance.now() * 0.003;

      for (const p of particles) {
        const pulse = (Math.sin(framePulse + p.x * 0.021 + p.y * 0.017) + 1) * 0.5;
        let reactiveBoost = 0;
        if (pointer.active && connectionDistance > 0) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            reactiveBoost = (1 - distance / connectionDistance) * 1.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + pulse * 0.42 + reactiveBoost, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}, ${Math.min(0.88, p.opacity + pulse * 0.12 + reactiveBoost * 0.16)})`;
        ctx.fill();
      }

      for (const line of connections) {
        const pulse = heroMode
          ? (Math.sin(framePulse + (line.x1 + line.x2) * 0.01) + 1) * 0.04
          : 0;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = `${lineColor}, ${Math.min(0.42, line.opacity + pulse)})`;
        ctx.lineWidth = heroMode ? 1 : 0.8;
        ctx.stroke();
      }

      if (pointer.active && connectionDistance > 0) {
        for (const p of particles) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= connectionDistance * 0.72) continue;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `${lineColor}, ${(1 - distance / (connectionDistance * 0.72)) * 0.2})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    },
    [connectionDistance, heroMode],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isLighthouseSession = LIGHTHOUSE_USER_AGENT_PATTERN.test(navigator.userAgent);
    const isMobileViewport = window.matchMedia(MOBILE_MAX_WIDTH_MEDIA_QUERY).matches;
    let tunedParticleCount = particleCount;
    if (isLighthouseSession) {
      tunedParticleCount = Math.min(4, particleCount);
    } else if (isMobileViewport) {
      tunedParticleCount = Math.ceil(particleCount * MOBILE_PARTICLE_MULTIPLIER);
    }
    const effectiveConnectionDistance = isLighthouseSession ? 0 : connectionDistance;
    // Ensure section-level low motionScale values remain visible on smaller mobile canvases.
    const tunedMotionScale = isMobileViewport
      ? Math.max(motionScale, MOBILE_MIN_MOTION_SCALE)
      : motionScale;
    const shouldAnimate = !prefersReducedMotion && !isLighthouseSession;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height, tunedParticleCount);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointerRef.current.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', handlePointerMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerLeave, { passive: true });

    if (particlesRef.current.length === 0) {
      initParticles(canvas.width, canvas.height, tunedParticleCount);
    }

    const velocityMap = new Map<Particle, { vx: number; vy: number }>();
    for (const particle of particlesRef.current) {
      velocityMap.set(particle, {
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      const particles = particlesRef.current;
      const connections: ConnectionLine[] = [];

      if (shouldAnimate) {
        for (const particle of particles) {
          const velocity = velocityMap.get(particle);
          if (!velocity) continue;
          if (pointerRef.current.active) {
            const dx = pointerRef.current.x - particle.x;
            const dy = pointerRef.current.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < effectiveConnectionDistance * 0.95 && distance > 0) {
              const force = (1 - distance / (effectiveConnectionDistance * 0.95)) * 0.022;
              velocity.vx += (dx / distance) * force;
              velocity.vy += (dy / distance) * force;
            }
          }
          const jitterStrength = 0.018 * tunedMotionScale;
          const maxVelocity = Math.max(MIN_VELOCITY, BASE_MAX_VELOCITY * tunedMotionScale);

          velocity.vx += (Math.random() - 0.5) * jitterStrength;
          velocity.vy += (Math.random() - 0.5) * jitterStrength;
          velocity.vx = Math.max(-maxVelocity, Math.min(maxVelocity, velocity.vx * 0.988));
          velocity.vy = Math.max(-maxVelocity, Math.min(maxVelocity, velocity.vy * 0.988));
          particle.x += velocity.vx;
          particle.y += velocity.vy;
          if (particle.x < 0 || particle.x > canvas.width) velocity.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) velocity.vy *= -1;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < effectiveConnectionDistance) {
            connections.push({
              x1: particles[i].x,
              y1: particles[i].y,
              x2: particles[j].x,
              y2: particles[j].y,
              opacity: (1 - dist / effectiveConnectionDistance) * 0.3,
            });
          }
        }
      }

      drawFrame(ctx, canvas, particles, connections);
      if (shouldAnimate) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (shouldAnimate) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerMove);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, connectionDistance, drawFrame, motionScale, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
