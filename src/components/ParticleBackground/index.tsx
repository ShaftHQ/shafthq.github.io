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
  particles: Particle[];
  connections: ConnectionLine[];
}

interface ParticleWorkerCommand {
  type: 'init' | 'resize' | 'tick';
  width?: number;
  height?: number;
  particleCount?: number;
  connectionDistance?: number;
  reducedMotion?: boolean;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
}

/**
 * Lightweight canvas-based particle network animation.
 * Renders subtle floating nodes with connection lines to create
 * a neural-network / AI-themed background effect.
 */
export default function ParticleBackground({
  particleCount = 40,
  connectionDistance = 120,
  className = '',
}: ParticleBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const particlesRef = useRef<Particle[]>([]);

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

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (supportsWorker && workerRef.current) {
        const resizeMessage: ParticleWorkerCommand = {
          type: 'resize',
          width: canvas.width,
          height: canvas.height,
        };
        workerRef.current.postMessage(resizeMessage);
      } else if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (supportsWorker) {
      workerRef.current = new Worker(new URL('./particleWorker.ts', import.meta.url), {
        type: 'module',
      });

      workerRef.current.onmessage = (event: MessageEvent<ParticleWorkerFrame>) => {
        if (event.data.type !== 'frame') return;
        drawFrame(ctx, canvas, event.data.particles, event.data.connections);
        if (!prefersReducedMotion && workerRef.current) {
          animationRef.current = requestAnimationFrame(() => {
            workerRef.current?.postMessage({ type: 'tick' } as ParticleWorkerCommand);
          });
        }
      };

      const initMessage: ParticleWorkerCommand = {
        type: 'init',
        width: canvas.width,
        height: canvas.height,
        particleCount,
        connectionDistance,
        reducedMotion: prefersReducedMotion,
      };
      workerRef.current.postMessage(initMessage);
    } else {
      const animate = () => {
        if (!ctx || !canvas) return;
        const particles = particlesRef.current;
        const connections: ConnectionLine[] = [];

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
      cancelAnimationFrame(animationRef.current);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [initParticles, connectionDistance, drawFrame, particleCount]);

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
