import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ShieldCheck } from "lucide-react";

import { useAuth } from "../../context/authStore";
import * as authApi from "../../services/authService";
import { PASSWORD_RULES } from "../../constants/permissions";

import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/ui/FormField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

/**
 * Owner onboarding. Only reachable while zero accounts exist — once the first
 * Owner is created the server closes this endpoint and the page redirects.
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // null = still checking, false = closed (redirect), true = open
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    let isStale = false;

    const checkRegistrationStatus = async () => {
      try {
        const res = await authApi.getRegistrationStatus();
        if (isStale) return;

        setIsOpen(Boolean(res.data.isOpen));

        if (!res.data.isOpen) {
          navigate("/login", {
            replace: true,
            state: {
              message:
                "Registration is closed. Sign in or ask an administrator for an invite.",
            },
          });
        }
      } catch {
        if (!isStale) setIsOpen(true); // let the server be the final judge
      }
    };

    checkRegistrationStatus();

    return () => {
      isStale = true;
    };
  }, [navigate]);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const validate = () => {
    const failedRule = PASSWORD_RULES.find((rule) => !rule.test(form.password));
    if (failedRule) return `Password requirement: ${failedRule.label}.`;
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (result.ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (isOpen === null) return null; // avoid flashing the form before the check

  return (
    <AuthLayout
      title="Create your owner account"
      subtitle="This is the first account for your workspace. You will be able to invite your team afterwards."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert variant="info">
          You are creating the <strong>Owner</strong> account. Public
          registration closes automatically after this step.
        </Alert>

        {error && <Alert variant="error">{error}</Alert>}

        <FormField
          label="Full name"
          name="name"
          icon={User}
          placeholder="Ravi Kumar"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <FormField
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
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
          icon={ShieldCheck}
          fullWidth
        >
          {isSubmitting ? "Creating account..." : "Create owner account"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
