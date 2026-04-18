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
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse tracking — reactive to cursor position
    const mouse = { x: width / 2, y: height / 2 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const particleCount = Math.min(Math.floor(width / 14), 70);

    class Particle {
      x: number;
      y: number;
      ox: number; // origin x
      oy: number; // origin y
      vx: number;
      vy: number;
      size: number;
      isGold: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.ox = this.x;
        this.oy = this.y;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.5 + 0.5;
        // 8% of particles glow gold — institutional gold accents
        this.isGold = Math.random() < 0.08;
      }

      update() {
        // Subtle mouse repulsion — responds to cursor, max 80px radius
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          this.vx += (dx / dist) * force * 0.4;
          this.vy += (dy / dist) * force * 0.4;
        }

        // Velocity damping — precision drift, not bounce
        this.vx *= 0.97;
        this.vy *= 0.97;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap instead of bounce — seamless
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.isGold
          ? 'rgba(212, 175, 55, 0.6)' // --brand-secondary gold
          : 'rgba(16, 185, 129, 0.25)'; // --brand-primary emerald
        ctx.fill();
      }
    }

    const particles: Particle[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
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
      particles.forEach(p => { p.update(); p.draw(); });

      // Connections — emerald network lines
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
};
