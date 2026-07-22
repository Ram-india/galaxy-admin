import { useState } from "react";
import { KeyRound } from "lucide-react";

import * as authApi from "../../services/authService";
import { PASSWORD_RULES } from "../../constants/permissions";
import { useAuth } from "../../context/authStore";

import PasswordField from "../ui/PasswordField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const EMPTY_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Changing the password invalidates every token issued earlier. The server
 * returns a fresh one so this tab stays signed in while other sessions drop.
 */
const ChangePasswordForm = ({ onSaved, onError }) => {
  const { setToken } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const failedRule = PASSWORD_RULES.find(
      (rule) => !rule.test(form.newPassword)
    );
    if (failedRule) {
      setValidationError(`Password requirement: ${failedRule.label}.`);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setValidationError("New passwords do not match.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setValidationError("Your new password must be different.");
      return;
    }

    setIsSaving(true);
    setValidationError("");

    try {
      const res = await authApi.changePassword(
        form.currentPassword,
        form.newPassword
      );

      if (res.data.token) setToken(res.data.token);

      setForm(EMPTY_FORM);
      onSaved(
        "Password changed. Any other devices signed in with the old password have been logged out."
      );
    } catch (err) {
      onError(err?.response?.data?.message || "Could not change your password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      {validationError && <Alert variant="error">{validationError}</Alert>}

      <PasswordField
        label="Current password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />

      <PasswordField
        label="New password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
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
        autoComplete="new-password"
        error={
          form.confirmPassword && form.confirmPassword !== form.newPassword
            ? "Passwords do not match"
            : ""
        }
        required
      />

      <Button type="submit" isLoading={isSaving} icon={KeyRound}>
        Update password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
