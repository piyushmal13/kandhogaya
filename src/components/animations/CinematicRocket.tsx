import React, { useEffect, useRef } from "react";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; 
  type: "flame" | "spark" | "smoke" | "star" | "meteor" | "nebula";
  depth?: number;
  color?: string;
  shape?: "dot" | "plus" | "diamond";
}

/**
 * CinematicRocket — Institutional Departure Layer
 * Optimized for high-fidelity terminal backgrounds.
 * Features varied astronomical shapes and refined engine physics.
 */
export const CinematicRocket = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };

    let particles: Particle[] = [];
    let frame = 0;

    // Seed initial starfield with high-fidelity variation
    const seedStars = () => {
      particles = particles.filter(p => p.type !== "star");
      // PERF: Reduced star count from 180 to 120 for cleaner look
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0, vy: 0,
          life: Math.random() * 100, maxLife: 150 + Math.random() * 150,
          size: Math.random() * 1.2 + 0.1, // Slightly smaller
          type: "star",
          shape: Math.random() > 0.9 ? (Math.random() > 0.5 ? "plus" : "diamond") : "dot",
          depth: Math.random() * 2.5 + 0.5,
          color: Math.random() > 0.9 ? "rgba(88, 242, 182, 0.3)" : "rgba(255, 255, 255, 0.4)"
        });
      }
    };

    const spawnMeteor = () => {
      const side = Math.random() > 0.5 ? -50 : W + 50;
      particles.push({
        x: side,
        y: Math.random() * H * 0.4,
        vx: (side < 0 ? 1 : -1) * (Math.random() * 6 + 3),
        vy: Math.random() * 3 + 1,
        life: 0, maxLife: 120,
        size: Math.random() * 1.5 + 0.5,
        type: "meteor"
      });
    };

    const spawnFlame = (count: number, cx: number, cy: number, phase: number) => {
      const spread = phase > 2 ? 20 : 14;
      const speedY = phase > 2 ? Math.random() * 6 + 4 : Math.random() * 4 + 2;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * spread,
          y: cy + Math.random() * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: speedY,
          life: 0, maxLife: phase > 2 ? 70 : 50,
          size: phase > 2 ? Math.random() * 20 + 10 : Math.random() * 15 + 8,
          type: "flame"
        });
      }
    };

    const drawStar = (ctx: CanvasRenderingContext2D, p: Particle, frame: number, phase: number, starSpeed: number) => {
      p.y += starSpeed * p.depth!;
      if (p.y > H) p.y = -10;
      
      // PERF: Softer twinkle (less aggressive amplitude)
      const twinkle = (0.6 + 0.4 * Math.sin(frame * 0.03 + p.x * 0.1));
      const opacity = twinkle * (phase === 3 ? 0.6 : 0.35);
      
      ctx.fillStyle = p.color || `rgba(255, 255, 255, ${opacity})`;
      
      if (p.shape === "plus" && p.size > 0.8) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 1.5, p.y);
        ctx.lineTo(p.x + p.size * 1.5, p.y);
        ctx.moveTo(p.x, p.y - p.size * 1.5);
        ctx.lineTo(p.x, p.y + p.size * 1.5);
        ctx.stroke();
      } else if (p.shape === "diamond") {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size * 1.2);
        ctx.lineTo(p.x + p.size * 1.2, p.y);
        ctx.lineTo(p.x, p.y + p.size * 1.2);
        ctx.lineTo(p.x - p.size * 1.2, p.y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (phase === 3 && p.depth! > 1.8) {
        // Warp speed streaks (more subtle)
        ctx.strokeStyle = `rgba(88, 242, 182, ${twinkle * 0.08})`;
        ctx.lineWidth = p.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - 10 * p.depth!);
        ctx.stroke();
      }
    };

    const drawRocket = (ctx: CanvasRenderingContext2D, cx: number, cy: number, W: number, H: number, phase: number) => {
      const isMobile = W < 640;
      const rh = H * (isMobile ? 0.35 : 0.48);
      const ry = cy - rh;
      const rw = Math.max(isMobile ? 12 : 18, W * 0.025);

      // 1. Engine Resonance & Atmosphere
      if (phase >= 2) {
        ctx.save();
        const resonance = Math.sin(Date.now() * 0.01) * 2;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, rw * 6);
        glow.addColorStop(0, "rgba(16, 185, 129, 0.12)");
        glow.addColorStop(0.5, "rgba(6, 182, 212, 0.04)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, rw * 6 + resonance, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Technical Body (Schematic Style)
      ctx.save();
      
      // Outer Glow/Rim Light
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(16, 185, 129, 0.3)";
      
      // Main Hull - Blueprint Gradient
      const hullGrad = ctx.createLinearGradient(cx - rw, ry, cx + rw, ry);
      hullGrad.addColorStop(0, "#010203");
      hullGrad.addColorStop(0.5, "#080c12");
      hullGrad.addColorStop(1, "#010203");
      
      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      // Rocket Silhouette (More aerodynamic and technical)
      ctx.moveTo(cx, ry); // Tip
      ctx.bezierCurveTo(cx - rw * 0.4, ry + rh * 0.15, cx - rw * 1.2, ry + rh * 0.4, cx - rw, ry + rh * 0.9);
      
      // Left Fin (Engineered look)
      ctx.lineTo(cx - rw * 1.8, cy + 5);
      ctx.lineTo(cx - rw * 0.8, cy + 2);
      ctx.lineTo(cx + rw * 0.8, cy + 2);
      
      // Right Fin
      ctx.lineTo(cx + rw * 1.8, cy + 5);
      ctx.lineTo(cx + rw, ry + rh * 0.9);
      
      ctx.bezierCurveTo(cx + rw * 1.2, ry + rh * 0.4, cx + rw * 0.4, ry + rh * 0.15, cx, ry);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Technical Detail Lines (Schematic Overlay)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      // Vertical central axis
      ctx.moveTo(cx, ry);
      ctx.lineTo(cx, cy);
      // Horizontal structural ribs
      for(let i = 1; i < 6; i++) {
        const yPos = ry + (rh * 0.15 * i);
        const wAtY = rw * (1 - (i/10));
        ctx.moveTo(cx - wAtY, yPos);
        ctx.lineTo(cx + wAtY, yPos);
      }
      ctx.stroke();

      // Branding: IFX TERMINAL
      const ly = ry + rh * 0.55;
      const ls = rw * 0.4;
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `black ${ls}px Outfit, sans-serif`;
      ctx.textAlign = "center";
      ctx.letterSpacing = "0.2em";
      ctx.fillText("IFX-T", cx, ly);
      
      // Sub-label
      ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
      ctx.font = `600 ${ls * 0.5}px monospace`;
      ctx.fillText("STRAT-01", cx, ly + ls * 1.2);

      ctx.restore();
    };

    const draw = () => {
      frame++;
      let phase = 1;
      if (frame > 250) phase = 2; // Delayed phase 2
      if (frame > 500) phase = 3; // Delayed phase 3

      // 1. Unified Dark Sky
      ctx.fillStyle = "#010203";
      ctx.fillRect(0, 0, W, H);

      // 2. Dynamics logic
      const cx = W / 2;
      const baseCy = H * 0.62;
      const lift = phase === 3 ? Math.min((frame - 500) * 0.5, H * 0.2) : 0;
      const rx = cx + (Math.sin(frame * 0.02) * (phase * 2)); // Smooth sway
      const ry = baseCy - lift + (Math.cos(frame * 0.02) * (phase * 2));

      // 3. Spawning
      if (frame % (phase === 3 ? 1 : phase === 2 ? 2 : 4) === 0) {
        spawnFlame(phase === 3 ? 4 : 2, rx, ry, phase);
      }
      if (phase === 3 && frame % 45 === 0) spawnMeteor();

      const starSpeed = phase === 1 ? 0.05 : phase === 2 ? 0.3 : 3.2;

      // 4. Bloom Pass (Subtle glow)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(8px)";
      // Render particles again at low opacity for bloom
      for (let i = 0; i < Math.min(particles.length, 50); i++) {
        const p = particles[i];
        if (p.type === "flame") {
          ctx.fillStyle = "rgba(88, 242, 182, 0.05)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

      // 5. Update & Render
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === "star") {
          drawStar(ctx, p, frame, phase, starSpeed);
          continue;
        }

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === "flame") {
          p.x += p.vx; p.y += p.vy; p.size *= 0.95;
          const alpha = (1 - p.life / p.maxLife) * 0.6;
          const fGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          fGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          fGrad.addColorStop(0.3, `rgba(88, 242, 182, ${alpha * 0.8})`);
          fGrad.addColorStop(1, "transparent");
          ctx.fillStyle = fGrad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        } else if (p.type === "meteor") {
          p.x += p.vx; p.y += p.vy;
          const mAlpha = (1 - p.life / p.maxLife) * 0.4;
          ctx.fillStyle = `rgba(6, 182, 212, ${mAlpha})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2); ctx.fill();
          
          // Tail
          ctx.strokeStyle = `rgba(6, 182, 212, ${mAlpha * 0.2})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
          ctx.stroke();

          if (p.x < -100 || p.x > W + 100) particles.splice(i, 1);
        }
      }

      drawRocket(ctx, rx, ry, W, H, phase);
      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      setSize();
      seedStars();
    });
    ro.observe(canvas.parentElement || canvas);
    setSize();
    seedStars();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#010203]">
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
    </div>
  );
});

CinematicRocket.displayName = "CinematicRocket";
