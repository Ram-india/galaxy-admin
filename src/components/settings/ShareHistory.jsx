import { useCallback, useEffect, useState } from "react";
import { ExternalLink, History, RefreshCw } from "lucide-react";

import * as settingsApi from "../../services/siteSettingsService";
import { SHARE_STATUS_STYLES, getPlatform } from "../../constants/socials";
import { formatDateTime } from "../../utils/format";

import Button from "../ui/Button";

/** Recent auto-post attempts, including the skipped ones and why. */
const ShareHistory = () => {
  const [shares, setShares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await settingsApi.getShareHistory(20);
      setShares(res.data.shares || []);
    } catch (error) {
      console.error("Could not load share history", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      await load();
    };

    loadHistory();
  }, [load]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent shares
          </h3>
        </div>

        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={load}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <p className="px-5 py-10 text-center text-sm text-slate-400">
          Loading history...
        </p>
      ) : shares.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          No posts have been shared yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {shares.map((share) => {
            const platform = getPlatform(share.platform);

            return (
              <li key={share._id} className="flex items-start gap-3 px-5 py-3.5">
                {platform && (
                  <platform.icon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${platform.brandClass}`}
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {share.blogTitle || "Untitled post"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(share.createdAt)}
                    {share.detail && ` · ${share.detail}`}
                  </p>
                </div>

                {share.postUrl && (
                  <a
                    href={share.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                    aria-label="Open the published post"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    SHARE_STATUS_STYLES[share.status] ||
                    SHARE_STATUS_STYLES.pending
                  }`}
                >
                  {share.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShareHistory;
