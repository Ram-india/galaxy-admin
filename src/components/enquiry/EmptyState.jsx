import { Inbox, FilterX } from "lucide-react";
import BaseEmptyState from "../ui/EmptyState";

/**
 * Enquiry-specific copy on top of the shared empty state. The message changes
 * depending on whether filters are responsible for the empty list.
 */
const EmptyState = ({ isFiltered = false, onClearFilters }) => (
  <BaseEmptyState
    icon={isFiltered ? FilterX : Inbox}
    title="No enquiries found"
    description={
      isFiltered
        ? "No enquiries match your current search and filters. Try adjusting them."
        : "Enquiries submitted from your website will appear here automatically."
    }
    action={
      isFiltered &&
      onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <FilterX className="h-4 w-4" />
          Clear filters
        </button>
      )
    }
  />
);

export default EmptyState;
