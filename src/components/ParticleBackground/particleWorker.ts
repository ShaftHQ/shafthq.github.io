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
}

let width = 0;
let height = 0;
let particleCount = 40;
let connectionDistance = 120;
let reducedMotion = false;
let workerId = 0;
let particles: WorkerParticle[] = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
}

function stepParticles() {
  if (reducedMotion) return;
  for (const p of particles) {
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
          opacity: (1 - dist / connectionDistance) * 0.15,
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
    particles: particles.map(({ x, y, radius, opacity }) => ({
      x,
      y,
      radius,
      opacity,
    })),
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
    stepParticles();
    postFrame();
  }
};
