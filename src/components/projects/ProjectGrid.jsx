import { ImageIcon, MapPin, User, Zap, Images } from "lucide-react";

import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectActionsMenu from "./ProjectActionsMenu";
import { GridSkeleton } from "./ProjectSkeletons";
import { formatDate } from "../../utils/format";

/**
 * Gallery view — the default, since every project carries photos.
 * Also the only view rendered on small screens.
 */
const ProjectGrid = ({
  projects,
  isLoading,
  onView,
  onEdit,
  onDelete,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <GridSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${className}`}
    >
      {projects.map((project) => {
        const images = project.images || [];
        const cover = images[0];

        return (
          <article
            key={project._id}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            {/* COVER */}
            <button
              onClick={() => onView(project)}
              className="relative block h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
            >
              {cover ? (
                <img
                  src={cover}
                  alt={project.projectName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
                  <ImageIcon className="h-10 w-10" />
                </span>
              )}

              <span className="absolute left-3 top-3">
                <ProjectStatusBadge status={project.status} />
              </span>

              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                  <Images className="h-3 w-3" />
                  {images.length}
                </span>
              )}
            </button>

            {/* BODY */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => onView(project)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {project.projectName}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {project.projectType}
                  </p>
                </button>

                <ProjectActionsMenu
                  onView={() => onView(project)}
                  onEdit={onEdit ? () => onEdit(project) : null}
                  onDelete={onDelete ? () => onDelete(project) : null}
                />
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <dd className="truncate">{project.clientName || "—"}</dd>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <dd className="truncate">{project.location || "—"}</dd>
                </div>
              </dl>

              {/* FOOTER pinned to the bottom so cards align in a row */}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  {project.capacity || "—"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(project.startDate)}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProjectGrid;
