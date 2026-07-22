import { Briefcase, Clock, Loader, CheckCircle2, Zap } from "lucide-react";

/**
 * KPI row for the project pipeline. `stats` is pre-computed by useProjects so
 * this stays purely presentational.
 */
const CARDS = [
  {
    key: "total",
    label: "Total Projects",
    icon: Briefcase,
    iconClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    key: "ongoing",
    label: "Ongoing",
    icon: Loader,
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
];

/** 1250 -> "1,250", at most one decimal place. */
const formatCapacity = (value) =>
  value ? value.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : "0";

const ProjectStats = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
    {CARDS.map(({ key, label, icon: Icon, iconClass }) => (
      <div
        key={key}
        className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {stats?.[key] ?? 0}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {key !== "total" && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            {stats?.total
              ? `${Math.round((stats[key] / stats.total) * 100)}% of portfolio`
              : "No projects yet"}
          </p>
        )}
      </div>
    ))}

    {/* Installed capacity gets its own accent card */}
    <div className="group rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-amber-500/30 dark:from-amber-500/10 dark:to-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Total Capacity
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {formatCapacity(stats?.capacity)}
            <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              kW
            </span>
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-transform duration-200 group-hover:scale-105 dark:bg-amber-500/20 dark:text-amber-300">
          <Zap className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-amber-700/70 dark:text-amber-300/70">
        Summed across every project
      </p>
    </div>
  </div>
);

export default ProjectStats;
