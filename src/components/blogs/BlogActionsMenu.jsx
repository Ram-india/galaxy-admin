import { createPortal } from "react-dom";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Send,
  EyeOff,
  Archive,
  ExternalLink,
} from "lucide-react";

import useAnchoredMenu from "../../hooks/useAnchoredMenu";
import { BLOG_STATUS } from "../../constants/blogs";

const MENU_WIDTH = 200;

/**
 * Row actions for a post. Publish/unpublish and delete are omitted when the
 * viewer lacks the permission — the server enforces the same rules.
 */
const BlogActionsMenu = ({
  blog,
  siteUrl,
  onEdit,
  onChangeStatus,
  onDelete,
}) => {
  const { isOpen, position, triggerRef, menuRef, toggle, runAction } =
    useAnchoredMenu(MENU_WIDTH);

  const isPublished = blog.status === BLOG_STATUS.PUBLISHED;

  const itemClass =
    "flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-label={`Actions for ${blog.title}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {onEdit && (
              <button className={itemClass} onClick={() => runAction(onEdit)}>
                <Pencil className="h-4 w-4 text-slate-400" />
                Edit post
              </button>
            )}

            {/* Only a live post has a public URL worth opening */}
            {isPublished && siteUrl && (
              <a
                href={`${siteUrl}/blog/${blog.slug}`}
                target="_blank"
                rel="noreferrer"
                className={itemClass}
                onClick={() => runAction(null)}
              >
                <ExternalLink className="h-4 w-4 text-slate-400" />
                View on site
              </a>
            )}

            {onChangeStatus && (
              <>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />

                {isPublished ? (
                  <button
                    className={itemClass}
                    onClick={() =>
                      runAction(() => onChangeStatus(BLOG_STATUS.DRAFT))
                    }
                  >
                    <EyeOff className="h-4 w-4 text-slate-400" />
                    Unpublish
                  </button>
                ) : (
                  <button
                    className={itemClass}
                    onClick={() =>
                      runAction(() => onChangeStatus(BLOG_STATUS.PUBLISHED))
                    }
                  >
                    <Send className="h-4 w-4 text-slate-400" />
                    Publish
                  </button>
                )}

                {blog.status !== BLOG_STATUS.ARCHIVED && (
                  <button
                    className={itemClass}
                    onClick={() =>
                      runAction(() => onChangeStatus(BLOG_STATUS.ARCHIVED))
                    }
                  >
                    <Archive className="h-4 w-4 text-slate-400" />
                    Archive
                  </button>
                )}
              </>
            )}

            {onDelete && (
              <>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <button
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  onClick={() => runAction(onDelete)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default BlogActionsMenu;
