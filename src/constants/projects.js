/**
 * Single source of truth for the Projects module.
 * Mirrors the enums in server/models/Projects.js — keep both in sync.
 */

export const PROJECT_STATUSES = ["Pending", "Ongoing", "Completed"];

export const PROJECT_TYPES = [
  "Rooftop",
  "Ground Mounted",
  "Industrial",
  "Residential",
];

/** Tailwind classes per status — consumed by ProjectStatusBadge. */
export const PROJECT_STATUS_STYLES = {
  Pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
  Ongoing:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30",
  Completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
};

/** Sort options offered in the toolbar. */
export const PROJECT_SORTS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "projectName:asc", label: "Name A–Z" },
  { value: "projectName:desc", label: "Name Z–A" },
  { value: "startDate:desc", label: "Start date (latest)" },
  { value: "completionDate:asc", label: "Completion (soonest)" },
];

export const PROJECT_PAGE_SIZE = 12;

/** Empty form state, shared by the create and edit flows. */
export const EMPTY_PROJECT_FORM = {
  projectName: "",
  clientName: "",
  capacity: "",
  location: "",
  projectType: "Rooftop",
  status: "Pending",
  startDate: "",
  completionDate: "",
  description: "",
  newImages: [],
  existingImages: [],
  removedImages: [],
};
