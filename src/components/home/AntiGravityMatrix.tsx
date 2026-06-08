/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ANTI-GRAVITY LIQUIDITY MATRIX  ·  IFX Trades Institutional Hero
 * ─────────────────────────────────────────────────────────────────────────────
 * Engine: @react-three/fiber + @react-three/drei + Three.js
 * Design Vision: "Quiet Luxury" Quantitative Terminal (B2B, High-Trust)
 * Palette: Obsidian (#020305) + Electric Ice-Blue + Soft Purple + Diamond-Cyan
 *
 * WebGL Specifications:
 *   - Glass Candlesticks: physical refraction using <meshPhysicalMaterial>
 *     (transmission: 0.9, thickness: 0.8, roughness: 0.03, clearcoat: 1.0)
 *   - Cursor PointLight: Dual-light tracking system (direct + lagging trail)
 *   - Real-time Scrolling Queue: Infinite scroll feed tracing live market walk
 *   - Sync Moving Averages: Two lines perfectly bound to candle coordinates
 *   - Subtle Coordinate Grid Floor (4% opacity)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ── CONFIGURATION & CONSTANTS ────────────────────────────────────────────────
const NUM_CANDLES = 36;
const CANDLE_SPACING = 0.52;
const INTERACTION_RADIUS = 5.0;
const AG_FORCE = 1.2; // Subtler anti-gravity for non-cartoonish physics
const LERP_SPEED = 0.16;
const DAMPING = 0.76;
const SCROLL_SPEED = 0.2; // Slowed down from 0.85 to avoid "roller coaster" effect

// Color Palette
const COLOR_BULLISH     = new THREE.Color('#00A3FF'); // Electric Ice-Blue
const COLOR_BEARISH     = new THREE.Color('#8B5CF6'); // Soft Purple
const COLOR_CYAN        = new THREE.Color('#00E5FF'); // Diamond-Cyan
const COLOR_INDIGO      = new THREE.Color('#3B82F6'); // Indigo/Sapphire
const COLOR_GRID        = new THREE.Color('#00A3FF'); // Muted Steel Blue Grid

// Mouse coordinate NDC & velocity tracking
const mouseNDC = { x: 0, y: 0 };
const mouseVelocity = { x: 0, y: 0 };
const prevMouse = { x: 0, y: 0 };

interface CandleData {
  id: string;
  open: number;
  close: number;
  high: number;
  low: number;
  bullish: boolean;
  bodyHeight: number;
  bodyY: number;
  y: number;  // dynamic deflection height
  vy: number; // spring velocity
}

// ── TREND LINES COMPONENT (MOVING AVERAGES) ──────────────────────────────────
function TrendLines({ candles, scrollAccum }: { candles: CandleData[], scrollAccum: React.MutableRefObject<number> }) {
  const line1GeomRef = useRef<THREE.BufferGeometry>(null!);
  const line2GeomRef = useRef<THREE.BufferGeometry>(null!);

  const line1Positions = useMemo(() => new Float32Array(NUM_CANDLES * 3), []);
  const line2Positions = useMemo(() => new Float32Array(NUM_CANDLES * 3), []);

  useFrame(() => {
    const g1 = line1GeomRef.current;
    const g2 = line2GeomRef.current;
    if (!g1 || !g2) return;

    const startX = -((NUM_CANDLES - 1) * CANDLE_SPACING) / 2;
    const scrollOffset = -scrollAccum.current;

    for (let i = 0; i < NUM_CANDLES; i++) {
      const candle = candles[i];
      if (!candle) continue;

      const bx = startX + i * CANDLE_SPACING + scrollOffset;

      // Ensure lines strictly follow the candles to avoid detaching
      let fastY = candle.y + candle.bodyY;
      let slowY = candle.y + candle.bodyY;

      // Simple smoothing over previous candles
      if (i > 0) {
        fastY = (candles[i].y + candles[i].bodyY + candles[i - 1].y + candles[i - 1].bodyY) / 2;
        if (i > 1) {
          slowY = (candles[i].y + candles[i].bodyY + candles[i - 1].y + candles[i - 1].bodyY + candles[i - 2].y + candles[i - 2].bodyY) / 3;
        }
      }

      // Fast MA (Cyan)
      line1Positions[i * 3]     = bx;
      line1Positions[i * 3 + 1] = fastY - 0.25; 
      line1Positions[i * 3 + 2] = 0.15; 

      // Slow MA (Indigo)
      line2Positions[i * 3]     = bx;
      line2Positions[i * 3 + 1] = slowY + 0.3; 
      line2Positions[i * 3 + 2] = -0.15; 
    }

    g1.setAttribute('position', new THREE.BufferAttribute(line1Positions, 3));
    g1.getAttribute('position').needsUpdate = true;

    g2.setAttribute('position', new THREE.BufferAttribute(line2Positions, 3));
    g2.getAttribute('position').needsUpdate = true;
  });

  return (
    <group>
      <line>
        <bufferGeometry ref={line1GeomRef} />
        <lineBasicMaterial
          color={COLOR_CYAN}
          linewidth={2}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </line>
      <line>
        <bufferGeometry ref={line2GeomRef} />
        <lineBasicMaterial
          color={COLOR_INDIGO}
          linewidth={1.5}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
}

// ── 3D PHYSICAL GLASS CANDLESTICK CHART COMPONENT ───────────────────────────
function CandlestickChart() {
  const groupRef = useRef<THREE.Group>(null!);
  const clockRef = useRef(0);
  const scrollAccum = useRef(0);
  const lastPrice = useRef(0.0);

  // Helper to create candle data structure
  const createCandle = (index: number, open: number, close: number): CandleData => {
    const bullish = close >= open;
    const bodyHeight = Math.max(0.12, Math.abs(close - open));
    const bodyY = (open + close) / 2;
    const high = Math.max(open, close) + 0.18 + (Math.sin(index * 1.5) * 0.06 + 0.06);
    const low = Math.min(open, close) - 0.18 - (Math.cos(index * 2.1) * 0.06 + 0.06);

    return {
      id: `candle-${index}-${Math.random()}`,
      open,
      close,
      high,
      low,
      bullish,
      bodyHeight,
      bodyY,
      y: 0,
      vy: 0
    };
  };

  // Pre-seed static candle queue
  const candles = useMemo(() => {
    const list: CandleData[] = [];
    let price = -0.5;

    const priceWalk = [
      -0.8, -0.6, -0.3, -0.4, -0.1, 0.2, 0.1, 0.4, 0.8, 0.6,
      0.9, 1.2, 1.0, 0.8, 1.1, 1.5, 1.3, 1.2, 1.4, 1.8,
      2.2, 1.9, 1.7, 1.5, 1.8, 2.0, 1.8, 1.6, 1.9, 2.3,
      2.6, 2.4, 2.7, 3.1, 2.8, 3.2
    ];

    for (let i = 0; i < NUM_CANDLES; i++) {
      const open = price;
      const close = priceWalk[i % priceWalk.length];
      price = close;
      list.push(createCandle(i, open, close));
    }
    lastPrice.current = price;
    return list;
  }, []);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    mouseVelocity.x = mouseNDC.x - prevMouse.x;
    mouseVelocity.y = mouseNDC.y - prevMouse.y;
    prevMouse.x = mouseNDC.x;
    prevMouse.y = mouseNDC.y;
    const mSpeed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2) * 80;

    const mx3d = mouseNDC.x * (NUM_CANDLES * CANDLE_SPACING * 0.5);

    // ── Live Scrolling Queue ──
    scrollAccum.current += delta * SCROLL_SPEED;
    if (scrollAccum.current >= CANDLE_SPACING) {
      candles.shift(); // remove leftmost

      const open = lastPrice.current;
      const change = Math.sin(t * 0.85) * 0.45 + (Math.random() - 0.5) * 0.15;
      const close = open + change;
      lastPrice.current = close;

      candles.push(createCandle(NUM_CANDLES - 1, open, close));
      scrollAccum.current -= CANDLE_SPACING;
    }

    const group = groupRef.current;
    if (!group) return;

    const startX = -((NUM_CANDLES - 1) * CANDLE_SPACING) / 2;
    const scrollOffset = -scrollAccum.current;

    // Update 3D child meshes directly
    candles.forEach((candle, idx) => {
      const candleX = startX + idx * CANDLE_SPACING + scrollOffset;
      const dx = candleX - mx3d;
      const dist = Math.abs(dx);

      const baseY = Math.sin(t * 0.65 + idx * 0.18) * 0.12;

      let agY = 0;
      if (dist < INTERACTION_RADIUS) {
        const falloff = 1 - (dist / INTERACTION_RADIUS);
        const smoothFalloff = falloff * falloff * (3 - 2 * falloff);
        agY = smoothFalloff * AG_FORCE * (1 + mSpeed * 0.05); // Reduced velocity impact
      }

      const targetY = baseY + agY;
      candle.vy += (targetY - candle.y) * LERP_SPEED;
      candle.vy *= DAMPING;
      candle.y += candle.vy;

      const child = group.children[idx] as THREE.Group;
      if (child) {
        child.position.set(candleX, candle.y, 0);

        const bodyMesh = child.children[1] as THREE.Mesh;
        if (bodyMesh) {
          bodyMesh.scale.set(1, candle.bodyHeight, 1);
          bodyMesh.position.set(0, candle.bodyY, 0);
          
          const mat = bodyMesh.material as THREE.MeshPhysicalMaterial;
          const targetColor = candle.bullish ? COLOR_BULLISH : COLOR_BEARISH;
          mat.color.copy(targetColor);
          mat.emissive.copy(targetColor);
        }

        const wickMesh = child.children[0] as THREE.Mesh;
        if (wickMesh) {
          const wickHeight = candle.high - candle.low;
          const wickY = (candle.high + candle.low) / 2;
          wickMesh.scale.set(1, wickHeight, 1);
          wickMesh.position.set(0, wickY, 0);

          const mat = wickMesh.material as THREE.MeshPhysicalMaterial;
          mat.color.copy(candle.bullish ? COLOR_BULLISH : COLOR_BEARISH);
          mat.emissive.copy(candle.bullish ? COLOR_BULLISH : COLOR_BEARISH);
        }
      }
    });
  });

  return (
    <group>
      <group ref={groupRef}>
        {candles.map((candle, idx) => {
          const color = candle.bullish ? COLOR_BULLISH : COLOR_BEARISH;

          return (
            <group key={`candle-group-${idx}`}>
              {/* ── 0. The Wick (Metallic Platinum Needles) ── */}
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 1, 6]} />
                <meshPhysicalMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.8}
                  roughness={0.1}
                  metalness={0.9}
                  transparent
                  opacity={0.8}
                  depthWrite={false}
                />
              </mesh>

              {/* ── 1. The Body (Hyper-Realistic Beveled Glass) ── */}
              <RoundedBox args={[0.26, 1, 0.22]} radius={0.02} smoothness={4}>
                <meshPhysicalMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.3} // Subtle internal glow
                  roughness={0.03}
                  metalness={0.1}
                  transmission={0.9} // Superior glass transmission
                  thickness={0.8}
                  ior={1.55} // Realistic flint glass
                  clearcoat={1.0}
                  clearcoatRoughness={0.01}
                  transparent
                  opacity={0.9}
                  depthWrite={false}
                />
              </RoundedBox>
            </group>
          );
        })}
      </group>
      
      <TrendLines candles={candles} scrollAccum={scrollAccum} />
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

    for (let zi = 0; zi < GRID_COLS; zi++) {
      for (let xi = 0; xi < GRID_ROWS - 1; xi++) {
        lines.push(xi * GRID_SPACING - offX, -3, zi * GRID_SPACING - offZ);
        lines.push((xi + 1) * GRID_SPACING - offX, -3, zi * GRID_SPACING - offZ);
      }
    }
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

      const dx = bx - mx3d;
      const dz = bz - mz3d;
      const dist = Math.sqrt(dx * dx + dz * dz);

      let agY = 0;
      if (dist < INTERACTION_RADIUS * 1.5) {
        const falloff = 1 - (dist / (INTERACTION_RADIUS * 1.5));
        agY = falloff * 0.5;
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
        opacity={0.04}
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

  useEffect(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

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

// ── DYNAMIC DUAL CURSOR LIGHT TRAIL ──────────────────────────────────────────
function CursorLight() {
  const lightRef1 = useRef<THREE.PointLight>(null!);
  const lightRef2 = useRef<THREE.PointLight>(null!);
  const delayPos = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const mx3d = mouseNDC.x * (NUM_CANDLES * CANDLE_SPACING * 0.5);
    const mz3d = -mouseNDC.y * (15 * 0.5);

    const targetX = mx3d;
    const targetZ = 1.5;

    const light1 = lightRef1.current;
    if (light1) {
      light1.position.set(targetX, 1.2, targetZ);
    }

    // Delayed trailing light logic
    delayPos.current.x += (targetX - delayPos.current.x) * delta * 4.5;
    
    const light2 = lightRef2.current;
    if (light2) {
      light2.position.set(delayPos.current.x, 0.8, targetZ - 0.5);
    }
  });

  return (
    <group>
      {/* Primary Cyan Highlight */}
      <pointLight
        ref={lightRef1}
        distance={10}
        intensity={4.5}
        color="#00E5FF"
      />
      {/* Lagging Purple Trail */}
      <pointLight
        ref={lightRef2}
        distance={8}
        intensity={3.0}
        color="#8B5CF6"
      />
    </group>
  );
}

