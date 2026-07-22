import { STATUS_STYLES } from "../../constants/enquiry";

/**
 * Colour-coded pill for an enquiry status.
 * Falls back to the "Closed" (neutral) palette for unknown values.
 */
const StatusBadge = ({ status, className = "" }) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.Closed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${styles} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
