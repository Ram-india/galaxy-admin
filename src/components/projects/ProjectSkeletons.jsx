const Bar = ({ className = "" }) => (
  <div
    className={`h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`}
  />
);

/** Placeholder cards matching the grid layout. */
export const GridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="h-44 animate-pulse bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-3 p-5">
          <Bar className="w-2/3" />
          <Bar className="h-2.5 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Bar className="h-6 w-20 rounded-full" />
            <Bar className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** Placeholder rows matching the table layout (7 columns). */
export const TableSkeleton = ({ rows = 8 }) => (
  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index}>
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div>
              <Bar className="w-32" />
              <Bar className="mt-2 h-2.5 w-20" />
            </div>
          </div>
        </td>
        <td className="px-4 py-4"><Bar className="w-24" /></td>
        <td className="px-4 py-4"><Bar className="w-16" /></td>
        <td className="px-4 py-4"><Bar className="w-24" /></td>
        <td className="px-4 py-4"><Bar className="w-28" /></td>
        <td className="px-4 py-4"><Bar className="h-6 w-20 rounded-full" /></td>
        <td className="px-4 py-4"><Bar className="h-6 w-6 rounded" /></td>
      </tr>
    ))}
  </tbody>
);

/** Placeholder for the project details page. */
export const DetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <Bar className="h-6 w-56" />
      <Bar className="mt-3 h-3 w-40" />
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Bar className="h-4 w-32" />
          <Bar className="mt-4 w-full" />
          <Bar className="mt-2 w-5/6" />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Bar className="h-4 w-24" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="mt-5">
            <Bar className="h-2.5 w-20" />
            <Bar className="mt-2 w-32" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
