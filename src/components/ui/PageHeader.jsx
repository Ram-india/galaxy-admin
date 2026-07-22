import { Link } from "react-router-dom";
import { ChevronRight, Download, RefreshCw } from "lucide-react";

/**
 * Breadcrumb + title block with the primary page actions on the right.
 * `actions` lets a page (e.g. details) render its own buttons instead.
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  onExport,
  onRefresh,
  isRefreshing = false,
  actions,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      {breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>

    <div className="flex items-center gap-2">
      {actions}

      {onExport && (
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      )}

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      )}
    </div>
  </div>
);

export default PageHeader;
