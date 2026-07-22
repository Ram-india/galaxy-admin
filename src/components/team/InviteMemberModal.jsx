import { useState } from "react";
import { X, Mail, User, Send } from "lucide-react";

import { ROLES, ROLE_LIST } from "../../constants/permissions";
import { useAuth } from "../../context/authStore";

import FormField from "../ui/FormField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ROLE_HINTS = {
  [ROLES.OWNER]: "Full control, including billing and ownership.",
  [ROLES.ADMIN]: "Everything except removing the owner.",
  [ROLES.MANAGER]: "Day-to-day work on enquiries and projects.",
  [ROLES.VIEWER]: "Read-only access.",
};

/** Invite dialog. `isOpen === false` keeps it unmounted. */
const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ROLES.MANAGER,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Only an Owner can hand out the Owner role
  const availableRoles = ROLE_LIST.filter(
    (role) => role !== ROLES.OWNER || user?.role === ROLES.OWNER
  );

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await onInvite(form);
      setForm({ name: "", email: "", role: ROLES.MANAGER });
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not send the invitation."
      );
    } finally {
      setIsSubmitting(false);
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
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Invite a team member
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              They'll receive an email to set their password.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5">
            {error && <Alert variant="error">{error}</Alert>}

            <FormField
              label="Full name"
              name="name"
              icon={User}
              placeholder="Ravi Kumar"
              value={form.name}
              onChange={handleChange}
              required
            />

            <FormField
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="ravi@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div>
              <label
                htmlFor="invite-role"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Role
              </label>
              <select
                id="invite-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                {ROLE_HINTS[form.role]}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} icon={Send}>
              Send invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
