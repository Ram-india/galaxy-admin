import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

import { ROLES, ROLE_LIST } from "../../constants/permissions";
import { useAuth } from "../../context/authStore";

import Button from "../ui/Button";
import Alert from "../ui/Alert";
import RoleBadge from "./RoleBadge";
import UserAvatar from "./UserAvatar";

const ChangeRoleDialog = ({ member, onClose, onSave }) => {
  const { user } = useAuth();

  const [role, setRole] = useState(member.role);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const availableRoles = ROLE_LIST.filter(
    (option) => option !== ROLES.OWNER || user?.role === ROLES.OWNER
  );

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      await onSave(role);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not change the role.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Change role
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-800">
            <UserAvatar name={member.name} src={member.avatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {member.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {member.email}
              </p>
            </div>
            <RoleBadge role={member.role} />
          </div>

          <div>
            <label
              htmlFor="member-role"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              New role
            </label>
            <select
              id="member-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {availableRoles.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {role === ROLES.OWNER && member.role !== ROLES.OWNER && (
            <Alert variant="info">
              Owners have full control of the workspace, including managing
              every other member.
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={role === member.role}
            icon={ShieldCheck}
          >
            Save role
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Keyed on the member id so each dialog starts with that member's role
 * already selected, without syncing state in an effect.
 */
const ChangeRoleModal = ({ member, ...props }) =>
  member ? <ChangeRoleDialog key={member.id} member={member} {...props} /> : null;

export default ChangeRoleModal;
