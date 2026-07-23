import { createContext, useContext } from "react";

/**
 * Branding (logo, site name, tagline) managed in Website Settings and used to
 * brand the admin panel itself. Context + hook live here so the provider file
 * exports only a component (Fast Refresh requirement).
 */
export const BrandingContext = createContext({
  logoUrl: "",
  siteName: "GPS Solar",
  tagline: "",
});

export const useBranding = () => useContext(BrandingContext);
