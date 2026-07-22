import {
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  WhatsAppIcon,
  XIcon,
} from "../components/icons/SocialIcons";

/**
 * UI mirror of server/config/socialPlatforms.js.
 * `canAutoPost` marks the platforms the publisher has an adapter for.
 */
export const SOCIAL_PLATFORMS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: LinkedInIcon,
    placeholder: "https://www.linkedin.com/company/your-company",
    canAutoPost: true,
    brandClass: "text-[#0A66C2]",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    placeholder: "https://www.facebook.com/yourpage",
    canAutoPost: true,
    brandClass: "text-[#1877F2]",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
    placeholder: "https://www.instagram.com/yourhandle",
    canAutoPost: false,
    brandClass: "text-[#DD2A7B]",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: YouTubeIcon,
    placeholder: "https://www.youtube.com/@yourchannel",
    canAutoPost: false,
    brandClass: "text-[#FF0000]",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    placeholder: "https://wa.me/919876543210",
    canAutoPost: false,
    brandClass: "text-[#25D366]",
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: XIcon,
    placeholder: "https://x.com/yourhandle",
    canAutoPost: false,
    brandClass: "text-slate-900 dark:text-slate-100",
  },
];

export const getPlatform = (key) =>
  SOCIAL_PLATFORMS.find((item) => item.key === key);

export const AUTO_POST_PLATFORMS = SOCIAL_PLATFORMS.filter(
  (item) => item.canAutoPost
);

/** Status pill styling for the share log. */
export const SHARE_STATUS_STYLES = {
  sent: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  failed:
    "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30",
  skipped:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
};
