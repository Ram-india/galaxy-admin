import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  Bell,
  Newspaper,
  LayoutTemplate,
  Activity,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { PERMISSIONS } from "../constants/permissions";

/**
 * Sidebar navigation.
 *
 * `permission` hides an entry from roles that cannot use it — a convenience
 * only; the route guard and the server both check again. `badge` names a live
 * counter the Sidebar resolves at render time rather than a hardcoded number.
 */
export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: Briefcase,
    permission: PERMISSIONS.PROJECT_VIEW,
  },
  {
    id: "enquiries",
    label: "Enquiries",
    path: "/enquiries",
    icon: FileText,
    permission: PERMISSIONS.ENQUIRY_VIEW,
  },
  {
    id: "blogs",
    label: "Blog",
    path: "/blogs",
    icon: Newspaper,
    permission: PERMISSIONS.BLOG_VIEW,
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    permission: PERMISSIONS.TEAM_VIEW,
    submenu: [
      {
        id: "team-members",
        label: "Members",
        path: "/users/all-users",
        icon: UserCog,
      },
      {
        id: "team-roles",
        label: "Roles & Permissions",
        path: "/users/roles",
        icon: ShieldCheck,
      },
      {
        id: "team-activity",
        label: "Activity",
        path: "/users/activity",
        icon: Activity,
      },
    ],
  },
  {
    id: "website-content",
    label: "Website Content",
    path: "/website-content",
    icon: LayoutTemplate,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    badge: "unreadNotifications",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default menuItems;
