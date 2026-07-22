import { Mail, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import EnquiryActionsMenu from "./EnquiryActionsMenu";
import { TableSkeleton } from "./LoadingSkeleton";
import { formatDate } from "../../utils/format";
import { getInitials } from "../../utils/initials";

const headerClass =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

/**
 * Desktop table view (hidden below `lg` — see EnquiryCards for mobile).
 * Purely presentational: selection, loading and actions are driven by props.
 */
const EnquiryTable = ({
  enquiries,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onUpdateStatus,
  onDelete,
  isFiltered,
  onClearFilters,
}) => {
  const allSelected =
    enquiries.length > 0 && selectedIds.length === enquiries.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
      {/* max-h + overflow keeps the header sticky while the body scrolls,
          and gives the table horizontal scrolling on narrow viewports */}
      <div className="max-h-[640px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[inset_0_-1px_0_0_rgb(226_232_240)] dark:bg-slate-800 dark:shadow-[inset_0_-1px_0_0_rgb(30_41_59)]">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all enquiries"
                  checked={allSelected}
                  ref={(node) => {
                    // `indeterminate` can only be set imperatively
                    if (node) node.indeterminate = someSelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
              </th>
              <th className={headerClass}>Customer</th>
              <th className={headerClass}>Phone</th>
              <th className={headerClass}>Email</th>
              <th className={headerClass}>Project Type</th>
              <th className={headerClass}>Installation</th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Created</th>
              <th className={`${headerClass} text-right`}>Actions</th>
            </tr>
          </thead>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {enquiries.map((enquiry, index) => {
                const isSelected = selectedIds.includes(enquiry._id);

                return (
                  <tr
                    key={enquiry._id}
                    onDoubleClick={() => onView(enquiry)}
                    className={`transition-colors ${
                      // Zebra striping, overridden by selection / hover below
                      index % 2 === 1 ? "bg-slate-50/60 dark:bg-slate-800/20" : ""
                    } ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-500/10"
                        : "hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${enquiry.fullName}`}
                        checked={isSelected}
                        onChange={() => onToggleSelect(enquiry._id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                          {getInitials(enquiry.fullName)}
                        </div>
                        <button
                          onClick={() => onView(enquiry)}
                          className="text-left text-sm font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                          {enquiry.fullName}
                        </button>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {enquiry.phone}
                      </a>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {enquiry.email ? (
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                        >
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {enquiry.email}
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {enquiry.projectType || "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {enquiry.installationType || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={enquiry.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(enquiry.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <EnquiryActionsMenu
                          onView={() => onView(enquiry)}
                          onUpdateStatus={
                            onUpdateStatus ? () => onUpdateStatus(enquiry) : null
                          }
                          onDelete={onDelete ? () => onDelete(enquiry) : null}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {!isLoading && enquiries.length === 0 && (
          <EmptyState isFiltered={isFiltered} onClearFilters={onClearFilters} />
        )}
      </div>
    </div>
  );
};

export default EnquiryTable;
