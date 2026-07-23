import { useEffect, useState } from "react";

import { BrandingContext } from "./brandingStore";
import { getPublicSiteSettings } from "../services/siteSettingsService";

const FALLBACK = { logoUrl: "", siteName: "GPS Solar", tagline: "" };

/**
 * Fetches the public branding once and shares it with the whole admin UI.
 *
 * Uses the public endpoint (no auth), so the logo also brands the login screen.
 * A failed fetch keeps the bundled fallback — the panel must never blank its
 * own header because the settings API is momentarily down.
 */
export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(FALLBACK);

  useEffect(() => {
    let isStale = false;

    const loadBranding = async () => {
      try {
        const res = await getPublicSiteSettings();
        if (isStale) return;

        const identity = res.data?.identity || {};
        setBranding({
          logoUrl: identity.logoUrl || "",
          siteName: identity.siteName || FALLBACK.siteName,
          tagline: identity.tagline || "",
        });
      } catch {
        // Keep the fallback
      }
    };

    loadBranding();

    return () => {
      isStale = true;
    };
  }, []);

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
};
