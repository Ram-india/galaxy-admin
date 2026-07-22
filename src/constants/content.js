/** Mirrors the enums in server/models/Job.js. */
export const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];

export const JOB_STATUSES = ["Active", "Closed"];

export const JOB_STATUS_STYLES = {
  Active:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  Closed:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
};
