/**
 * JSON-LD Structured Data Generators
 * Provides schema.org markup for SEO-rich search results.
 */

import { BRANDING } from "../constants/branding";

const SITE_URL = "https://ifxtrades.com";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRANDING.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: BRANDING.description,
  contactPoint: {
    "@type": "ContactPoint",
    email: BRANDING.supportEmail,
    contactType: "customer support",
    availableLanguage: "English",
  },
  sameAs: [BRANDING.whatsappUrl],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRANDING.name,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbSchema = (
  items: Array<{ name: string; path: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const courseSchema = (course: {
  title: string;
  description?: string;
  id: string;
  level?: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.description,
  url: `${SITE_URL}/academy/${course.id}`,
  provider: {
    "@type": "Organization",
    name: BRANDING.name,
    url: SITE_URL,
  },
  educationalLevel: course.level || "Beginner",
  timeRequired: course.duration || "Self-paced",
});

export const articleSchema = (article: {
  title: string;
  content: string;
  slug: string;
  published_at?: string;
  created_at?: string;
  author_name?: string;
  image_url?: string;
  featured_image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.content?.substring(0, 160),
  url: `${SITE_URL}/blog/${article.slug}`,
  image: article.image_url || article.featured_image || `${SITE_URL}/logo.png`,
  datePublished: article.published_at || article.created_at,
  author: {
    "@type": "Organization",
    name: article.author_name || BRANDING.name,
  },
  publisher: {
    "@type": "Organization",
    name: BRANDING.name,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
});

export const productSchema = (product: {
  name: string;
  description: string;
  id: string;
  price?: number;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  url: `${SITE_URL}/marketplace`,
  category: product.category || "Trading Algorithm",
  brand: {
    "@type": "Brand",
    name: BRANDING.name,
  },
  offers: product.price
    ? {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      }
    : undefined,
});

export const faqSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const eventSchema = (webinar: {
  title: string;
  description?: string;
  id: string;
  date_time: string;
  speaker_name?: string;
  is_paid?: boolean;
  price?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: webinar.title,
  description: webinar.description || "",
  url: `${SITE_URL}/webinars/${webinar.id}`,
  startDate: webinar.date_time,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: `${SITE_URL}/webinars/${webinar.id}`,
  },
  organizer: {
    "@type": "Organization",
    name: BRANDING.name,
    url: SITE_URL,
  },
  performer: webinar.speaker_name
    ? { "@type": "Person", name: webinar.speaker_name }
    : undefined,
  offers: {
    "@type": "Offer",
    price: webinar.is_paid ? webinar.price : 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
});
