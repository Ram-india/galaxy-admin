/**
 * UI mirror of server/config/permissions.js.
 *
 * Used only to show or hide controls. Every gate here is a convenience — the
 * server re-checks each permission on the request, so hiding a button is never
 * the thing that keeps data safe.
 */

export const ROLES = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
};

export const ROLE_LIST = Object.values(ROLES);

export const PERMISSIONS = {
  ENQUIRY_VIEW: "enquiry.view",
  ENQUIRY_UPDATE: "enquiry.update",
  ENQUIRY_DELETE: "enquiry.delete",
  ENQUIRY_EXPORT: "enquiry.export",

  PROJECT_VIEW: "project.view",
  PROJECT_CREATE: "project.create",
  PROJECT_UPDATE: "project.update",
  PROJECT_DELETE: "project.delete",

  BLOG_VIEW: "blog.view",
  BLOG_CREATE: "blog.create",
  BLOG_UPDATE: "blog.update",
  BLOG_DELETE: "blog.delete",
  BLOG_PUBLISH: "blog.publish",

  TEAM_VIEW: "team.view",
  TEAM_INVITE: "team.invite",
  TEAM_MANAGE: "team.manage",

  SETTINGS_MANAGE: "settings.manage",
};

/** Grouped for the permission matrix on the Roles page. */
export const PERMISSION_GROUPS = [
  {
    module: "Enquiries",
    items: [
      { key: PERMISSIONS.ENQUIRY_VIEW, label: "View enquiries" },
      { key: PERMISSIONS.ENQUIRY_UPDATE, label: "Update status" },
      { key: PERMISSIONS.ENQUIRY_EXPORT, label: "Export to CSV" },
      { key: PERMISSIONS.ENQUIRY_DELETE, label: "Delete enquiries" },
    ],
  },
  {
    module: "Projects",
    items: [
      { key: PERMISSIONS.PROJECT_VIEW, label: "View projects" },
      { key: PERMISSIONS.PROJECT_CREATE, label: "Create projects" },
      { key: PERMISSIONS.PROJECT_UPDATE, label: "Edit projects" },
      { key: PERMISSIONS.PROJECT_DELETE, label: "Delete projects" },
    ],
  },
  {
    module: "Blog",
    items: [
      { key: PERMISSIONS.BLOG_VIEW, label: "View posts" },
      { key: PERMISSIONS.BLOG_CREATE, label: "Write posts" },
      { key: PERMISSIONS.BLOG_UPDATE, label: "Edit posts" },
      { key: PERMISSIONS.BLOG_PUBLISH, label: "Publish to website" },
      { key: PERMISSIONS.BLOG_DELETE, label: "Delete posts" },
    ],
  },
  {
    module: "Team",
    items: [
      { key: PERMISSIONS.TEAM_VIEW, label: "View team members" },
      { key: PERMISSIONS.TEAM_INVITE, label: "Invite members" },
      { key: PERMISSIONS.TEAM_MANAGE, label: "Change roles & remove" },
    ],
  },
  {
    module: "Workspace",
    items: [{ key: PERMISSIONS.SETTINGS_MANAGE, label: "Manage settings" }],
  },
];

/** Badge styling per role. */
export const ROLE_STYLES = {
  [ROLES.OWNER]:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/30",
  [ROLES.ADMIN]:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30",
  [ROLES.MANAGER]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  [ROLES.VIEWER]:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
};

export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  INVITED: "invited",
  DISABLED: "disabled",
};

export const STATUS_STYLES = {
  [ACCOUNT_STATUS.ACTIVE]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  [ACCOUNT_STATUS.INVITED]:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
  [ACCOUNT_STATUS.DISABLED]:
    "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30",
};

export const STATUS_LABELS = {
  [ACCOUNT_STATUS.ACTIVE]: "Active",
  [ACCOUNT_STATUS.INVITED]: "Invite pending",
  [ACCOUNT_STATUS.DISABLED]: "Disabled",
};

/* ------------------------------------------------------------ password rules */

/** Mirrors validatePassword() in the auth controller. */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  {
    label: "Upper and lowercase letters",
    test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { label: "At least one number", test: (value) => /\d/.test(value) },
];

/** 0–4 score used by the strength meter. */
export const getPasswordScore = (password = "") => {
  if (!password) return 0;

  let score = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  // Bonus point for length or symbols, so a valid password can still read "strong"
  if (password.length >= 12 || /[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(4, score);
};
