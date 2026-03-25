import React, { Suspense, useEffect, useState } from "react";
import { useInView } from "motion/react";

interface LazySectionProps {
  children: React.ReactNode;
  placeholderHeight?: string;
  threshold?: number;
}

export const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  placeholderHeight = "400px",
  threshold = 0.1
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldRender(true);
    }
  }, [isInView]);

  return (
    <div ref={ref} style={{ minHeight: shouldRender ? 'auto' : placeholderHeight }}>
      {shouldRender ? (
        <Suspense fallback={<div style={{ height: placeholderHeight }} />}>
          {children}
        </Suspense>
      ) : (
        <div style={{ height: placeholderHeight }} />
      )}
    </div>
  );
};