// ── MAIN MATRIX CANVAS WRAPPER ───────────────────────────────────────────────
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
      style={{ background: '#020305' }}
    >
      {/* Massive Background Typography */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center items-center pointer-events-none opacity-[0.03] overflow-hidden select-none font-mono">
         <div className="text-[22vw] font-black text-white leading-[0.8] whitespace-nowrap tracking-tighter blur-[2px]">XAUUSD</div>
         <div className="text-[22vw] font-black text-white leading-[0.8] whitespace-nowrap tracking-tighter blur-[2px]">EURUSD</div>
      </div>

      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: 55, near: 0.1, far: 100, position: [0, 4, 12] }}
        performance={{ min: 0.6 }}
      >
        <color attach="background" args={['#020305']} />
        <fog attach="fog" args={['#020305', 12, 30]} />
        
        {/* ── CINEMATIC 3-WAY STUDIO LIGHTING ── */}
        <ambientLight intensity={0.25} />
        {/* Key Light: Sharp highlights */}
        <directionalLight position={[12, 18, 10]} intensity={2.2} color="#E0F2FE" />
        {/* Fill Light: Soft deep shadow fill */}
        <directionalLight position={[-12, -8, -5]} intensity={0.8} color="#1E3A8A" />
        {/* Rim Light: Edge highlights */}
        <directionalLight position={[0, 10, -15]} intensity={1.5} color="#8B5CF6" />
        
        <CursorLight />

        {/* Core elements */}
        <CameraController />
        <GridFloor />
        <CandlestickChart />
      </Canvas>

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
