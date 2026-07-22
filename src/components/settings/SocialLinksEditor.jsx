import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";

import { SOCIAL_PLATFORMS, getPlatform } from "../../constants/socials";

/**
 * Editor for the social profile links shown on the website.
 *
 * Order matters (it drives the icon row), so rows can be moved rather than
 * dragged — simpler and keyboard-accessible.
 */
const SocialLinksEditor = ({ socials, onChange }) => {
  /** Every platform, whether or not it has a row yet. */
  const rows = SOCIAL_PLATFORMS.map((platform, index) => {
    const existing = socials.find((item) => item.platform === platform.key);

    return (
      existing || {
        platform: platform.key,
        url: "",
        isEnabled: false,
        order: socials.length + index,
      }
    );
  }).sort((a, b) => a.order - b.order);

  const update = (platformKey, patch) =>
    onChange(
      rows.map((row) =>
        row.platform === platformKey ? { ...row, ...patch } : row
      )
    );

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    onChange(reordered.map((row, position) => ({ ...row, order: position })));
  };

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const platform = getPlatform(row.platform);
        const Icon = platform.icon;

        return (
          <div
            key={row.platform}
            className={`flex flex-col gap-3 rounded-xl border p-3 transition-colors sm:flex-row sm:items-center ${
              row.isEnabled
                ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                : "border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
            }`}
          >
            <div className="flex items-center gap-2.5 sm:w-40">
              <Icon className={`h-5 w-5 shrink-0 ${platform.brandClass}`} />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {platform.label}
              </span>
              {platform.canAutoPost && (
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  auto-post
                </span>
              )}
            </div>

            <input
              type="url"
              value={row.url}
              onChange={(event) =>
                update(row.platform, { url: event.target.value })
              }
              placeholder={platform.placeholder}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  update(row.platform, { isEnabled: !row.isEnabled })
                }
                aria-label={
                  row.isEnabled
                    ? `Hide ${platform.label} on the website`
                    : `Show ${platform.label} on the website`
                }
                title={row.isEnabled ? "Visible on site" : "Hidden"}
                className={`rounded-lg p-2 transition-colors ${
                  row.isEnabled
                    ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {row.isEnabled ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${platform.label} up`}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
              >
                <ArrowUp className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label={`Move ${platform.label} down`}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Only links that are switched on and have a URL appear on the website.
      </p>
    </div>
  );
};

export default SocialLinksEditor;
