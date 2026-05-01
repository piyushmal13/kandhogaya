import React, { useEffect, useRef } from 'react';

/** 
 * InstitutionalBackground — Quantitative Command Center Layer
 * Mouse-reactive particle network. All rendering: canvas compositor.
 * NO layout thrash. NO reflows. Pure requestAnimationFrame.
 */
export const InstitutionalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = globalThis.innerWidth;
    let height = globalThis.innerHeight;

    // Mouse tracking — reactive to cursor position
    const mouse = { x: width / 2, y: height / 2 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const particleCount = Math.min(Math.floor(width / 14), 70);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      isGold: boolean;
    }

    const createParticle = (): Particle => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.5,
        isGold: Math.random() < 0.08,
      };
    };

    const updateParticle = (p: Particle) => {
      // Subtle mouse repulsion — responds to cursor, max 80px radius
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 80 && dist > 0) {
        const force = (80 - dist) / 80;
        p.vx += (dx / dist) * force * 0.4;
        p.vy += (dy / dist) * force * 0.4;
      }

      // Velocity damping — precision drift, not bounce
      p.vx *= 0.97;
      p.vy *= 0.97;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap instead of bounce — seamless
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    };

    const drawParticle = (p: Particle) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isGold
        ? 'rgba(212, 175, 55, 0.6)' // --brand-secondary gold
        : 'rgba(16, 185, 129, 0.25)'; // --brand-primary emerald
      ctx.fill();
    };

    const particles: Particle[] = [];

    const init = () => {
      width = globalThis.innerWidth;
      height = globalThis.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Institutional grid — 60px cell, ultra-low opacity
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.028)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Mouse crosshair — Command Center reticle
      const cx = mouse.x;
      const cy = mouse.y;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)'; // gold
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 8]);
      ctx.beginPath(); ctx.moveTo(cx - 40, cy); ctx.lineTo(cx + 40, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 40); ctx.stroke();
      ctx.setLineDash([]);
      // Crosshair dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.fill();

      // Particles
      particles.forEach(p => { updateParticle(p); drawParticle(p); });

      // Connections — emerald network lines
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            const alpha = 0.12 * (1 - dist / 130);
            // Gold-to-gold connections glow gold
            const bothGold = particles[i].isGold && particles[j].isGold;
            ctx.strokeStyle = bothGold
              ? `rgba(212, 175, 55, ${alpha * 1.5})`
              : `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    globalThis.addEventListener('mousemove', onMouseMove, { passive: true });
    globalThis.addEventListener('resize', init);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      globalThis.removeEventListener('mousemove', onMouseMove);
      globalThis.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
};
