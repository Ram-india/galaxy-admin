import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { User, Loader2, AlertCircle, PartyPopper } from "lucide-react";

import { useAuth } from "../../context/authStore";
import * as authApi from "../../services/authService";
import { PASSWORD_RULES } from "../../constants/permissions";

import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/ui/FormField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import RoleBadge from "../../components/team/RoleBadge";

/**
 * Invite acceptance: the member confirms their name, sets a password, and is
 * signed in immediately.
 */
const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { acceptInvite } = useAuth();

  const [invite, setInvite] = useState(null); // null = validating
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isStale = false;

    const verifyInvite = async () => {
      try {
        const res = await authApi.verifyInviteToken(token);
        if (isStale) return;

        setInvite({ valid: true, ...res.data });
        // Pre-fill the name the inviter entered; the member can correct it
        setForm((current) => ({ ...current, name: res.data.name || "" }));
      } catch (err) {
        if (isStale) return;
        setInvite({
          valid: false,
          message:
            err?.response?.data?.message ||
            "This invitation is invalid or has expired.",
        });
      }
    };

    verifyInvite();

    return () => {
      isStale = true;
    };
  }, [token]);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const failedRule = PASSWORD_RULES.find((rule) => !rule.test(form.password));
    if (failedRule) {
      setError(`Password requirement: ${failedRule.label}.`);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await acceptInvite(token, {
      name: form.name,
      password: form.password,
    });

    if (result.ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (invite === null) {
    return (
      <AuthLayout title="Checking your invitation..." subtitle="One moment.">
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </AuthLayout>
    );
  }

  if (!invite.valid) {
    return (
      <AuthLayout
        title="Invitation expired"
        subtitle="Invitations are valid for seven days."
        footer={
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            {invite.message}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Ask an administrator to send you a new invitation.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Accept your invitation"
      subtitle={`Set a password to activate your account for ${invite.email}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert variant="info">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {invite.invitedBy ? (
              <span>
                <strong>{invite.invitedBy}</strong> invited you to join as
              </span>
            ) : (
              <span>You have been invited to join as</span>
            )}
            <RoleBadge role={invite.role} />
          </div>
        </Alert>

        {error && <Alert variant="error">{error}</Alert>}

        <FormField
          label="Your name"
          name="name"
          icon={User}
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <PasswordField
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          autoComplete="new-password"
          showStrength
          showChecklist
          required
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={
            form.confirmPassword && form.confirmPassword !== form.password
              ? "Passwords do not match"
              : ""
          }
          required
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          icon={PartyPopper}
          fullWidth
        >
          {isSubmitting ? "Setting up..." : "Activate my account"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AcceptInvite;
