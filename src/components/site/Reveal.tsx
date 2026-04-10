import { motion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  distance?: number;
  once?: boolean;
}

export const Reveal = ({
  children,
  delay = 0,
  distance = 24,
  once = true,
  transition,
  ...props
}: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, amount: 0.2 }}
    transition={{
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
      ...transition,
    }}
    {...props}
  >
    {children}
  </motion.div>
);
