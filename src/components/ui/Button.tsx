import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-glow)] hover:bg-[var(--accent-hover)] font-semibold",
  secondary:
    "border border-[var(--border-default)] bg-white/5 text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-white/10",
  outline:
    "border border-[var(--border-emphasis)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent-subtle)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
  danger:
    "border border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/20 hover:text-red-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-[var(--radius-button)]",
  md: "px-5 py-2.5 text-sm rounded-[var(--radius-button)]",
  lg: "px-8 py-3.5 text-base rounded-[calc(var(--radius-button)+0.25rem)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          {children}
        </>
      ) : children}
    </motion.button>
  )
);

Button.displayName = "Button";
