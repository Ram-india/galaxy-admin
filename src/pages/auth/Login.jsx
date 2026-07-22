import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, LogIn } from "lucide-react";

import { useAuth } from "../../context/authStore";
import * as authApi from "../../services/authService";

import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/ui/FormField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shown once after registration/reset redirects here
  const [notice, setNotice] = useState(location.state?.message || "");

  // Signup is only open until the first Owner exists
  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    let isStale = false;

    const checkRegistrationStatus = async () => {
      try {
        const res = await authApi.getRegistrationStatus();
        if (!isStale) setCanRegister(Boolean(res.data.isOpen));
      } catch {
        // A failed check just hides the link — sign-in still works
      }
    };

    checkRegistrationStatus();

    return () => {
      isStale = true;
    };
  }, []);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setNotice("");

    const result = await login(form.email, form.password);

    if (result.ok) {
      // Return the user to wherever they were headed before the redirect
      navigate(location.state?.from || "/dashboard", { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your GPS Solar admin console."
      footer={
        canRegister ? (
          <>
            First time here?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Create the owner account
            </Link>
          </>
        ) : (
          <>Access is invite only. Ask an administrator to invite you.</>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {notice && <Alert variant="success">{notice}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

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

        <div>
          <PasswordField
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <div className="mt-2 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting} icon={LogIn} fullWidth>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
