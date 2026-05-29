import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  Bell,
} from "lucide-react";

export const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    active: true,
  },
  {
    id: 2,
    label: "Projects",
    path: "/projects",
    icon: Briefcase,
    badge: "12",
    active: true,
  },
  {
    id: 3,
    label: "Enquiries",
    path: "/enquiries",
    icon: FileText,
    badge: "5",
    count: 5,
    active: true,
  },
  {
    id: 4,
    label: "Users",
    path: "/users",
    icon: Users,
    count: 3,
    active: true,
    submenu: [
      {
        id: 41,
        label: "All Users",
        path: "/users/all-users",
      },
      {
        id: 42,
        label: "Roles & Permissions",
        path: "/users/roles",
      },
      {
        id: 43,
        label: "User Activity",
        path: "/users/activity",
      },
    ],
  },
  {
    id: 5,
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    badge: "New",
    active: true,
  },
  {
    id: 6,
    label: "Settings",
    path: "/settings",
    icon: Settings,
    badge: null,
    active: true,
  },
];