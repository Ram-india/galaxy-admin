/**
 * Single source of truth for the Enquiry module.
 * These values mirror the enums defined in server/models/Enquiry.js —
 * keep both sides in sync when the workflow changes.
 */

export const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Quotation Sent",
  "Converted",
  "Closed",
];

export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Agriculture",
  "Government",
];

export const INSTALLATION_TYPES = [
  "On Grid",
  "Off Grid",
  "Hybrid",
  "Solar Water Pump",
  "Street Light",
  "Solar Water Heater",
];

/** Tailwind classes per status — consumed by StatusBadge. */
export const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30",
  Contacted:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
  "Quotation Sent":
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/30",
  Converted:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  Closed:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
};

/** Known enquiry sources. Backend `source` is free-text; new values still work. */
export const ENQUIRY_SOURCES = ["Website", "Solar Calculator"];

/** Tailwind classes per source badge. */
export const SOURCE_STYLES = {
  "Solar Calculator":
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
  Website:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
};

export const getSourceStyle = (source) =>
  SOURCE_STYLES[source] || SOURCE_STYLES.Website;

/** Date range presets offered by the date filter. */
export const DATE_FILTERS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export const PAGE_SIZE = 10;
