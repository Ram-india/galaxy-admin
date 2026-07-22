import { createPortal } from "react-dom";
import {
  MoreVertical,
  Send,
  ShieldCheck,
  Ban,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { ACCOUNT_STATUS } from "../../constants/permissions";
import useAnchoredMenu from "../../hooks/useAnchoredMenu";

const MENU_WIDTH = 200;

/**
 * Per-member action dropdown, rendered in a portal so the table's scroll
 * container cannot clip it.
 *
 * Actions are hidden when the viewer lacks the permission, and self-targeting
 * actions are omitted entirely — the server enforces the same rules.
 */
const MemberActionsMenu = ({
  member,
  isSelf,
  canManage,
  canInvite,
  onChangeRole,
  onResendInvite,
  onToggleStatus,
  onRemove,
}) => {
  const { isOpen, position, triggerRef, menuRef, toggle, runAction } =
    useAnchoredMenu(MENU_WIDTH);

  const isInvited = member.status === ACCOUNT_STATUS.INVITED;
  const isDisabled = member.status === ACCOUNT_STATUS.DISABLED;

  // Nothing actionable for your own row, or without permissions
  const hasAnyAction = !isSelf && (canManage || (canInvite && isInvited));
  if (!hasAnyAction) return null;

  const itemClass =
    "flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-label={`Actions for ${member.name}`}
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
            {canInvite && isInvited && (
              <button
                className={itemClass}
                onClick={() => runAction(onResendInvite)}
              >
                <Send className="h-4 w-4 text-slate-400" />
                Resend invite
              </button>
            )}

            {canManage && (
              <button
                className={itemClass}
                onClick={() => runAction(onChangeRole)}
              >
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                Change role
              </button>
            )}

            {canManage && !isInvited && (
              <button
                className={itemClass}
                onClick={() => runAction(onToggleStatus)}
              >
                {isDisabled ? (
                  <>
                    <RotateCcw className="h-4 w-4 text-slate-400" />
                    Reactivate
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 text-slate-400" />
                    Disable access
                  </>
                )}
              </button>
            )}

            {canManage && (
              <>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <button
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  onClick={() => runAction(onRemove)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove member
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MemberActionsMenu;
