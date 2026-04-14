import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [label, setLabel] = useState<string>("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const dotConfig = { damping: 50, stiffness: 800, mass: 0.2 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    // Only show on desktop
    if (window.innerWidth < 1024) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isBtn = target.closest("button, a, [data-cursor]");
      setIsPointer(!!isBtn);

      const cursorLabel = (isBtn as HTMLElement)?.dataset?.cursor || "";
      setLabel(cursorLabel);
    };

    const leave = () => setIsHidden(true);
    const enter = () => setIsHidden(false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    document.body.style.cursor = "none";

    // also hide cursor on all interactive elements
    const style = document.createElement("style");
    style.id = "cursor-hide-style";
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.body.style.cursor = "";
      document.getElementById("cursor-hide-style")?.remove();
    };
  }, [mouseX, mouseY]);

  // Don't render on mobile/tablet
  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isHidden ? 0 : 1,
          scale: isPointer ? 2.2 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ${
            isPointer
              ? "w-8 h-8 border-emerald-400/80 bg-emerald-400/10 backdrop-blur-sm"
              : "w-8 h-8 border-white/40"
          }`}
        />
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap bg-black/80 px-2 py-1 rounded-md backdrop-blur-sm"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHidden ? 0 : 1, scale: isPointer ? 0 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
      </motion.div>
    </>
  );
};
