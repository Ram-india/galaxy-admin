import {
  ACCOUNT_STATUS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "../../constants/permissions";

/** Account lifecycle pill: Active / Invite pending / Disabled. */
const StatusPill = ({ status, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
      STATUS_STYLES[status] || STATUS_STYLES[ACCOUNT_STATUS.DISABLED]
    } ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {STATUS_LABELS[status] || status}
  </span>
);

export default StatusPill;
