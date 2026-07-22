import { useState } from "react";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { PASSWORD_RULES, getPasswordScore } from "../../constants/permissions";

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-slate-200 dark:bg-slate-700",
  "bg-red-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
];

/**
 * Password input with a visibility toggle, and — when `showStrength` is set —
 * a strength meter plus the live checklist mirroring the server's rules.
 */
const PasswordField = ({
  label = "Password",
  error,
  showStrength = false,
  showChecklist = false,
  value = "",
  id,
  className = "",
  ...inputProps
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id || inputProps.name || "password";

  const score = getPasswordScore(value);

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          value={value}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 dark:bg-slate-800 dark:text-slate-100 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
          }`}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {showStrength && value && (
        <div className="mt-2.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((segment) => (
              <div
                key={segment}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  segment <= score
                    ? STRENGTH_COLORS[score]
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Password strength: {STRENGTH_LABELS[score]}
          </p>
        </div>
      )}

      {showChecklist && value && (
        <ul className="mt-2.5 space-y-1">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(value);

            return (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-xs ${
                  passed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {passed ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordField;
