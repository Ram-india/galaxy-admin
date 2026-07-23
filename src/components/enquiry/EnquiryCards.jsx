import { Mail, Phone, Calendar, Zap } from "lucide-react";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import EnquiryActionsMenu from "./EnquiryActionsMenu";
import { CardsSkeleton } from "./LoadingSkeleton";
import { formatDate } from "../../utils/format";
import { getSourceStyle } from "../../constants/enquiry";

/** Label + value pair used inside the card body. */
const Field = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
    <span className="truncate">{children}</span>
  </div>
);

/**
 * Mobile / tablet card view — replaces the table below the `lg` breakpoint.
 */
const EnquiryCards = ({
  enquiries,
  isLoading,
  selectedIds,
  onToggleSelect,
  onView,
  onUpdateStatus,
  onDelete,
  isFiltered,
  onClearFilters,
}) => {
  if (isLoading) {
    return (
      <div className="lg:hidden">
        <CardsSkeleton />
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <EmptyState isFiltered={isFiltered} onClearFilters={onClearFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:hidden">
      {enquiries.map((enquiry) => {
        const isSelected = selectedIds.includes(enquiry._id);

        return (
          <div
            key={enquiry._id}
            className={`rounded-xl border bg-white p-4 shadow-sm transition-colors dark:bg-slate-900 ${
              isSelected
                ? "border-blue-400 ring-1 ring-blue-400/30 dark:border-blue-500"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                aria-label={`Select ${enquiry.fullName}`}
                checked={isSelected}
                onChange={() => onToggleSelect(enquiry._id)}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />

              <div className="min-w-0 flex-1">
                <button
                  onClick={() => onView(enquiry)}
                  className="block truncate text-left text-sm font-semibold text-slate-900 dark:text-white"
                >
                  {enquiry.fullName}
                </button>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {enquiry.projectType || "—"}
                </p>
                {enquiry.source && enquiry.source !== "Website" && (
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${getSourceStyle(
                      enquiry.source
                    )}`}
                  >
                    {enquiry.source}
                  </span>
                )}
              </div>

              <StatusBadge status={enquiry.status} />

              <EnquiryActionsMenu
                onView={() => onView(enquiry)}
                onUpdateStatus={
                  onUpdateStatus ? () => onUpdateStatus(enquiry) : null
                }
                onDelete={onDelete ? () => onDelete(enquiry) : null}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 sm:grid-cols-2">
              <Field icon={Phone}>
                <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
              </Field>
              <Field icon={Mail}>
                {enquiry.email ? (
                  <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                ) : (
                  "—"
                )}
              </Field>
              <Field icon={Zap}>{enquiry.installationType || "—"}</Field>
              <Field icon={Calendar}>{formatDate(enquiry.createdAt)}</Field>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnquiryCards;
