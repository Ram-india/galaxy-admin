import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { KeyRound, Loader2, AlertCircle } from "lucide-react";

import * as authApi from "../../services/authService";
import { PASSWORD_RULES } from "../../constants/permissions";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // null = validating, then { valid, email? , message? }
  const [tokenState, setTokenState] = useState(null);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the link before showing the form, so an expired link fails fast
  useEffect(() => {
    let isStale = false;

    const verifyToken = async () => {
      try {
        const res = await authApi.verifyResetToken(token);
        if (!isStale) setTokenState({ valid: true, email: res.data.email });
      } catch (err) {
        if (isStale) return;
        setTokenState({
          valid: false,
          message:
            err?.response?.data?.message ||
            "This reset link is invalid or has expired.",
        });
      }
    };

    verifyToken();

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

    try {
      await authApi.resetPassword(token, form.password);

      navigate("/login", {
        replace: true,
        state: { message: "Password updated. You can now sign in." },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not reset your password."
      );
      setIsSubmitting(false);
    }
  };

  if (tokenState === null) {
    return (
      <AuthLayout title="Checking your link..." subtitle="One moment.">
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </AuthLayout>
    );
  }

  if (!tokenState.valid) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="Reset links are valid for one hour and can only be used once."
        footer={
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {tokenState.message}
            </p>
          </div>

          <Button fullWidth onClick={() => navigate("/forgot-password")}>
            Request a new link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={`Choose a new password for ${tokenState.email}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <PasswordField
          label="New password"
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
          label="Confirm new password"
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
          icon={KeyRound}
          fullWidth
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
