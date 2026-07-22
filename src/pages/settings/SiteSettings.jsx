import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Share2,
  Trash2,
} from "lucide-react";

import * as settingsApi from "../../services/siteSettingsService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";

import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import { toErrorMessage } from "../../utils/errorMessage";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import SocialLinksEditor from "../../components/settings/SocialLinksEditor";
import IntegrationsPanel from "../../components/settings/IntegrationsPanel";
import ShareHistory from "../../components/settings/ShareHistory";

const TABS = [
  { id: "identity", label: "Identity", icon: Building2 },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social", icon: Share2 },
  { id: "seo", label: "SEO & Sharing", icon: Search },
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

/**
 * Website content settings.
 *
 * Everything here is read by the public site through /api/site-settings/public,
 * so a save takes effect without a redeploy.
 */
const SiteSettings = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.SETTINGS_MANAGE);

  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await settingsApi.getSiteSettings();
      setSettings(res.data);
      setForm(res.data);
    } catch (err) {
      setError(toErrorMessage(err, "Unable to load the website settings."));
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      await load();
    };

    loadSettings();
  }, [load]);

  /** Shared handler for the nested form sections. */
  const patch = (section, key, value) =>
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));

  const applyServerState = (updated, message) => {
    setSettings(updated);
    setForm(updated);
    setNotice(message);
    setError("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await settingsApi.updateSiteSettings({
        identity: form.identity,
        contact: form.contact,
        socials: form.socials,
        seo: form.seo,
      });
      applyServerState(res.data.settings, res.data.message);
    } catch (err) {
      setError(toErrorMessage(err, "Could not save the settings."));
      setNotice("");
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const addressLines = form.contact.addressLines || [];
  const hours = form.contact.hours || [];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Website settings" },
        ]}
        title="Website settings"
        subtitle="Content the public site reads directly — changes go live without a redeploy."
        actions={
          canManage && (
            <Button icon={Save} isLoading={isSaving} onClick={handleSave}>
              <span className="hidden sm:inline">Save changes</span>
            </Button>
          )
        }
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
      {!canManage && (
        <Alert variant="info">
          Your role can view these settings but not change them.
        </Alert>
      )}

      {/* TABS */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 lg:w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
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

      {activeTab === "identity" && (
        <Card
          title="Company identity"
          description="Used in the site header, footer and structured data."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Site name"
              icon={Building2}
              value={form.identity.siteName || ""}
              onChange={(event) =>
                patch("identity", "siteName", event.target.value)
              }
              disabled={!canManage}
            />
            <FormField
              label="Website URL"
              icon={Globe}
              value={form.identity.siteUrl || ""}
              onChange={(event) =>
                patch("identity", "siteUrl", event.target.value)
              }
              hint="Used to build share links and canonical URLs."
              disabled={!canManage}
            />
            <FormField
              label="Tagline"
              value={form.identity.tagline || ""}
              onChange={(event) =>
                patch("identity", "tagline", event.target.value)
              }
              className="sm:col-span-2"
              disabled={!canManage}
            />
          </div>
        </Card>
      )}

      {activeTab === "contact" && (
        <Card
          title="Contact details"
          description="Shown on the contact page, in the footer and on every call-to-action."
        >
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Phone"
                icon={Phone}
                value={form.contact.phone || ""}
                onChange={(event) =>
                  patch("contact", "phone", event.target.value)
                }
                disabled={!canManage}
              />
              <FormField
                label="WhatsApp number"
                value={form.contact.whatsapp || ""}
                onChange={(event) =>
                  patch("contact", "whatsapp", event.target.value)
                }
                hint="Digits only, with country code."
                disabled={!canManage}
              />
              <FormField
                label="Email"
                icon={Mail}
                type="email"
                value={form.contact.email || ""}
                onChange={(event) =>
                  patch("contact", "email", event.target.value)
                }
                disabled={!canManage}
              />
              <FormField
                label="Careers email"
                icon={Mail}
                type="email"
                value={form.contact.careersEmail || ""}
                onChange={(event) =>
                  patch("contact", "careersEmail", event.target.value)
                }
                disabled={!canManage}
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Address
              </label>
              <div className="space-y-2">
                {addressLines.map((line, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={line}
                        onChange={(event) => {
                          const next = [...addressLines];
                          next[index] = event.target.value;
                          patch("contact", "addressLines", next);
                        }}
                        disabled={!canManage}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        patch(
                          "contact",
                          "addressLines",
                          addressLines.filter((_, i) => i !== index)
                        )
                      }
                      disabled={!canManage}
                      aria-label="Remove address line"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {canManage && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Plus}
                  className="mt-2"
                  onClick={() =>
                    patch("contact", "addressLines", [...addressLines, ""])
                  }
                >
                  Add line
                </Button>
              )}
            </div>

            {/* HOURS */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Business hours
              </label>
              <div className="space-y-2">
                {hours.map((entry, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={entry.days || ""}
                      placeholder="Monday – Saturday"
                      onChange={(event) => {
                        const next = [...hours];
                        next[index] = { ...entry, days: event.target.value };
                        patch("contact", "hours", next);
                      }}
                      disabled={!canManage}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <input
                      value={entry.time || ""}
                      placeholder="9:00 AM – 6:30 PM"
                      onChange={(event) => {
                        const next = [...hours];
                        next[index] = { ...entry, time: event.target.value };
                        patch("contact", "hours", next);
                      }}
                      disabled={!canManage}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patch("contact", "hours", hours.filter((_, i) => i !== index))
                      }
                      disabled={!canManage}
                      aria-label="Remove hours row"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {canManage && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Plus}
                  className="mt-2"
                  onClick={() =>
                    patch("contact", "hours", [...hours, { days: "", time: "" }])
                  }
                >
                  Add hours
                </Button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Map embed URL"
                value={form.contact.mapEmbedUrl || ""}
                onChange={(event) =>
                  patch("contact", "mapEmbedUrl", event.target.value)
                }
                hint="Google Maps embed link used by the contact page."
                disabled={!canManage}
              />
              <FormField
                label="Directions URL"
                value={form.contact.directionsUrl || ""}
                onChange={(event) =>
                  patch("contact", "directionsUrl", event.target.value)
                }
                disabled={!canManage}
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "social" && (
        <div className="space-y-6">
          <Card
            title="Social profiles"
            description="These links drive the icon row in the site header and footer."
          >
            <SocialLinksEditor
              socials={form.socials || []}
              onChange={(socials) =>
                setForm((current) => ({ ...current, socials }))
              }
            />
          </Card>

          {canManage && (
            <Card
              title="Auto-post new blog posts"
              description="Push a post to social the moment it goes live."
            >
              <IntegrationsPanel
                settings={settings}
                onSaved={applyServerState}
                onError={setError}
              />
            </Card>
          )}

          <ShareHistory />
        </div>
      )}

      {activeTab === "seo" && (
        <Card
          title="Search & sharing defaults"
          description="Used when a page does not supply its own meta tags."
        >
          <div className="space-y-5">
            <FormField
              label="Default meta title"
              value={form.seo.metaTitle || ""}
              onChange={(event) => patch("seo", "metaTitle", event.target.value)}
              hint="Around 60 characters reads best in search results."
              disabled={!canManage}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Default meta description
              </label>
              <textarea
                rows={3}
                value={form.seo.metaDescription || ""}
                onChange={(event) =>
                  patch("seo", "metaDescription", event.target.value)
                }
                disabled={!canManage}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                {(form.seo.metaDescription || "").length} characters — aim for
                150–160.
              </p>
            </div>

            {form.seo.ogImageUrl && (
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Share image
                </p>
                <img
                  src={form.seo.ogImageUrl}
                  alt="Default sharing preview"
                  className="max-w-sm rounded-lg border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SiteSettings;
