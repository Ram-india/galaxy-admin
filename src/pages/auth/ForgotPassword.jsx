import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, MailCheck } from "lucide-react";

import * as authApi from "../../services/authService";

import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  // True when the server had no SMTP configured and only logged the link
  const [wasLoggedOnly, setWasLoggedOnly] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await authApi.forgotPassword(email);
      setWasLoggedOnly(res.data.emailDelivered === false);
      setIsSent(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = (
    <Link
      to="/login"
      className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to sign in
    </Link>
  );

  // Confirmation state — deliberately does not say whether the account exists
  if (isSent) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle={`If an account exists for ${email}, we've sent a link to reset your password.`}
        footer={backToLogin}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <MailCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              The link expires in one hour. Remember to check your spam folder.
            </p>
          </div>

          {wasLoggedOnly && (
            <Alert variant="info">
              Email delivery is not configured on the server, so the reset link
              was printed to the server console instead.
            </Alert>
          )}

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setIsSent(false);
              setWasLoggedOnly(false);
            }}
          >
            Use a different email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a link to set a new password."
      footer={backToLogin}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <FormField
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <Button type="submit" isLoading={isSubmitting} icon={Send} fullWidth>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
