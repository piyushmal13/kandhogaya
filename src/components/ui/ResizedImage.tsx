import React, { useState } from "react";
import { Skeleton } from "./Skeleton";
import { cn } from "../../utils/cn";

interface ResizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  hasSkeleton?: boolean;
}

/**
 * Institutional Reliability Asset Loader
 * Orchestrates Supabase media streams with Skeleton fallbacks.
 */
export const ResizedImage: React.FC<ResizedImageProps> = ({ src, alt, className, hasSkeleton = true, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {hasSkeleton && !isLoaded && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};
