import React, { ButtonHTMLAttributes, forwardRef, useImperativeHandle, useRef, useState } from 'react';
// motion import removed
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tracker } from '@/core/tracker';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

// ── INSTITUTIONAL BUTTON PRIMITIVE (v5.0 Elite) ──
// This Replaces IFX-02 with a hyper-advanced, accessible, and trackable execution node.
// Enforces zero-layout shift, dynamic GPU-accelerated glows, and strict WCAG AA.

export type ButtonVariant = 
  | 'elite' 
  | 'execution' 
  | 'secondary' 
  | 'ghost' 
  | 'danger' 
  | 'institutional-outline'
  | 'premium-gold';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'elite-hero';

export interface EliteButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  trackingEvent?: string; // Automatically ties into the IFX Tracker
  trackingData?: Record<string, any>;
  fluid?: boolean; // 100% width
  glowEffect?: boolean; // Hardware accelerated ambient glow
}

const variantStyles: Record<ButtonVariant, string> = {
  elite: "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]",
  execution: "bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] border border-teal-400/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]",
  secondary: "bg-white/[0.03] hover:bg-white/[0.07] text-white border border-white/10 hover:border-white/20 shadow-2xl backdrop-blur-md",
  ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
  danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40",
  'institutional-outline': "bg-transparent border-2 border-white/10 text-white hover:bg-white/[0.02] hover:border-emerald-500/40 hover:text-emerald-400",
  'premium-gold': "bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-black hover:text-white font-black hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-yellow-400/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[10px] tracking-wider md:px-4 md:py-2 md:text-xs",
  md: "px-4 py-2 text-xs tracking-wide md:px-6 md:py-3 md:text-sm md:tracking-widest",
  lg: "px-6 py-3 text-xs tracking-wider md:px-8 md:py-4 md:text-base md:tracking-[0.15em]",
  xl: "px-6 py-3.5 text-xs tracking-wide md:px-10 md:py-5 md:text-lg md:tracking-[0.2em]",
  'elite-hero': "px-6 py-4 text-xs tracking-widest min-w-[200px] md:px-12 md:py-6 md:text-xl md:tracking-[0.25em] md:min-w-[280px]",
};

export const Button = forwardRef<HTMLButtonElement, EliteButtonProps>(
  (
    { 
      className, 
      variant = 'secondary', 
      size = 'md', 
      isLoading = false, 
      leftIcon, 
      rightIcon, 
      children, 
      disabled, 
      trackingEvent,
      trackingData,
      fluid = false,
      glowEffect = false,
      onClick,
      ...props 
    }, 
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => internalRef.current);
    
    const [isPressed, setIsPressed] = useState(false);
    // Remote Feature Flag - Defaults to local prop if flag query is unavailable
    const { isEnabled: remoteGlowEnabled } = useFeatureFlag('enable_glow_effect', true);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) {
        e.preventDefault();
        return;
      }
      
      // Auto-Telemtry
      if (trackingEvent) {
        tracker.track(trackingEvent, { ...trackingData, component: 'EliteButton' });
      }

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);

      if (onClick) onClick(e);
    };

    const baseClasses = "relative inline-flex items-center justify-center uppercase transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color14)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color10)] active:scale-[0.97] active:brightness-90 overflow-hidden rounded-[1.25rem] group z-10";
    
    return (
      <div className={cn("relative z-10", fluid ? "w-full" : "inline-block")}>
        {/* Hardware Accelerated Glow Filter (Globally Feature-Flag-Gated) */}
        {glowEffect && remoteGlowEnabled && !disabled && (
          <div className={cn(
            "absolute -inset-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 mix-blend-screen",
            (() => {
              if (variant === 'elite') return 'bg-[var(--color14)]/40';
              if (variant === 'execution') return 'bg-emerald-500/40';
              return 'bg-white/10';
            })()
          )} />
        )}
        
        <button
          ref={internalRef}
          type="button"
          disabled={disabled || isLoading}
          aria-disabled={disabled || isLoading}
          aria-busy={isLoading}
          className={cn(
            baseClasses,
            variantStyles[variant],
            sizeStyles[size],
            fluid && "w-full",
            (disabled || isLoading) && "opacity-50 cursor-not-allowed filter saturate-0 transform-none active:scale-100",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {/* Internal Shimmer Effect for Premium Feel */}
          {!disabled && !isLoading && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          )}

          <div className={cn("flex items-center gap-1.5 sm:gap-3 relative z-10 transition-transform duration-200", isPressed && "scale-95")}>
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin data-[variant=elite]:text-[var(--color29)] data-[variant=secondary]:text-white" />
            )}
            {!isLoading && leftIcon && <span className="group-hover:-translate-x-1 transition-transform">{leftIcon}</span>}
            
            <span className="flex-1 whitespace-nowrap">{children}</span>
            
            {!isLoading && rightIcon && <span className="group-hover:translate-x-1 transition-transform">{rightIcon}</span>}
          </div>
        </button>
      </div>
    );
  }
);

export { Button as EliteButton };
Button.displayName = "EliteButton";
