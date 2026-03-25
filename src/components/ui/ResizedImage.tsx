import React from "react";

interface ResizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Production-grade Image component with support for next-gen formats 
 * and lazy loading by default. Centralizes image optimization strategy.
 */
export const ResizedImage: React.FC<ResizedImageProps> = ({ src, alt, className, ...props }) => {
  // Support for potential CDN transformations could be added here
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      {...props}
    />
  );
};
