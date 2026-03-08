import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface CountdownTimerProps {
  targetDate: string;
  variant?: "banner" | "hero" | "compact";
}

export const CountdownTimer = ({ targetDate, variant = "hero" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(targetDate).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        return { d: 0, h: 0, m: 0, s: 0 };
      }

      return {
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.d },
    { label: "Hours", value: timeLeft.h },
    { label: "Minutes", value: timeLeft.m },
    { label: "Seconds", value: timeLeft.s }
  ];

  if (variant === "banner") {
    return (
      <div className="flex items-center gap-3 font-mono">
        {units.map((unit, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-white font-bold text-sm">{String(unit.value).padStart(2, '0')}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">{unit.label[0]}</span>
            {i < units.length - 1 && <span className="text-gray-700 text-[10px] mx-0.5">:</span>}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4">
        {units.slice(0, 3).map((unit, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none">{String(unit.value).padStart(2, '0')}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
      {units.map((unit, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[2rem] w-20 h-24 md:w-32 md:h-40 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-3xl md:text-6xl font-bold text-white tracking-tighter mb-1">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[8px] md:text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">
                {unit.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
