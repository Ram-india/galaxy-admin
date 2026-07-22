import { ROLE_STYLES, ROLES } from "../../constants/permissions";

/** Colour-coded pill for a member's role. */
const RoleBadge = ({ role, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
      ROLE_STYLES[role] || ROLE_STYLES[ROLES.VIEWER]
    } ${className}`}
  >
    {role}
  </span>
);

export default RoleBadge;
