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

interface ParticleWorkerFrame {
  type: 'frame';
  workerId: number;
  particles: Particle[];
  connections: ConnectionLine[];
}

interface ParticleWorkerCommand {
  type: 'init' | 'resize' | 'tick';
  workerId?: number;
  width?: number;
  height?: number;
  particleCount?: number;
  connectionDistance?: number;
  reducedMotion?: boolean;
  pointerX?: number;
  pointerY?: number;
  pointerActive?: boolean;
  motionScale?: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
  motionScale?: number;
}

const MIN_VELOCITY = 0.12;
const BASE_MAX_VELOCITY = 0.65;

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
}: ParticleBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const workersRef = useRef<Worker[]>([]);
  const useWorkerRef = useRef<boolean>(false);
  const workerFramesRef = useRef<Array<ParticleWorkerFrame | null>>([]);
  const expectedWorkersRef = useRef<number>(1);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.1,
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
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nodeColor = isDark ? 'rgba(37, 194, 160' : 'rgba(0, 110, 192';
      const lineColor = isDark ? 'rgba(37, 194, 160' : 'rgba(0, 110, 192';

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}, ${p.opacity})`;
        ctx.fill();
      }

      for (const line of connections) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = `${lineColor}, ${line.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const supportsWorker = typeof Worker !== 'undefined';
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const workerCount = !prefersReducedMotion && hardwareConcurrency >= 4 ? 2 : 1;
    useWorkerRef.current = supportsWorker;
    expectedWorkersRef.current = workerCount;
    workerFramesRef.current = Array.from({ length: workerCount }, () => null);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (useWorkerRef.current && workersRef.current.length > 0) {
        for (const worker of workersRef.current) {
          const resizeMessage: ParticleWorkerCommand = {
            type: 'resize',
            width: canvas.width,
            height: canvas.height,
          };
          worker.postMessage(resizeMessage);
        }
      } else if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
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
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerLeave, { passive: true });

    if (supportsWorker) {
      try {
        const baseCount = Math.floor(particleCount / workerCount);
        const remainder = particleCount % workerCount;

        for (let workerId = 0; workerId < workerCount; workerId++) {
          const worker = new Worker(new URL('./particleWorker.ts', import.meta.url), {
            type: 'module',
          });

          worker.onmessage = (event: MessageEvent<ParticleWorkerFrame>) => {
            if (event.data.type !== 'frame') return;
            workerFramesRef.current[event.data.workerId] = event.data;

            if (workerFramesRef.current.some((frame) => frame === null)) {
              return;
            }

            const mergedParticles: Particle[] = [];
            const mergedConnections: ConnectionLine[] = [];
            for (let i = 0; i < expectedWorkersRef.current; i++) {
              const frame = workerFramesRef.current[i];
              if (!frame) return;
              mergedParticles.push(...frame.particles);
              mergedConnections.push(...frame.connections);
              workerFramesRef.current[i] = null;
            }

            drawFrame(ctx, canvas, mergedParticles, mergedConnections);
            if (!prefersReducedMotion) {
                animationRef.current = requestAnimationFrame(() => {
                  for (const workerEntry of workersRef.current) {
                    workerEntry.postMessage({
                      type: 'tick',
                      pointerX: pointerRef.current.x,
                      pointerY: pointerRef.current.y,
                      pointerActive: pointerRef.current.active,
                    } as ParticleWorkerCommand);
                  }
                });
              }
            };

          const partitionCount = baseCount + (workerId < remainder ? 1 : 0);
          const reinitMessage: ParticleWorkerCommand = {
            type: 'init',
            workerId,
            width: canvas.width,
            height: canvas.height,
            particleCount: partitionCount,
            connectionDistance,
            reducedMotion: prefersReducedMotion,
            motionScale,
          };
          worker.postMessage(reinitMessage);
          workersRef.current.push(worker);
        }
      } catch (error) {
        console.warn(
          'Failed to initialize particle workers, falling back to main-thread rendering.',
          error,
        );
        useWorkerRef.current = false;
        for (const worker of workersRef.current) {
          worker.terminate();
        }
        workersRef.current = [];
      }
    }

    if (!useWorkerRef.current) {
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
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

        if (!prefersReducedMotion) {
          for (const particle of particles) {
            const velocity = velocityMap.get(particle);
            if (!velocity) continue;
            if (pointerRef.current.active) {
              const dx = pointerRef.current.x - particle.x;
              const dy = pointerRef.current.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < connectionDistance * 0.9 && distance > 0) {
                const force = (1 - distance / (connectionDistance * 0.9)) * 0.012;
                velocity.vx += (dx / distance) * force;
                velocity.vy += (dy / distance) * force;
              }
            }
            const jitterStrength = 0.008 * motionScale;
            const maxVelocity = Math.max(MIN_VELOCITY, BASE_MAX_VELOCITY * motionScale);

            velocity.vx += (Math.random() - 0.5) * jitterStrength;
            velocity.vy += (Math.random() - 0.5) * jitterStrength;
            velocity.vx = Math.max(-maxVelocity, Math.min(maxVelocity, velocity.vx * 0.995));
            velocity.vy = Math.max(-maxVelocity, Math.min(maxVelocity, velocity.vy * 0.995));
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
            if (dist < connectionDistance) {
              connections.push({
                x1: particles[i].x,
                y1: particles[i].y,
                x2: particles[j].x,
                y2: particles[j].y,
                opacity: (1 - dist / connectionDistance) * 0.15,
              });
            }
          }
        }

        drawFrame(ctx, canvas, particles, connections);
        if (!prefersReducedMotion) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerLeave);
      cancelAnimationFrame(animationRef.current);
      for (const worker of workersRef.current) {
        worker.terminate();
      }
      workersRef.current = [];
      workerFramesRef.current = [];
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
