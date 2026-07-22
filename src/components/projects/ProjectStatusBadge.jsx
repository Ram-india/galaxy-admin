import { PROJECT_STATUS_STYLES } from "../../constants/projects";

/** Colour-coded pill for a project status. */
const ProjectStatusBadge = ({ status, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
      PROJECT_STATUS_STYLES[status] || PROJECT_STATUS_STYLES.Pending
    } ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status || "Unknown"}
  </span>
);

export default ProjectStatusBadge;
