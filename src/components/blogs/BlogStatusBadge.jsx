import { BLOG_STATUS, BLOG_STATUS_LABELS, BLOG_STATUS_STYLES } from "../../constants/blogs";

/** Colour-coded pill for a post's editorial status. */
const BlogStatusBadge = ({ status, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
      BLOG_STATUS_STYLES[status] || BLOG_STATUS_STYLES[BLOG_STATUS.DRAFT]
    } ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {BLOG_STATUS_LABELS[status] || status}
  </span>
);

export default BlogStatusBadge;
