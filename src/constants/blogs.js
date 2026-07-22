/**
 * Single source of truth for the Blog module.
 * Mirrors the enums in server/models/Blog.js — keep both in sync.
 */

export const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const BLOG_STATUS_LIST = Object.values(BLOG_STATUS);

export const BLOG_STATUS_LABELS = {
  [BLOG_STATUS.DRAFT]: "Draft",
  [BLOG_STATUS.PUBLISHED]: "Published",
  [BLOG_STATUS.ARCHIVED]: "Archived",
};

export const BLOG_STATUS_STYLES = {
  [BLOG_STATUS.DRAFT]:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
  [BLOG_STATUS.PUBLISHED]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  [BLOG_STATUS.ARCHIVED]:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
};

export const BLOG_CATEGORIES = [
  "Solar Basics",
  "Industry News",
  "Case Studies",
  "Maintenance",
  "Government Schemes",
  "Company News",
];

export const BLOG_PAGE_SIZE = 10;

/** "Solar Panel Basics!" -> "solar-panel-basics" (mirrors the server helper). */
export const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** ~200 words per minute, floored at 1. */
export const estimateReadingMinutes = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
