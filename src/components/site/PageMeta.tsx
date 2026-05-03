import React from "react";
import { Helmet } from "react-helmet-async";
import { BRANDING, PAGE_META_KEYWORDS } from "../../constants/branding";

export interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_KEYWORDS = PAGE_META_KEYWORDS;

const getAbsoluteUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
};

export const PageMeta = ({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
  robots = "index,follow",
  structuredData,
}: PageMetaProps) => {
  const keywordContent = Array.from(new Set([...DEFAULT_KEYWORDS, ...(keywords ?? [])])).join(", ");
  const fullTitle = title.includes(BRANDING.name) ? title : `${title} | ${BRANDING.name}`;
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const url = getAbsoluteUrl(path || currentPath);
  const imageUrl = getAbsoluteUrl(image || BRANDING.logoUrl);
  const schema = structuredData ? JSON.stringify(structuredData) : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <meta name="robots" content={robots} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={BRANDING.name} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {schema}
        </script>
      )}
    </Helmet>
  );
};
