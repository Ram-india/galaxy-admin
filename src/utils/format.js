/** Shared date formatting used across every module. */

/** "12 Mar 2025" */
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

/** "12 Mar 2025, 04:30 pm" */
export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** Date value for an <input type="date">, or "" when unset. */
export const toDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";
