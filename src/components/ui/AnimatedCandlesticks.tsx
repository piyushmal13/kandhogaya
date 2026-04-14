import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

const generateCandles = (count: number): Candle[] => {
  const candles: Candle[] = [];
  let last = 1920 + Math.random() * 80;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 40;
    const open = last;
    const close = last + change;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;
    const volume = 0.3 + Math.random() * 0.7;
    candles.push({ open, close, high, low, volume });
    last = close;
  }
  return candles;
};

const CHART_H = 200;
const CANDLE_COUNT = 28;

export const AnimatedCandlesticks: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(CANDLE_COUNT));
  const [tick, setTick] = useState(0);

  // Live-update last candle every 1.5s
  useEffect(() => {
    const id = setInterval(() => {
      setCandles((prev) => {
        const next = [...prev];
        const last = { ...next[next.length - 1] };
        const move = (Math.random() - 0.48) * 8;
        last.close = Math.max(last.low + 2, last.close + move);
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        next[next.length - 1] = last;
        return next;
      });
      setTick((t) => t + 1);
    }, 1500);
    // Add new candle every 12s
    const addCandle = setInterval(() => {
      setCandles((prev) => {
        const next = [...prev.slice(1), ...generateCandles(1)];
        return next;
      });
    }, 12000);
    return () => {
      clearInterval(id);
      clearInterval(addCandle);
    };
  }, []);

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const toY = (price: number) => ((maxP - price) / range) * CHART_H;

  const totalWidth = 100; // SVG viewBox percentage
  const candleSpacing = totalWidth / CANDLE_COUNT;
  const candleW = candleSpacing * 0.55;

  const lastClose = candles[candles.length - 1].close;
  const prevClose = candles[candles.length - 2]?.close ?? lastClose;
  const isUp = lastClose >= prevClose;

  return (
    <div className={`relative select-none ${className}`}>
      {/* Price badge */}
      <motion.div
        className="absolute top-2 right-2 flex items-center gap-2 z-10"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black font-mono backdrop-blur-sm border ${isUp ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          <span>{isUp ? "▲" : "▼"}</span>
          <span>XAU/USD {lastClose.toFixed(2)}</span>
        </div>
      </motion.div>

      {/* Chart grid */}
      <svg
        viewBox={`0 0 100 ${CHART_H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8].map((frac) => (
          <line
            key={frac}
            x1="0"
            x2="100"
            y1={CHART_H * frac}
            y2={CHART_H * frac}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.3"
          />
        ))}

        {/* Candles */}
        {candles.map((candle, i) => {
          const cx = i * candleSpacing + candleSpacing / 2;
          const bodyTop = toY(Math.max(candle.open, candle.close));
          const bodyBot = toY(Math.min(candle.open, candle.close));
          const bodyH = Math.max(0.8, bodyBot - bodyTop);
          const green = candle.close >= candle.open;
          const fill = green ? "#10B981" : "#EF4444";
          const isLast = i === candles.length - 1;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.02, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `${cx}px ${CHART_H}px` }}
            >
              {/* Wick */}
              <line
                x1={cx}
                x2={cx}
                y1={toY(candle.high)}
                y2={toY(candle.low)}
                stroke={fill}
                strokeWidth="0.25"
                opacity={0.6}
              />
              {/* Body */}
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={fill}
                opacity={isLast ? 1 : 0.75}
                rx="0.3"
              />
              {/* Glow for last candle */}
              {isLast && (
                <rect
                  x={cx - candleW / 2 - 0.5}
                  y={bodyTop - 0.5}
                  width={candleW + 1}
                  height={bodyH + 1}
                  fill="none"
                  stroke={fill}
                  strokeWidth="0.5"
                  opacity={0.4}
                  rx="0.5"
                />
              )}
            </motion.g>
          );
        })}

        {/* Price line at close */}
        <motion.line
          x1="0"
          x2="100"
          y1={toY(lastClose)}
          y2={toY(lastClose)}
          stroke={isUp ? "#10B981" : "#EF4444"}
          strokeWidth="0.3"
          strokeDasharray="2 2"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>

      {/* Volume bars at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-[1px] h-6 px-0" style={{ pointerEvents: "none" }}>
        {candles.map((c, i) => {
          const green = c.close >= c.open;
          return (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${c.volume * 100}%`,
                background: green ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.02, duration: 0.4 }}
            />
          );
        })}
      </div>

      {/* Scan line animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.03) 50%, transparent 100%)" }}
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
    </div>
  );
};
