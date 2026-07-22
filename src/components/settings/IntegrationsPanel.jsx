import { useState } from "react";
import { CheckCircle2, Link2, Link2Off, Loader2, Send } from "lucide-react";

import { AUTO_POST_PLATFORMS } from "../../constants/socials";
import * as settingsApi from "../../services/siteSettingsService";

import Button from "../ui/Button";
import Alert from "../ui/Alert";

const TARGET_HINTS = {
  linkedin: {
    label: "Organization URN",
    placeholder: "urn:li:organization:12345678",
    help: "From your LinkedIn Page admin URL. Requires an app with the Community Management API and a token holding w_organization_social.",
  },
  facebook: {
    label: "Page ID",
    placeholder: "1234567890",
    help: "Your Facebook Page ID with a long-lived Page access token holding pages_manage_posts.",
  },
};

/** One platform's credential form. */
const IntegrationCard = ({ platform, status, onSaved, onError }) => {
  const [accessToken, setAccessToken] = useState("");
  const [targetId, setTargetId] = useState(status?.targetId || "");
  const [isSaving, setIsSaving] = useState(false);

  const hints = TARGET_HINTS[platform.key];
  const Icon = platform.icon;

  const save = async (payload, successFallback) => {
    setIsSaving(true);
    try {
      const res = await settingsApi.updateIntegration(platform.key, payload);
      setAccessToken("");
      onSaved(res.data.settings, res.data.message || successFallback);
    } catch (err) {
      onError(
        err?.response?.data?.message || "Could not save that connection."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className={`h-6 w-6 ${platform.brandClass}`} />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {platform.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {status?.isConfigured ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>

        {status?.isConfigured && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
            {hints.label}
          </label>
          <input
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            placeholder={hints.placeholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
            Access token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(event) => setAccessToken(event.target.value)}
            placeholder={
              status?.isConfigured
                ? "•••••••• (leave blank to keep the saved token)"
                : "Paste the access token"
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {/* The token is write-only: it is never sent back to the browser */}
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {hints.help}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            isLoading={isSaving}
            icon={Link2}
            onClick={() =>
              save(
                { accessToken: accessToken || undefined, targetId, isEnabled: true },
                "Connection saved."
              )
            }
            disabled={!targetId || (!accessToken && !status?.isConfigured)}
          >
            {status?.isConfigured ? "Update connection" : "Connect"}
          </Button>

          {status?.isConfigured && (
            <Button
              size="sm"
              variant="secondary"
              icon={Link2Off}
              onClick={() => save({ accessToken: "" }, "Disconnected.")}
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Auto-posting configuration.
 *
 * Credentials are entered by hand rather than through an OAuth flow: both
 * platforms require a reviewed developer app to issue tokens, which is a
 * one-off setup the owner does on their side.
 */
const IntegrationsPanel = ({ settings, onSaved, onError }) => {
  const [isSharing, setIsSharing] = useState(false);

  const autoPost = settings.autoPost || {};

  const toggleAutoPost = async (patch) => {
    setIsSharing(true);
    try {
      const res = await settingsApi.updateSiteSettings({
        autoPost: { ...autoPost, ...patch },
      });
      onSaved(res.data.settings, "Auto-posting updated.");
    } catch (err) {
      onError(err?.response?.data?.message || "Could not update auto-posting.");
    } finally {
      setIsSharing(false);
    }
  };

  const togglePlatform = (key) => {
    const current = autoPost.platforms || [];
    const platforms = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];

    toggleAutoPost({ platforms });
  };

  return (
    <div className="space-y-6">
      <Alert variant="info">
        Auto-posting needs a developer app on each platform. Until a token is
        saved here, publishing a post records the attempt as{" "}
        <strong>skipped</strong> with the reason — nothing fails silently.
      </Alert>

      {/* MASTER SWITCH */}
      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Share new posts automatically
            </p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              When a blog post moves to Published, push it to the selected
              platforms.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={Boolean(autoPost.isEnabled)}
            disabled={isSharing}
            onClick={() => toggleAutoPost({ isEnabled: !autoPost.isEnabled })}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              autoPost.isEnabled
                ? "bg-blue-600"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                autoPost.isEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {autoPost.isEnabled && (
          <div className="mt-4 flex flex-wrap gap-2">
            {AUTO_POST_PLATFORMS.map((platform) => {
              const isOn = (autoPost.platforms || []).includes(platform.key);

              return (
                <button
                  key={platform.key}
                  type="button"
                  onClick={() => togglePlatform(platform.key)}
                  disabled={isSharing}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isOn
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <platform.icon className="h-4 w-4" />
                  {platform.label}
                  {isSharing && <Loader2 className="h-3 w-3 animate-spin" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
            Message template
          </label>
          <textarea
            rows={3}
            defaultValue={autoPost.messageTemplate}
            onBlur={(event) =>
              event.target.value !== autoPost.messageTemplate &&
              toggleAutoPost({ messageTemplate: event.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Send className="h-3 w-3" />
            {"{title}"}, {"{excerpt}"} and {"{url}"} are replaced when posting.
          </p>
        </div>
      </div>

      {/* CREDENTIALS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {AUTO_POST_PLATFORMS.map((platform) => (
          <IntegrationCard
            key={platform.key}
            platform={platform}
            status={settings.integrations?.[platform.key]}
            onSaved={onSaved}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPanel;
