import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
}

export const Card = ({ className, hoverable = true, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300',
        className
      )}
      {...props}
    />
  );
};
