import { Blog } from "../types";

/**
 * Institutional Image Resolver for Blog Posts
 * Ensures total consistency across Home, Blog List, and Blog Detail views.
 */
export const resolveBlogImage = (blog: Blog, size: "thumb" | "full" = "full") => {
  const meta = blog.metadata || {};
  
  // 1. Direct metadata cover image
  if (meta.cover_image) return meta.cover_image;
  
  // 2. Metadata image field
  if (meta.image) return meta.image;
  
  // 3. Main table image columns
  if (blog.image_url) return blog.image_url;
  if ((blog as any).featured_image_url) return (blog as any).featured_image_url;
  if (blog.featured_image) return blog.featured_image;
  
  // 4. Fallback to high-quality institutional placeholder
  const width = size === "thumb" ? 800 : 1280;
  const height = size === "thumb" ? 500 : 720;
  
  // Using a stable seed (slug) so the image doesn't change on Refresh
  return `https://picsum.photos/seed/${blog.slug || blog.id}/${width}/${height}`;
};

/**
 * stripHtml - Institutional Preview Sanitization
 * Removes HTML tags from content to prevent display bugs in card previews.
 */
export const stripHtml = (html: string = "") => {
  if (!html) return "";
  const stripped = html
    .replaceAll(/<[^>]*>?/gm, " ") // Remove tags
    .replaceAll("&nbsp;", " ")      // Institutional space normalization
    .replaceAll(/\s+/g, " ")       // Triple whitespace cleanup
    .trim();
  
  return stripped.length > 160 ? stripped.slice(0, 157) + "..." : stripped;
};
