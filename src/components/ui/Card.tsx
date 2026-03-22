import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../../utils/cn";

type CardVariant = "panel" | "panel-muted" | "feature" | "flat";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  hoverable?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  panel: "site-panel",
  "panel-muted": "site-panel-muted",
  feature:
    "border border-[var(--border-default)] rounded-[var(--radius-card)] bg-[var(--bg-raised)] transition-colors duration-500 hover:border-[var(--border-hover)]",
  flat: "border border-[var(--border-default)] rounded-[var(--radius-panel)] bg-[var(--bg-surface)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "panel", hoverable = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
);

Card.displayName = "Card";
