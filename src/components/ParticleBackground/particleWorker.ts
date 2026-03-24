interface WorkerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  particles: Array<{
    x: number;
    y: number;
    radius: number;
    opacity: number;
  }>;
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

let width = 0;
let height = 0;
let particleCount = 40;
let connectionDistance = 120;
let reducedMotion = false;
let workerId = 0;
let particles: WorkerParticle[] = [];
let pointerX = 0;
let pointerY = 0;
let pointerActive = false;
let motionScale = 1;
const MIN_VELOCITY = 0.12;
const BASE_MAX_VELOCITY = 0.65;
const MIN_MOTION_SCALE = 0.25;
const MAX_MOTION_SCALE = 1;

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 1.2,
      opacity: Math.random() * 0.45 + 0.25,
    });
  }
}

function stepParticles() {
  if (reducedMotion) return;
  for (const p of particles) {
    if (pointerActive) {
      const dx = pointerX - p.x;
      const dy = pointerY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < connectionDistance * 0.9 && distance > 0) {
        const force = (1 - distance / (connectionDistance * 0.9)) * 0.012;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;
      }
    }

    const jitterStrength = 0.008 * motionScale;
    const maxVelocity = Math.max(MIN_VELOCITY, BASE_MAX_VELOCITY * motionScale);

    p.vx += (Math.random() - 0.5) * jitterStrength;
    p.vy += (Math.random() - 0.5) * jitterStrength;
    p.vx = Math.max(-maxVelocity, Math.min(maxVelocity, p.vx * 0.995));
    p.vy = Math.max(-maxVelocity, Math.min(maxVelocity, p.vy * 0.995));

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }
}

function buildConnections(): ConnectionLine[] {
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
          opacity: (1 - dist / connectionDistance) * 0.3,
        });
      }
    }
  }
  return connections;
}

function postFrame() {
  const frame: ParticleWorkerFrame = {
    type: 'frame',
    workerId,
    particles: particles.map(({ x, y, radius, opacity }) => {
      const dx = pointerX - x;
      const dy = pointerY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const reactiveBoost =
        pointerActive && distance < connectionDistance
          ? (1 - distance / connectionDistance) * 0.35
          : 0;
      return {
        x,
        y,
        radius: radius + reactiveBoost,
        opacity: Math.min(0.75, opacity + reactiveBoost * 0.45),
      };
    }),
    connections: buildConnections(),
  };
  self.postMessage(frame);
}

self.onmessage = (event: MessageEvent<unknown>) => {
  const data = event.data as Partial<ParticleWorkerCommand> | null | undefined;

  if (
    !data ||
    typeof data !== 'object' ||
    (data as { type?: unknown }).type === undefined
  ) {
    // Ignore messages that do not conform to the expected command shape
    return;
  }

  const type = (data as { type: unknown }).type;
  if (type !== 'init' && type !== 'resize' && type !== 'tick') {
    // Ignore unknown command types
    return;
  }

  if (type === 'init') {
    if (typeof data.width === 'number') {
      width = data.width;
    }
    if (typeof data.height === 'number') {
      height = data.height;
    }
    if (typeof data.particleCount === 'number') {
      particleCount = data.particleCount;
    }
    if (typeof data.connectionDistance === 'number') {
      connectionDistance = data.connectionDistance;
    }
    if (typeof data.reducedMotion === 'boolean') {
      reducedMotion = data.reducedMotion;
    }
    if (typeof data.motionScale === 'number') {
      motionScale = Math.max(MIN_MOTION_SCALE, Math.min(MAX_MOTION_SCALE, data.motionScale));
    }
    if (typeof data.workerId === 'number') {
      workerId = data.workerId;
    }
    initParticles();
    postFrame();
    return;
  }

  if (type === 'resize') {
    if (typeof data.width === 'number') {
      width = data.width;
    }
    if (typeof data.height === 'number') {
      height = data.height;
    }
    return;
  }

  if (type === 'tick') {
    if (typeof data.pointerX === 'number') {
      pointerX = data.pointerX;
    }
    if (typeof data.pointerY === 'number') {
      pointerY = data.pointerY;
    }
    if (typeof data.pointerActive === 'boolean') {
      pointerActive = data.pointerActive;
    }
    stepParticles();
    postFrame();
  }
};
