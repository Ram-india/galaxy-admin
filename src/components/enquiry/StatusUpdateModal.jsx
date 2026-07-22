import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ENQUIRY_STATUSES } from "../../constants/enquiry";
import StatusBadge from "./StatusBadge";

const StatusUpdateDialog = ({ enquiry, onClose, onSave, isSaving }) => {
  const [status, setStatus] = useState(enquiry.status || "New");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Update Status
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {enquiry.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            Current:
            <StatusBadge status={enquiry.status} />
          </div>

          <div>
            <label
              htmlFor="status-select"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              New status
            </label>
            <select
              id="status-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {ENQUIRY_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status)}
            disabled={isSaving || status === enquiry.status}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Lightweight modal for changing a single enquiry's status from the list view.
 * `enquiry` being null keeps the dialog unmounted; keying on the id gives each
 * enquiry a freshly initialised dropdown instead of syncing state in an effect.
 */
const StatusUpdateModal = ({ enquiry, ...props }) =>
  enquiry ? (
    <StatusUpdateDialog key={enquiry._id} enquiry={enquiry} {...props} />
  ) : null;

export default StatusUpdateModal;
