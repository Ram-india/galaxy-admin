import { Inbox, Sparkles, PhoneCall, CheckCircle2 } from "lucide-react";

/**
 * Four KPI cards summarising the enquiry pipeline.
 * `stats` is pre-computed by the page so this stays purely presentational.
 */
const CARDS = [
  {
    key: "total",
    label: "Total Enquiries",
    icon: Inbox,
    iconClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    key: "new",
    label: "New",
    icon: Sparkles,
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    key: "contacted",
    label: "Contacted",
    icon: PhoneCall,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    key: "converted",
    label: "Converted",
    icon: CheckCircle2,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
];

const EnquiryStats = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Share of total — hidden on the total card itself */}
        {key !== "total" && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            {stats?.total
              ? `${Math.round((stats[key] / stats.total) * 100)}% of all enquiries`
              : "No enquiries yet"}
          </p>
        )}
      </div>
    ))}
  </div>
);

export default EnquiryStats;
