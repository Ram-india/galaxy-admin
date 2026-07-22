import { Sun, ShieldCheck, BarChart3, Users } from "lucide-react";

const HIGHLIGHTS = [
  { icon: BarChart3, text: "Track every enquiry from first contact to install" },
  { icon: Users, text: "Invite your team with role-based access" },
  { icon: ShieldCheck, text: "Secure, audit-friendly admin controls" },
];

/**
 * Split-screen shell shared by every auth screen: brand panel on the left
 * (desktop only), form card on the right.
 */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
    {/* BRAND PANEL */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700 p-12 lg:flex">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Sun className="h-6 w-6 text-amber-300" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">GPS Solar</p>
          <p className="text-xs text-blue-100">Admin Console</p>
        </div>
      </div>

      <div className="relative">
        <h2 className="max-w-md text-3xl font-semibold leading-tight text-white">
          Powering solar operations from a single dashboard.
        </h2>

        <ul className="mt-8 space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-blue-50">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-blue-200">
        © {new Date().getFullYear()} GPS Solar. All rights reserved.
      </p>
    </div>

    {/* FORM PANEL */}
    <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
      <div className="w-full max-w-sm">
        {/* Compact brand mark for mobile, where the panel is hidden */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              GPS Solar
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin Console
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}

        <div className="mt-8">{children}</div>

        {footer && (
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default AuthLayout;
