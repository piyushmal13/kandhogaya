import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface SovereignButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glowEffect?: boolean;
  isLoading?: boolean;
  trackingEvent?: string;
}

/**
 * Sovereign Execution Button (v2.0)
 * 
 * Enforcing the Lumina Quant visual language.
 * Features: High-precision rounding, dynamic glow, and scale-accurate micro-interactions.
 */
import { tracker } from '@/core/tracker';

export const SovereignButton = React.forwardRef<HTMLButtonElement, SovereignButtonProps>(
  ({ className, variant = 'primary', size = 'md', glowEffect = false, isLoading = false, trackingEvent, children, disabled, onClick, ...props }, ref) => {
    const content = children as React.ReactNode;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trackingEvent) {
        tracker.track("button_click", { event: trackingEvent, label: typeof content === 'string' ? content : undefined });
      }
      if (onClick) onClick(e);
    };
    
    const variants = {
      primary: "bg-[#58F2B6] text-[#020202] border-[#58F2B6] hover:bg-[#4ae0a5] shadow-[0_0_20px_rgba(88,242,182,0.2)]",
      secondary: "bg-white/10 text-white border-white/5 hover:bg-white/20",
      outline: "bg-transparent text-white border-white/10 hover:border-[#58F2B6]/40 hover:text-[#58F2B6]",
      glass: "bg-white/[0.03] backdrop-blur-xl text-white border-white/10 hover:bg-white/[0.08]"
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] uppercase tracking-widest font-black",
      md: "px-6 py-3 text-[11px] uppercase tracking-widest font-black",
      lg: "px-10 py-5 text-xs uppercase tracking-[0.25em] font-black",
      xl: "px-14 py-7 text-sm uppercase tracking-[0.3em] font-black"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex items-center justify-center rounded-2xl border font-mono transition-all duration-300",
          variants[variant],
          sizes[size],
          glowEffect && "neon-glow-emerald",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed grayscale",
          className
        )}
        {...props}
      >
        <span className={cn("relative z-10 flex items-center gap-2", isLoading && "opacity-0")}>
          {content}
        </span>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Sovereign Gloss Effect */}
        {variant === 'primary' && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </motion.button>
    );
  }
);

SovereignButton.displayName = "SovereignButton";
