import { useEffect } from "react";

import { BRANDING } from "../../constants/branding";

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

const DEFAULT_KEYWORDS = [
  "IFX Trades",
  "forex education Asia",
  "best algo trading course India",
  "best algo trading course Dubai",
  "institutional forex education",
  "forex academy India",
  "forex webinar India 2026",
  "gold trading signals XAUUSD",
  "automated forex trading strategies",
  "AI forex trading bot MT5",
  "quantitative trading course India",
  "forex signals India live",
];

const getAbsoluteUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (globalThis.window === undefined) {
    return path;
  }

  return new URL(path, globalThis.window.location.origin).toString();
};

const upsertMeta = (selector: string, attrs: Record<string, string>, content: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
};

const upsertScript = (id: string, json: string) => {
  let element = document.head.querySelector(`#${id}`) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = json;
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
  const currentPath = globalThis.window === undefined ? "/" : globalThis.window.location.pathname;
  const url = getAbsoluteUrl(path || currentPath);
  const imageUrl = getAbsoluteUrl(image || BRANDING.logoUrl);
  const schema = structuredData ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="keywords"]', { name: "keywords" }, keywordContent);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, url);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, BRANDING.name);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: url });

    if (schema) {
      upsertScript("ifx-structured-data", schema);
    }
  }, [description, fullTitle, imageUrl, keywordContent, robots, schema, type, url]);

  return null;
};
