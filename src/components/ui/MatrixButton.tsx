/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LIQUIDITY MATRIX BUTTON  ·  IFX Trades — Advanced Gemini-Style CTA
 * ─────────────────────────────────────────────────────────────────────────────
 * Design: Institutional gold + sapphire navy animated gradient border
 *         Glossy specular highlight, mouse-tracking inner glow,
 *         micro-scale spring animation, HUD bracket corners.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useCallback, MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type MatrixButtonVariant = 'primary' | 'secondary';

interface MatrixButtonProps {
  children: ReactNode;
  variant?: MatrixButtonVariant;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const MatrixButton: React.FC<MatrixButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  rightIcon,
  leftIcon,
  className,
  disabled,
  id,
  type = 'button',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [pressed, setPressed] = useState(false);

  // Mouse-tracking specular spotlight
  const onMouseMove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSpotlight(s => ({ ...s, opacity: 0 }));
  }, []);

  const onMouseDown  = useCallback(() => setPressed(true),  []);
  const onMouseUp    = useCallback(() => setPressed(false), []);

  const isPrimary = variant === 'primary';

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* ── Animated gradient border ring ── */}
      <div
        className="absolute -inset-[1.5px] rounded-2xl opacity-80 matrix-btn-border"
        aria-hidden
      />

      {/* ── Outer ambient glow ── */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-45 group-hover:opacity-100 transition-all duration-700 pointer-events-none matrix-btn-ambient"
        aria-hidden
      />

      {/* ── The button itself ── */}
      <button
        ref={btnRef}
        id={id}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={cn(
          'group relative rounded-2xl overflow-hidden cursor-pointer',
          'inline-flex items-center justify-center gap-3',
          'px-7 py-[14px] sm:px-9 sm:py-4',
          'font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold',
          'transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF]/60',
          'active:scale-[0.97]',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
          isPrimary
            ? 'text-white bg-gradient-to-br from-[#00A3FF] via-[#3B82F6] to-[#8B5CF6] hover:shadow-[0_0_35px_rgba(0,163,255,0.45)]'
            : 'text-white/80 bg-[#040507]/80 backdrop-blur-xl border border-white/8',
          pressed && 'scale-[0.97]',
        )}
        style={{
          boxShadow: isPrimary
            ? '0 0 0 0 rgba(0,163,255,0), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2)'
            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        aria-label={typeof children === 'string' ? children : undefined}
      >
        {/* ── Specular gloss overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: isPrimary
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 55%, transparent 100%)'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 60%)',
          }}
          aria-hidden
        />

        {/* ── Mouse-tracking spotlight ── */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-200"
          style={{
            opacity: spotlight.opacity * (isPrimary ? 0.25 : 0.12),
            background: `radial-gradient(circle 60px at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.6), transparent)`,
          }}
          aria-hidden
        />

        {/* ── Shimmer sweep on hover ── */}
        <div
          className="absolute inset-0 -translate-x-full pointer-events-none group-hover:animate-[matrix-shimmer_1.8s_ease_forwards]"
          style={{
            background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
          }}
          aria-hidden
        />

        {/* HUD corner brackets removed for clean luxury design */}

        {/* ── Content ── */}
        <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
          {leftIcon && (
            <span className="flex items-center shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200">
              {leftIcon}
            </span>
          )}
          <span className="whitespace-nowrap">{children}</span>
          {rightIcon && (
            <span className="flex items-center shrink-0 group-hover:translate-x-1 transition-transform duration-300">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    </div>
  );
};
