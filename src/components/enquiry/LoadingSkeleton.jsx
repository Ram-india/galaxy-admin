/** Single grey bar used as the skeleton primitive. */
const Bar = ({ className = "" }) => (
  <div
    className={`h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`}
  />
);

/** Skeleton rows matching the desktop table layout (9 columns). */
export const TableSkeleton = ({ rows = 8 }) => (
  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index}>
        <td className="px-4 py-4">
          <Bar className="h-4 w-4 rounded" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-32" />
          <Bar className="mt-2 h-2.5 w-20" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-24" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-40" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-24" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-28" />
        </td>
        <td className="px-4 py-4">
          <Bar className="h-6 w-20 rounded-full" />
        </td>
        <td className="px-4 py-4">
          <Bar className="w-24" />
        </td>
        <td className="px-4 py-4">
          <Bar className="h-6 w-6 rounded" />
        </td>
      </tr>
    ))}
  </tbody>
);

/** Skeleton cards matching the mobile card layout. */
export const CardsSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Bar className="w-32" />
            <Bar className="mt-2 h-2.5 w-24" />
          </div>
          <Bar className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Bar className="w-full" />
          <Bar className="w-full" />
          <Bar className="w-full" />
          <Bar className="w-full" />
        </div>
      </div>
    ))}
  </div>
);

/** Skeleton for the four statistics cards. */
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <Bar className="h-2.5 w-24" />
        <Bar className="mt-4 h-7 w-16" />
      </div>
    ))}
  </div>
);

/** Skeleton for the details page. */
export const DetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <Bar className="h-6 w-48" />
      <Bar className="mt-3 h-3 w-32" />
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <Bar className="h-4 w-40" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((__, cell) => (
                <div key={cell}>
                  <Bar className="h-2.5 w-20" />
                  <Bar className="mt-2 w-36" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Bar className="h-4 w-24" />
        <Bar className="mt-5 h-10 w-full rounded-lg" />
        <Bar className="mt-3 h-10 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default TableSkeleton;
