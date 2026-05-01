import React, { useEffect, useRef } from "react";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
// Using strict typed arrays for particles could be faster, but for this scale
// standard JS objects are fine and easier to manage the different types.

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; type: "flame" | "spark" | "smoke" | "star";
  depth?: number; // for star parallax
}

export const CinematicRocket = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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

    const particles: Particle[] = [];
    let frame = 0;

    // Seed initial stars
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        life: Math.random(), maxLife: 80 + Math.random() * 120,
        size: Math.random() * 1.5 + 0.3,
        type: "star",
        depth: Math.random() * 3 + 1 // 1 (far) to 4 (near)
      });
    }

    const spawnFlame = (count: number, cx: number, cy: number, phase: number) => {
      const spread = phase > 2 ? 24 : 18;
      const speedY = phase > 2 ? Math.random() * 6 + 3 : Math.random() * 4.5 + 1.5;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * spread,
          y: cy + Math.random() * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: speedY,
          life: 1, maxLife: phase > 2 ? 65 : 45,
          size: phase > 2 ? Math.random() * 18 + 8 : Math.random() * 14 + 6,
          type: "flame"
        });
      }
    };

    const spawnSpark = (count: number, cx: number, cy: number, phase: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.PI / 2 + (Math.random() - 0.5) * (phase > 2 ? 1.6 : 1.2);
        const speed = Math.random() * (phase > 2 ? 5.5 : 3.5) + 1;
        particles.push({
          x: cx + (Math.random() - 0.5) * 16,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 1,
          life: 1, maxLife: phase > 2 ? 45 : 35,
          size: Math.random() * 2.5 + 0.8,
          type: "spark"
        });
      }
    };

    const spawnSmoke = (count: number, cx: number, cy: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + Math.random() * 30 + 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 2 + 0.5,
          life: 1, maxLife: 100 + Math.random() * 60,
          size: Math.random() * 50 + 20,
          type: "smoke"
        });
      }
    };

    const spawnStarAtTop = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: -10,
          vx: 0, vy: 0,
          life: 0, maxLife: 80 + Math.random() * 120,
          size: Math.random() * 1.5 + 0.3,
          type: "star",
          depth: Math.random() * 3 + 1
        });
      }
    };

    const spawnParticle = (type: Particle["type"], count: number, cx: number, cy: number, phase: number) => {
      switch (type) {
        case "flame": spawnFlame(count, cx, cy, phase); break;
        case "spark": spawnSpark(count, cx, cy, phase); break;
        case "smoke": spawnSmoke(count, cx, cy); break;
        case "star": spawnStarAtTop(count); break;
      }
    };

    const drawBackground = (ctx: CanvasRenderingContext2D, W: number, H: number, phase: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0,    "#020408");
      sky.addColorStop(0.4,  "#050a12");
      sky.addColorStop(0.7,  "#0a1a14");
      sky.addColorStop(1,    phase > 1 ? "#102a1d" : "#081210");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Launch pad / horizon glow
      const cx = W / 2;
      const hGlow = ctx.createRadialGradient(cx, H * 0.75, 0, cx, H * 0.75, W * 0.8);
      let intensity = 0.5;
      if (phase === 1) intensity = 0.25;
      else if (phase === 2) intensity = 0.4;

      hGlow.addColorStop(0,   `rgba(16, 185, 129, ${intensity})`);
      hGlow.addColorStop(0.3, `rgba(16, 185, 129, ${intensity * 0.4})`);
      hGlow.addColorStop(0.6, `rgba(16, 185, 129, ${intensity * 0.1})`);
      hGlow.addColorStop(1,   "transparent");
      ctx.fillStyle = hGlow;
      ctx.fillRect(0, 0, W, H);

      // Add dynamic lens flare pulses in Phase 3
      if (phase === 3 && frame % 40 < 10) {
        ctx.fillStyle = "rgba(100, 255, 200, 0.03)";
        ctx.beginPath();
        ctx.arc(cx, H * 0.5, W * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawRocket = (ctx: CanvasRenderingContext2D, cx: number, cy: number, W: number, H: number) => {
      const isMobile = W < 640;
      const rh = H * (isMobile ? 0.3 : 0.44); // shorter on mobile
      const ry = cy - rh;
      const rw = Math.max(isMobile ? 8 : 12, W * 0.025);

      // 1. Heat Haze / Distortion layer (Phase 2/3)
      if (frame > 150) {
        ctx.save();
        ctx.filter = "blur(8px)";
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.beginPath();
        ctx.arc(cx, cy + 20, rw * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Main Body
      ctx.save();
      ctx.shadowBlur = isMobile ? 15 : 40;
      ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
      
      const bodyGrad = ctx.createLinearGradient(cx - rw, ry, cx + rw, ry);
      bodyGrad.addColorStop(0,   "#050a08");
      bodyGrad.addColorStop(0.3, "#0f2d1f");
      bodyGrad.addColorStop(0.5, "#1a4d35");
      bodyGrad.addColorStop(0.7, "#0f2d1f");
      bodyGrad.addColorStop(1,   "#050a08");
      
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(cx, ry); // Nose
      ctx.bezierCurveTo(cx - rw * 0.2, ry + rh * 0.1, cx - rw, ry + rh * 0.3, cx - rw, ry + rh * 0.75);
      ctx.lineTo(cx - rw * 1.5, cy); // Flared base
      ctx.lineTo(cx + rw * 1.5, cy);
      ctx.lineTo(cx + rw, ry + rh * 0.75);
      ctx.bezierCurveTo(cx + rw, ry + rh * 0.3, cx + rw * 0.2, ry + rh * 0.1, cx, ry);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Details (Pipes/Fins)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - rw * 0.8, ry + rh * 0.4);
      ctx.lineTo(cx - rw * 0.8, ry + rh * 0.8);
      ctx.moveTo(cx + rw * 0.8, ry + rh * 0.4);
      ctx.lineTo(cx + rw * 0.8, ry + rh * 0.8);
      ctx.stroke();

      // 4. Windows / Bridge
      const winY = ry + rh * 0.28;
      const winSize = rw * 0.65;
      const winGrad = ctx.createRadialGradient(cx, winY, 0, cx, winY, winSize);
      winGrad.addColorStop(0,   "#d1fae5");
      winGrad.addColorStop(0.5, "#10b981");
      winGrad.addColorStop(1,   "transparent");
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.arc(cx, winY, winSize, 0, Math.PI * 2);
      ctx.fill();

      // 5. Lettering
      ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
      ctx.font = `black ${Math.max(8, rw * 0.7)}px 'Inter', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("IFX", cx, winY + rh * 0.22);
    };

    const getShakeOffsets = (phase: number, frame: number, H: number) => {
      let shakeX = 0;
      let shakeY = 0;
      let liftY = 0;

      if (phase === 1) {
        shakeX = (Math.random() - 0.5) * 1.5;
        shakeY = (Math.random() - 0.5) * 1.5;
      } else if (phase === 2) {
        shakeX = (Math.random() - 0.5) * 3;
        shakeY = (Math.random() - 0.5) * 3;
      } else if (phase === 3) {
        shakeX = (Math.random() - 0.5) * 4;
        shakeY = (Math.random() - 0.5) * 4;
        const liftProgress = Math.min((frame - 300) / 200, 1);
        liftY = -liftProgress * H * 0.15;
      }
      return { shakeX, shakeY, liftY };
    };

    const updateStars = (ctx: CanvasRenderingContext2D, H: number, starSpeedBase: number, phase: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type !== "star") continue;
        
        p.y += starSpeedBase * (p.depth || 1);
        if (p.y > H) {
          particles.splice(i, 1);
        } else {
          drawParticle(ctx, p, phase, starSpeedBase);
        }
      }
    };

    const updatePhysicsParticles = (ctx: CanvasRenderingContext2D, phase: number, starSpeedBase: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type === "star") continue;

        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        const sizeInc = phase === 3 ? 0.4 : 0.25;
        if (p.type === "flame" || p.type === "smoke") {
          p.size += sizeInc;
        }

        drawParticle(ctx, p, phase, starSpeedBase);
      }
    };

    const updateAndDrawParticles = (ctx: CanvasRenderingContext2D, W: number, H: number, phase: number, starSpeedBase: number) => {
      updateStars(ctx, H, starSpeedBase, phase);
      updatePhysicsParticles(ctx, phase, starSpeedBase);
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle, phase: number, starSpeedBase: number) => {
      const t = p.life / p.maxLife;
      const alpha = p.type === "star"
        ? 0.4 + 0.6 * Math.sin(p.life * 0.08 + p.x)
        : 1 - Math.pow(t, 0.6);

      if (p.type === "flame") {
        drawFlameParticle(ctx, p, t, alpha, phase);
      } else if (p.type === "spark") {
        drawSparkParticle(ctx, p, t, alpha, phase);
      } else if (p.type === "smoke") {
        drawSmokeParticle(ctx, p, p.size, alpha);
      } else if (p.type === "star") {
        drawStarParticle(ctx, p, alpha, phase, starSpeedBase);
      }
    };

    const drawFlameParticle = (ctx: CanvasRenderingContext2D, p: Particle, t: number, alpha: number, phase: number) => {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      const brightness = 1 - t * 0.8;
      const flameAlpha = phase === 3 ? 0.5 : 0.3;
      grad.addColorStop(0,   `rgba(255, 255, ${Math.floor(220 * brightness)}, ${alpha * 0.95})`);
      grad.addColorStop(0.3, `rgba(255, ${Math.floor(200 * brightness)}, 60, ${alpha * 0.7})`);
      grad.addColorStop(0.6, `rgba(16, 185, 129, ${alpha * flameAlpha})`);
      grad.addColorStop(1,   "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSparkParticle = (ctx: CanvasRenderingContext2D, p: Particle, t: number, alpha: number, phase: number) => {
      ctx.fillStyle = `rgba(255, ${Math.floor(180 + 75 * (1 - t))}, 40, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 200, 60, ${alpha * 0.4})`;
      ctx.lineWidth = p.size * 0.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      const streakLen = phase === 3 ? 10 : 6;
      ctx.lineTo(p.x - p.vx * streakLen, p.y - p.vy * streakLen);
      ctx.stroke();
    };

    const drawSmokeParticle = (ctx: CanvasRenderingContext2D, p: Particle, size: number, alpha: number) => {
      const sGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
      sGrad.addColorStop(0,   `rgba(40, 50, 45, ${alpha * 0.25})`);
      sGrad.addColorStop(0.5, `rgba(20, 30, 25, ${alpha * 0.1})`);
      sGrad.addColorStop(1,   "transparent");
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStarParticle = (ctx: CanvasRenderingContext2D, p: Particle, alpha: number, phase: number, starSpeedBase: number) => {
      ctx.fillStyle = `rgba(200, 235, 220, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (phase === 3 ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
      if (phase === 3) {
        ctx.strokeStyle = `rgba(200, 235, 220, ${alpha * 0.3})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - starSpeedBase * (p.depth || 1) * 3);
        ctx.stroke();
      }
    };

    const spawnPhase1 = (frame: number, rx: number, ry: number, phase: number) => {
      if (frame % 3 === 0) spawnParticle("flame", 2, rx, ry, phase);
      if (frame % 20 === 0) spawnParticle("smoke", 1, rx, ry, phase);
    };

    const spawnPhase2 = (frame: number, rx: number, ry: number, phase: number) => {
      if (frame % 2 === 0) spawnParticle("flame", 4, rx, ry, phase);
      if (frame % 4 === 0) spawnParticle("spark", 2, rx, ry, phase);
      if (frame % 12 === 0) spawnParticle("smoke", 2, rx, ry, phase);
    };

    const spawnPhase3 = (frame: number, rx: number, ry: number, phase: number) => {
      spawnParticle("flame", 6, rx, ry, phase);
      if (frame % 2 === 0) spawnParticle("spark", 4, rx, ry, phase);
      if (frame % 6 === 0) spawnParticle("smoke", 3, rx, ry, phase);
    };

    const spawnParticlesForPhase = (phase: number, frame: number, rocketX: number, rocketY: number) => {
      if (phase === 1) spawnPhase1(frame, rocketX, rocketY, phase);
      else if (phase === 2) spawnPhase2(frame, rocketX, rocketY, phase);
      else spawnPhase3(frame, rocketX, rocketY, phase);
    };

    const draw = () => {
      frame++;
      let phase = 1;
      if (frame > 150) phase = 2;
      if (frame > 300) phase = 3;

      ctx.clearRect(0, 0, W, H);
      drawBackground(ctx, W, H, phase);

      const cx = W / 2;
      const baseCy = H * 0.62;
      const { shakeX, shakeY, liftY } = getShakeOffsets(phase, frame, H);

      const rocketX = cx + shakeX;
      const rocketY = baseCy + shakeY + liftY;

      spawnParticlesForPhase(phase, frame, rocketX, rocketY);

      let starSpeedBase = 4.5;
      if (phase === 1) starSpeedBase = 0.2;
      else if (phase === 2) starSpeedBase = 0.8;

      if (frame % (phase === 3 ? 4 : 20) === 0) spawnParticle("star", phase === 3 ? 4 : 2, 0, 0, phase);

      updateAndDrawParticles(ctx, W, H, phase, starSpeedBase);
      drawRocket(ctx, rocketX, rocketY, W, H);

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
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      role="img" 
      aria-label="Institutional Rocket Launch Animation"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full"
        style={{ willChange: "transform" }}
      />
    </div>
  );
});

CinematicRocket.displayName = "CinematicRocket";
