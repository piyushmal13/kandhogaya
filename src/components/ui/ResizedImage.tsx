import React, { useState, useMemo } from "react";
import { Skeleton } from "./Skeleton";
import { cn } from "../../utils/cn";
import { getSupabasePublicUrl } from "../../lib/supabase";

interface ResizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  bucket?: string;
  hasSkeleton?: boolean;
}

/**
 * Institutional Reliability Asset Loader
 * Orchestrates Supabase media streams with Skeleton fallbacks.
 * Automatically resolves relative Supabase storage paths if a bucket is provided.
 */
export const ResizedImage: React.FC<ResizedImageProps> = ({ 
  src, 
  alt, 
  bucket,
  className, 
  hasSkeleton = true, 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (bucket) return getSupabasePublicUrl(bucket, src);
    return src;
  }, [src, bucket]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {hasSkeleton && !isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={cn(
          "transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          hasError && "grayscale opacity-20",
          className
        )}
        {...props}
      />
    </div>
  );
};
