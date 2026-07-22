import { Search, X, LayoutGrid, List } from "lucide-react";

import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PROJECT_SORTS,
} from "../../constants/projects";

const selectClass =
  "w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:w-auto";

/**
 * Search, filters, sort and the grid/list view switch.
 * Fully controlled: the page owns `filters` and passes one `onChange(key, value)`.
 */
const ProjectFilters = ({
  filters,
  onChange,
  onClear,
  isFiltered,
  view,
  onViewChange,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search — name, client, location and capacity */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search projects, clients or locations..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        {filters.search && (
          <button
            onClick={() => onChange("search", "")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
        <select
          value={filters.projectType}
          onChange={(event) => onChange("projectType", event.target.value)}
          className={selectClass}
        >
          <option value="all">All Types</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
          className={selectClass}
        >
          <option value="all">All Statuses</option>
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
          className={selectClass}
        >
          {PROJECT_SORTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        {/* Only offered once something is actually filtered */}
        {isFiltered && (
          <button
            onClick={onClear}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:flex-none"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}

        {/* Projects are image-heavy, so grid is the default presentation */}
        <div className="flex items-center rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
          {[
            { id: "grid", icon: LayoutGrid, label: "Grid view" },
            { id: "list", icon: List, label: "List view" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              aria-label={label}
              aria-pressed={view === id}
              className={`rounded-md p-1.5 transition-colors ${
                view === id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProjectFilters;
