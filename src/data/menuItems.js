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
    icon: LayoutDashboard,
    badge: null,
  },

  {
    id: 2,
    label: "Projects",
    icon: Briefcase,
    badge: "12",
  },

  {
    id: 3,
    label: "Enquiries",
    icon: FileText,
    badge: "5",
    count: "5",
  },

  {
    id: 4,
    label: "Users",
    icon: Users,
    count: "3",
    submenu:[
        {id: 1, label: "All Users"},
        {id: 2, label: "Roles & Permissions"},
        {id: 3, label: "User Activity"},
    ],
  },

  {
    id: 5,
    label: "Notifications",
    icon: Bell,
    active: false,
    badge: "New",
  },

  {
    id: 6,
    label: "Settings",
    icon: Settings,
    badge: null,
  },
];