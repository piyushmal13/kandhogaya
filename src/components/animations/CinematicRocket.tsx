import React, { useEffect, useRef } from "react";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
// Using strict typed arrays for particles could be faster, but for this scale
// standard JS objects are fine and easier to manage the different types.

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; type: "flame" | "spark" | "smoke" | "star" | "meteor";
  depth?: number;
  color?: string;
}

export const CinematicRocket = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Performance: opaque canvas
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

    // Seed initial stars with varying intensities
    for (let i = 0; i < 250; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        life: Math.random() * 100, maxLife: 150 + Math.random() * 150,
        size: Math.random() * 1.2 + 0.2,
        type: "star",
        depth: Math.random() * 3 + 0.5
      });
    }

    const spawnMeteor = () => {
      const side = Math.random() > 0.5 ? -50 : W + 50;
      particles.push({
        x: side,
        y: Math.random() * H * 0.4,
        vx: (side < 0 ? 1 : -1) * (Math.random() * 8 + 4),
        vy: Math.random() * 4 + 2,
        life: 0, maxLife: 120,
        size: Math.random() * 3 + 2,
        type: "meteor"
      });
    };

    const spawnFlame = (count: number, cx: number, cy: number, phase: number) => {
      const spread = phase > 2 ? 28 : 20;
      const speedY = phase > 2 ? Math.random() * 7 + 4 : Math.random() * 5 + 2;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * spread,
          y: cy + Math.random() * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: speedY,
          life: 0, maxLife: phase > 2 ? 75 : 50,
          size: phase > 2 ? Math.random() * 22 + 10 : Math.random() * 16 + 8,
          type: "flame"
        });
      }
    };

    const spawnSpark = (count: number, cx: number, cy: number, phase: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.PI / 2 + (Math.random() - 0.5) * (phase > 2 ? 1.8 : 1.4);
        const speed = Math.random() * (phase > 2 ? 7 : 4) + 2;
        particles.push({
          x: cx + (Math.random() - 0.5) * 20,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 1,
          life: 0, maxLife: phase > 2 ? 55 : 40,
          size: Math.random() * 3 + 1,
          type: "spark"
        });
      }
    };

    const drawRocket = (ctx: CanvasRenderingContext2D, cx: number, cy: number, W: number, H: number, phase: number) => {
      const isMobile = W < 640;
      const rh = H * (isMobile ? 0.32 : 0.46);
      const ry = cy - rh;
      const rw = Math.max(isMobile ? 10 : 14, W * 0.028);

      // 1. Heat distortion / Aura
      if (phase >= 2) {
        ctx.save();
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, rw * 6);
        glow.addColorStop(0, "rgba(16, 185, 129, 0.15)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(cx - rw * 6, cy - rw * 6, rw * 12, rw * 12);
        ctx.restore();
      }

      // 2. Body Structure
      ctx.save();
      const bodyGrad = ctx.createLinearGradient(cx - rw, ry, cx + rw, ry);
      bodyGrad.addColorStop(0, "#08120f");
      bodyGrad.addColorStop(0.2, "#10b98122"); // Subtle rim light
      bodyGrad.addColorStop(0.4, "#0a251a");
      bodyGrad.addColorStop(0.5, "#0f3a28");
      bodyGrad.addColorStop(0.6, "#0a251a");
      bodyGrad.addColorStop(1, "#08120f");
      
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      // Nose
      ctx.moveTo(cx, ry);
      ctx.bezierCurveTo(cx - rw * 0.3, ry + rh * 0.1, cx - rw, ry + rh * 0.4, cx - rw, ry + rh * 0.8);
      // Fins / Base
      ctx.lineTo(cx - rw * 1.8, cy + 5);
      ctx.lineTo(cx + rw * 1.8, cy + 5);
      ctx.lineTo(cx + rw, ry + rh * 0.8);
      ctx.bezierCurveTo(cx + rw, ry + rh * 0.4, cx + rw * 0.3, ry + rh * 0.1, cx, ry);
      ctx.closePath();
      ctx.fill();

      // 3. Institutional Branding (Shield + Logo)
      const logoY = ry + rh * 0.45;
      const logoScale = rw * 0.7;
      
      // Draw Shield Outline
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, logoY - logoScale);
      ctx.lineTo(cx + logoScale * 0.8, logoY - logoScale * 0.5);
      ctx.lineTo(cx + logoScale * 0.8, logoY + logoScale * 0.5);
      ctx.quadraticCurveTo(cx, logoY + logoScale, cx - logoScale * 0.8, logoY + logoScale * 0.5);
      ctx.lineTo(cx - logoScale * 0.8, logoY - logoScale * 0.5);
      ctx.closePath();
      ctx.stroke();

      // Text Logo
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(10, rw * 0.8)}px 'Inter', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("IFX", cx, logoY + logoScale * 0.3);
      
      // 4. Engine Glow Reflecting on Body
      const engineGlow = ctx.createLinearGradient(0, cy - 20, 0, cy);
      engineGlow.addColorStop(0, "transparent");
      engineGlow.addColorStop(1, "rgba(16, 185, 129, 0.4)");
      ctx.fillStyle = engineGlow;
      ctx.beginPath();
      ctx.moveTo(cx - rw * 1.5, cy - 20);
      ctx.lineTo(cx + rw * 1.5, cy - 20);
      ctx.lineTo(cx + rw * 1.5, cy);
      ctx.lineTo(cx - rw * 1.5, cy);
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      frame++;
      let phase = 1;
      if (frame > 150) phase = 2;
      if (frame > 300) phase = 3;

      // 1. Background
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#010203");
      sky.addColorStop(0.5, "#020806");
      sky.addColorStop(1, phase === 3 ? "#051a12" : "#010203");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // 2. Dynamics
      const cx = W / 2;
      const baseCy = H * 0.65;
      const shake = phase === 3 ? Math.sin(frame * 0.8) * 3 : Math.sin(frame * 0.4) * 1.5;
      const lift = phase === 3 ? Math.min((frame - 300) * 0.5, H * 0.2) : 0;
      const rx = cx + (Math.random() - 0.5) * (phase * 1.2);
      const ry = baseCy - lift + (Math.random() - 0.5) * (phase * 1.2);

      // 3. Spawning
      if (phase === 1) {
        if (frame % 4 === 0) spawnFlame(2, rx, ry, 1);
        if (frame % 20 === 0) particles.push({ x: rx, y: ry, vx: 0, vy: 1.5, life: 0, maxLife: 100, size: 20, type: "smoke" });
      } else if (phase === 2) {
        if (frame % 2 === 0) spawnFlame(4, rx, ry, 2);
        if (frame % 5 === 0) spawnSpark(3, rx, ry, 2);
      } else if (phase === 3) {
        spawnFlame(6, rx, ry, 3);
        spawnSpark(6, rx, ry, 3);
        if (frame % 60 === 0) spawnMeteor();
      }

      // Star management
      let starSpeed = phase === 1 ? 0.15 : phase === 2 ? 0.6 : 3.5; // Adjusted Phase 3 speed to 3.5 (was 4.5)
      if (frame % (phase === 3 ? 10 : 30) === 0) {
        particles.push({
          x: Math.random() * W, y: -20, vx: 0, vy: 0,
          life: 0, maxLife: 200, size: Math.random() * 1.2 + 0.2,
          type: "star", depth: Math.random() * 3 + 0.5
        });
      }

      // 4. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife && p.type !== "star") {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === "star") {
          p.y += starSpeed * p.depth!;
          if (p.y > H) p.y = -10;
          const sAlpha = (0.3 + 0.7 * Math.sin(frame * 0.05 + p.x)) * (phase === 3 ? 1.2 : 1);
          ctx.fillStyle = `rgba(16, 185, 129, ${sAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (phase === 3) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${sAlpha * 0.15})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 20); ctx.stroke();
          }
        } else if (p.type === "meteor") {
          p.x += p.vx; p.y += p.vy;
          const mGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 10);
          mGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
          mGrad.addColorStop(0.2, "rgba(6, 182, 212, 0.4)");
          mGrad.addColorStop(1, "transparent");
          ctx.fillStyle = mGrad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 10, 0, Math.PI * 2); ctx.fill();
          // Tail
          ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
          ctx.lineWidth = p.size;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 15, p.y - p.vy * 15); ctx.stroke();
          if (p.x < -100 || p.x > W + 100) particles.splice(i, 1);
        } else if (p.type === "flame") {
          p.x += p.vx; p.y += p.vy; p.size *= 0.96;
          const fAlpha = (1 - p.life / p.maxLife) * 0.8;
          const fGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          fGrad.addColorStop(0, `rgba(255, 255, 255, ${fAlpha})`);
          fGrad.addColorStop(0.3, `rgba(16, 185, 129, ${fAlpha})`);
          fGrad.addColorStop(1, "transparent");
          ctx.fillStyle = fGrad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        } else if (p.type === "spark") {
          p.x += p.vx; p.y += p.vy;
          const sAlpha = 1 - p.life / p.maxLife;
          ctx.fillStyle = `rgba(255, 255, 200, ${sAlpha})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        } else if (p.type === "smoke") {
          p.y += p.vy; p.size += 0.5;
          const smAlpha = (1 - p.life / p.maxLife) * 0.15;
          ctx.fillStyle = `rgba(16, 185, 129, ${smAlpha})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
      }

      // 5. Rocket
      drawRocket(ctx, rx, ry, W, H, phase);

      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => setSize());
    ro.observe(canvas.parentElement || canvas);
    setSize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#010203]">
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
    </div>
  );
});

CinematicRocket.displayName = "CinematicRocket";
