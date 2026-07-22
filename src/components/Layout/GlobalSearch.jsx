import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Briefcase, FileText, CornerDownLeft } from "lucide-react";

import { getAllProjects } from "../../services/projectService";
import { getAllEnquiries } from "../../services/enquiryService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";

const MAX_PER_GROUP = 5;

/**
 * Command-palette search across projects and enquiries.
 *
 * Records are fetched once when the palette first opens and filtered in memory
 * — there is no search endpoint, and the collections are small. Only the
 * sources the current role may read are requested.
 */
const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const canSeeProjects = hasPermission(PERMISSIONS.PROJECT_VIEW);
  const canSeeEnquiries = hasPermission(PERMISSIONS.ENQUIRY_VIEW);

  const [query, setQuery] = useState("");
  const [data, setData] = useState(null); // null until the first load
  const [activeIndex, setActiveIndex] = useState(0);

  // Derived rather than stored: we are loading exactly while the palette is
  // open and the records have not arrived. Keeps the effect setState-free.
  const isLoading = isOpen && !data;

  const inputRef = useRef(null);

  // Load once per mount of the open palette, then reuse
  useEffect(() => {
    if (!isOpen || data) return undefined;

    let isStale = false;

    const loadRecords = async () => {
      const [projects, enquiries] = await Promise.all([
        canSeeProjects ? getAllProjects().catch(() => null) : null,
        canSeeEnquiries ? getAllEnquiries().catch(() => null) : null,
      ]);

      if (isStale) return;

      setData({
        projects: Array.isArray(projects?.data) ? projects.data : [],
        enquiries: Array.isArray(enquiries?.data) ? enquiries.data : [],
      });
    };

    loadRecords();

    return () => {
      isStale = true;
    };
  }, [isOpen, data, canSeeProjects, canSeeEnquiries]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  /** Flat, keyboard-navigable result list grouped by source. */
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || !data) return [];

    const matches = (haystack) =>
      haystack.filter(Boolean).join(" ").toLowerCase().includes(term);

    const projects = data.projects
      .filter((item) =>
        matches([item.projectName, item.clientName, item.location])
      )
      .slice(0, MAX_PER_GROUP)
      .map((item) => ({
        id: `project-${item._id}`,
        group: "Projects",
        icon: Briefcase,
        title: item.projectName,
        subtitle: [item.clientName, item.location].filter(Boolean).join(" · "),
        to: `/projects/${item._id}`,
      }));

    const enquiries = data.enquiries
      .filter((item) => matches([item.fullName, item.phone, item.email]))
      .slice(0, MAX_PER_GROUP)
      .map((item) => ({
        id: `enquiry-${item._id}`,
        group: "Enquiries",
        icon: FileText,
        title: item.fullName,
        subtitle: [item.phone, item.projectType].filter(Boolean).join(" · "),
        to: `/enquiries/${item._id}`,
      }));

    return [...projects, ...enquiries];
  }, [query, data]);

  // Keep the highlight in range as results change under it
  const safeIndex = Math.min(activeIndex, Math.max(0, results.length - 1));

  const handleSelect = (result) => {
    onClose();
    setQuery("");
    navigate(result.to);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(1, results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + results.length) % Math.max(1, results.length)
      );
    } else if (event.key === "Enter" && results[safeIndex]) {
      event.preventDefault();
      handleSelect(results[safeIndex]);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  let lastGroup = null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* INPUT */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects and enquiries..."
            className="w-full bg-transparent py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" />
          )}
          <kbd className="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-700 sm:block">
            ESC
          </kbd>
        </div>

        {/* RESULTS */}
        <div className="max-h-80 overflow-y-auto py-2">
          {!query.trim() ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              Start typing to search across your workspace.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              {isLoading ? "Searching..." : `No matches for "${query}"`}
            </p>
          ) : (
            results.map((result, index) => {
              const showGroupLabel = result.group !== lastGroup;
              lastGroup = result.group;

              return (
                <div key={result.id}>
                  {showGroupLabel && (
                    <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {result.group}
                    </p>
                  )}

                  <button
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      index === safeIndex
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <result.icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                        {result.title}
                      </span>
                      {result.subtitle && (
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {result.subtitle}
                        </span>
                      )}
                    </span>

                    {index === safeIndex && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* HINTS */}
        <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>↑↓ to navigate</span>
          <span>↵ to open</span>
          <span className="ml-auto">esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
