import { useState } from "react";
import { UserCog, ShieldCheck, Calendar, Clock } from "lucide-react";

import { useAuth } from "../../context/authStore";
import { formatDateTime } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import Alert from "../../components/ui/Alert";
import RoleBadge from "../../components/team/RoleBadge";
import AvatarUploader from "../../components/profile/AvatarUploader";
import ProfileDetailsForm from "../../components/profile/ProfileDetailsForm";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";

const TABS = [
  { id: "details", label: "Profile", icon: UserCog },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const Card = ({ title, description, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </header>
    <div className="px-6 py-6">{children}</div>
  </section>
);

const Profile = () => {
  const { user, applyUser } = useAuth();

  const [activeTab, setActiveTab] = useState("details");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  /** Shared success handler: updates the cached session and shows a banner. */
  const handleSaved = (admin, message) => {
    if (admin) applyUser(admin);
    setNotice(message || "Saved.");
    setError("");
  };

  const handleError = (message) => {
    setError(message);
    setNotice("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "My profile" },
        ]}
        title="My profile"
        subtitle="Manage your personal details and account security."
      />

      {error && (
        <Alert variant="error" onDismiss={() => setError("")}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert variant="success" onDismiss={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* IDENTITY SUMMARY */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <AvatarUploader
            user={user}
            onUploaded={(admin) => handleSaved(admin, "Photo updated.")}
            onError={handleError}
          />

          <div className="flex flex-col gap-2 sm:items-end">
            <RoleBadge role={user?.role} />

            <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              Joined {formatDateTime(user?.createdAt)}
            </p>

            {user?.lastLoginAt && (
              <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                Last sign-in {formatDateTime(user.lastLoginAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 sm:w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === id
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "details" ? (
        <Card
          title="Personal details"
          description="This information appears next to your activity across the panel."
        >
          <ProfileDetailsForm
            user={user}
            onSaved={handleSaved}
            onError={handleError}
          />
        </Card>
      ) : (
        <Card
          title="Change password"
          description="Use a strong password you do not reuse anywhere else."
        >
          <ChangePasswordForm
            onSaved={(message) => handleSaved(null, message)}
            onError={handleError}
          />
        </Card>
      )}
    </div>
  );
};

export default Profile;
