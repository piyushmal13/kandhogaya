/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ANTI-GRAVITY LIQUIDITY MATRIX  ·  IFX Trades Institutional Hero
 * ─────────────────────────────────────────────────────────────────────────────
 * Engine: @react-three/fiber + Three.js
 * Design Vision: "Quiet Luxury" Quantitative Terminal (B2B, High-Trust)
 * Palette: Obsidian (#020305) + Electric Ice-Blue + Soft Purple + Diamond-Cyan
 *
 * Visuals:
 *   - 3D Candlestick Chart (Bullish = Ice-Blue, Bearish = Soft Purple)
 *   - Two glowing Moving Average trend curves (Cyan and Indigo)
 *   - Proximity Deflection: Mouse deflicts candles/curves upwards
 *   - Faint coordinate grid floor (opacity: 0.05)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── CONFIGURATION & CONSTANTS ────────────────────────────────────────────────
const NUM_CANDLES = 36;
const CANDLE_SPACING = 0.52;
const INTERACTION_RADIUS = 5.0;
const AG_FORCE = 2.2;
const LERP_SPEED = 0.14;
const DAMPING = 0.78;

// Colors
const COLOR_BULLISH = new THREE.Color('#00A3FF'); // Electric Ice-Blue
const COLOR_BEARISH = new THREE.Color('#8B5CF6'); // Soft Purple
const COLOR_CYAN    = new THREE.Color('#00E5FF'); // Diamond-Cyan
const COLOR_INDIGO  = new THREE.Color('#3B82F6'); // Indigo/Sapphire
const COLOR_NAVY    = new THREE.Color('#0A1628'); // Midnight Navy
const COLOR_GRID    = new THREE.Color('#00A3FF'); // Faint Grid

// Shared mouse coordinate Ndc & velocity
const mouseNDC = { x: 0, y: 0 };
const mouseVelocity = { x: 0, y: 0 };
const prevMouse = { x: 0, y: 0 };

// ── 3D CANDLESTICK CHART COMPONENT ───────────────────────────────────────────
function CandlestickChart() {
  const groupRef = useRef<THREE.Group>(null!);
  const clockRef = useRef(0);

  // Generate static price series dataset
  const candleData = useMemo(() => {
    const list = [];
    let price = -0.5;
    
    // Deterministic price walk for professional charting feel
    const priceWalk = [
      -0.8, -0.6, -0.3, -0.4, -0.1, 0.2, 0.1, 0.4, 0.8, 0.6, 
      0.9, 1.2, 1.0, 0.8, 1.1, 1.5, 1.3, 1.2, 1.4, 1.8, 
      2.2, 1.9, 1.7, 1.5, 1.8, 2.0, 1.8, 1.6, 1.9, 2.3, 
      2.6, 2.4, 2.7, 3.1, 2.8, 3.2
    ];

    const count = Math.min(NUM_CANDLES, priceWalk.length);
    const startX = -((count - 1) * CANDLE_SPACING) / 2;

    for (let i = 0; i < count; i++) {
      const open = price;
      const close = priceWalk[i];
      price = close;

      const bullish = close >= open;
      const bodyHeight = Math.max(0.08, Math.abs(close - open));
      const bodyY = (open + close) / 2;

      // Random wicks
      const high = Math.max(open, close) + 0.18 + (Math.sin(i * 1.7) * 0.08 + 0.08);
      const low  = Math.min(open, close) - 0.18 - (Math.cos(i * 2.3) * 0.08 + 0.08);

      list.push({
        id: `candle-${i}`,
        x: startX + i * CANDLE_SPACING,
        open,
        close,
        high,
        low,
        bodyHeight,
        bodyY,
        bullish,
      });
    }
    return list;
  }, []);

  // Set up dynamic deflection & height interpolation buffers
  const liveHeights = useMemo(() => new Float32Array(NUM_CANDLES), []);
  const velocities  = useMemo(() => new Float32Array(NUM_CANDLES), []);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    // Track mouse velocity
    mouseVelocity.x = mouseNDC.x - prevMouse.x;
    mouseVelocity.y = mouseNDC.y - prevMouse.y;
    prevMouse.x = mouseNDC.x;
    prevMouse.y = mouseNDC.y;
    const mSpeed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2) * 80;

    // Project mouse Z-plane intersection coordinates
    const mx3d = mouseNDC.x * (NUM_CANDLES * CANDLE_SPACING * 0.5);

    const group = groupRef.current;
    if (!group) return;

    // Update each candle child mesh individually
    candleData.forEach((candle, idx) => {
      const dx = candle.x - mx3d;
      const dist = Math.abs(dx);

      // 1. Core wave undulation
      const baseY = Math.sin(t * 0.65 + idx * 0.18) * 0.12;

      // 2. Proximity anti-gravity lift
      let agY = 0;
      if (dist < INTERACTION_RADIUS) {
        const falloff = 1 - (dist / INTERACTION_RADIUS);
        const smoothFalloff = falloff * falloff * (3 - 2 * falloff);
        agY = smoothFalloff * AG_FORCE * (1 + mSpeed * 0.12);
      }

      // Spring-mass dampening logic
      const targetY = baseY + agY;
      velocities[idx] += (targetY - liveHeights[idx]) * LERP_SPEED;
      velocities[idx] *= DAMPING;
      liveHeights[idx] += velocities[idx];

      const child = group.children[idx];
      if (child) {
        // Shift Y position of the candle group (body + wicks)
        child.position.y = liveHeights[idx];
      }
    });
  });

  return (
    <group ref={groupRef}>
      {candleData.map((candle, idx) => {
        const color = candle.bullish ? COLOR_BULLISH : COLOR_BEARISH;
        
        // Define wick geometry vertices (from low to high)
        const wickVertices = new Float32Array([
          0, candle.low, 0,
          0, candle.high, 0
        ]);

        return (
          <group key={candle.id} position={[candle.x, 0, 0]}>
            {/* ── The Wick (Line) ── */}
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  args={[wickVertices, 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                attach="material" 
                color={color} 
                linewidth={1} 
                transparent 
                opacity={0.6}
              />
            </line>

            {/* ── The Body (3D Box) ── */}
            <mesh position={[0, candle.bodyY, 0]}>
              <boxGeometry args={[0.26, candle.bodyHeight, 0.22]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={0.75}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── TREND LINES COMPONENT (MOVING AVERAGES) ──────────────────────────────────
function TrendLines() {
  const line1GeomRef = useRef<THREE.BufferGeometry>(null!);
  const line2GeomRef = useRef<THREE.BufferGeometry>(null!);
  const clockRef = useRef(0);

  // Pre-calculate line vertices path
  const { pathX, count } = useMemo(() => {
    const listX = [];
    const count = 60;
    const startX = -((NUM_CANDLES - 1) * CANDLE_SPACING) / 2;
    const endX = ((NUM_CANDLES - 1) * CANDLE_SPACING) / 2;
    const step = (endX - startX) / (count - 1);

    for (let i = 0; i < count; i++) {
      listX.push(startX + i * step);
    }
    return { pathX: listX, count };
  }, []);

  const line1Positions = useMemo(() => new Float32Array(count * 3), [count]);
  const line2Positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    const mx3d = mouseNDC.x * (NUM_CANDLES * CANDLE_SPACING * 0.5);

    const g1 = line1GeomRef.current;
    const g2 = line2GeomRef.current;
    if (!g1 || !g2) return;

    for (let i = 0; i < count; i++) {
      const bx = pathX[i];

      // Base moving average curves (composed harmonics)
      const base1Y = Math.sin(t * 0.5 + bx * 0.25) * 0.7 + (bx * 0.05) - 0.2;
      const base2Y = Math.cos(t * 0.35 + bx * 0.15) * 0.9 + (bx * 0.03) - 0.4;

      // Mouse deflection interaction
      const dist = Math.abs(bx - mx3d);
      let agY = 0;

      if (dist < INTERACTION_RADIUS) {
        const falloff = 1 - (dist / INTERACTION_RADIUS);
        const smoothFalloff = falloff * falloff * (3 - 2 * falloff);
        agY = smoothFalloff * AG_FORCE;
      }

      // Fast MA (Cyan)
      line1Positions[i * 3]     = bx;
      line1Positions[i * 3 + 1] = base1Y + agY;
      line1Positions[i * 3 + 2] = 0.2; // slightly forward

      // Slow MA (Indigo)
      line2Positions[i * 3]     = bx;
      line2Positions[i * 3 + 1] = base2Y + agY * 0.85; // slightly less deflection for inertia effect
      line2Positions[i * 3 + 2] = -0.2; // slightly backward
    }

    g1.setAttribute('position', new THREE.BufferAttribute(line1Positions, 3));
    g1.getAttribute('position').needsUpdate = true;

    g2.setAttribute('position', new THREE.BufferAttribute(line2Positions, 3));
    g2.getAttribute('position').needsUpdate = true;
  });

  return (
    <group>
      {/* Fast MA Line */}
      <line>
        <bufferGeometry ref={line1GeomRef} />
        <lineBasicMaterial 
          color={COLOR_CYAN} 
          linewidth={2} 
          transparent 
          opacity={0.65} 
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Slow MA Line */}
      <line>
        <bufferGeometry ref={line2GeomRef} />
        <lineBasicMaterial 
          color={COLOR_INDIGO} 
          linewidth={1.5} 
          transparent 
          opacity={0.45} 
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
}

// ── COORDINATE FLOOR GRID COMPONENT ──────────────────────────────────────────
function GridFloor() {
  const geomRef = useRef<THREE.BufferGeometry>(null!);
  const clockRef = useRef(0);

  const GRID_ROWS = 40;
  const GRID_COLS = 30;
  const GRID_SPACING = 0.55;

  const { segments, count } = useMemo(() => {
    const lines: number[] = [];
    const offX = ((GRID_ROWS - 1) * GRID_SPACING) / 2;
    const offZ = ((GRID_COLS - 1) * GRID_SPACING) / 2;

    // Horizontal Lines
    for (let zi = 0; zi < GRID_COLS; zi++) {
      for (let xi = 0; xi < GRID_ROWS - 1; xi++) {
        lines.push(xi * GRID_SPACING - offX, -3, zi * GRID_SPACING - offZ);
        lines.push((xi + 1) * GRID_SPACING - offX, -3, zi * GRID_SPACING - offZ);
      }
    }
    // Vertical Lines
    for (let xi = 0; xi < GRID_ROWS; xi++) {
      for (let zi = 0; zi < GRID_COLS - 1; zi++) {
        lines.push(xi * GRID_SPACING - offX, -3, zi * GRID_SPACING - offZ);
        lines.push(xi * GRID_SPACING - offX, -3, (zi + 1) * GRID_SPACING - offZ);
      }
    }

    return { segments: new Float32Array(lines), count: lines.length / 3 };
  }, []);

  const livePositions = useMemo(() => new Float32Array(segments), [segments]);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    const mx3d = mouseNDC.x * (GRID_ROWS * GRID_SPACING * 0.5);
    const mz3d = -mouseNDC.y * (GRID_COLS * GRID_SPACING * 0.5);

    const geom = geomRef.current;
    if (!geom) return;

    for (let i = 0; i < count; i++) {
      const bx = segments[i * 3];
      const bz = segments[i * 3 + 2];

      const baseY = -3 + Math.sin(t * 0.45 + bx * 0.2) * 0.05 * Math.cos(bz * 0.2);

      // Coordinate bend interaction
      const dx = bx - mx3d;
      const dz = bz - mz3d;
      const dist = Math.sqrt(dx * dx + dz * dz);

      let agY = 0;
      if (dist < INTERACTION_RADIUS * 1.5) {
        const falloff = 1 - (dist / (INTERACTION_RADIUS * 1.5));
        agY = falloff * 0.5; // subtle flex for depth
      }

      livePositions[i * 3]     = bx;
      livePositions[i * 3 + 1] = baseY + agY;
      livePositions[i * 3 + 2] = bz;
    }

    (geom.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[livePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={COLOR_GRID}
        transparent
        opacity={0.04} // Muted steel-blue opacity
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// ── CAMERA CONTROLLER WITH DRIFT & RESPONSIVE VIEWPORT ───────────────────────
function CameraController() {
  const { camera, size } = useThree();
  const t = useRef(0);

  // Dynamic Camera scaling on viewport resize
  useEffect(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    // Pull camera back on mobile viewports to prevent chart clipping
    const cameraZ = isMobile ? 18 : isTablet ? 15 : 12;
    const cameraY = isMobile ? 6 : isTablet ? 5 : 4;
    
    camera.position.set(0, cameraY, cameraZ);
    camera.lookAt(0, -0.5, 0);
  }, [camera, size]);

  useFrame((_, delta) => {
    t.current += delta * 0.045;
    const isMobile = size.width < 768;
    const zOffset = isMobile ? 18 : 12;

    camera.position.x = Math.sin(t.current) * 0.5;
    camera.position.z = zOffset + Math.cos(t.current * 0.5) * 0.4;
    camera.lookAt(0, -0.5, 0);
  });

  return null;
}

// ── MAIN MATRIX COMPONENT ────────────────────────────────────────────────────
interface AntiGravityMatrixProps {
  className?: string;
}

export const AntiGravityMatrix: React.FC<AntiGravityMatrixProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onLeave = () => {
      mouseNDC.x = 0;
      mouseNDC.y = 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ background: '#020305' }} // Pitch black background
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: 55, near: 0.1, far: 100, position: [0, 4, 12] }}
        performance={{ min: 0.6 }}
      >
        <color attach="background" args={['#020305']} />
        <fog attach="fog" args={['#020305', 12, 30]} />
        <CameraController />
        <GridFloor />
        <TrendLines />
        <CandlestickChart />
      </Canvas>

      {/* Subtle luxury vignette mapping */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse 75% 65% at 50% 45%, transparent 0%, rgba(2,3,5,0.5) 60%, rgba(2,3,5,0.95) 100%),
            linear-gradient(to bottom, rgba(2,3,5,0.45) 0%, transparent 22%, transparent 72%, rgba(2,3,5,1) 100%)
          `,
        }}
        aria-hidden
      />
    </div>
  );
};
