import { getInitials } from "../../utils/initials";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-xl",
};

/** Photo when one exists, otherwise a gradient initials circle. */
const UserAvatar = ({ name, src, size = "md", className = "" }) => {
  const sizeClass = SIZES[size] || SIZES.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 font-semibold text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
