import { ImageIcon } from "lucide-react";

import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectActionsMenu from "./ProjectActionsMenu";
import { TableSkeleton } from "./ProjectSkeletons";
import { formatDate } from "../../utils/format";

const headerClass =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

/**
 * Dense list view. Hidden below `lg` — the grid serves small screens.
 */
const ProjectTable = ({ projects, isLoading, onView, onEdit, onDelete }) => (
  <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
    {/* max-h + overflow keeps the header sticky while the body scrolls */}
    <div className="max-h-[640px] overflow-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-50 shadow-[inset_0_-1px_0_0_rgb(226_232_240)] dark:bg-slate-800 dark:shadow-[inset_0_-1px_0_0_rgb(30_41_59)]">
          <tr>
            <th className={headerClass}>Project</th>
            <th className={headerClass}>Client</th>
            <th className={headerClass}>Capacity</th>
            <th className={headerClass}>Location</th>
            <th className={headerClass}>Timeline</th>
            <th className={headerClass}>Status</th>
            <th className={`${headerClass} text-right`}>Actions</th>
          </tr>
        </thead>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {projects.map((project, index) => (
              <tr
                key={project._id}
                onDoubleClick={() => onView(project)}
                className={`transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50 ${
                  // Zebra striping, overridden by hover above
                  index % 2 === 1 ? "bg-slate-50/60 dark:bg-slate-800/20" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {project.images?.[0] ? (
                      <img
                        src={project.images[0]}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                        <ImageIcon className="h-5 w-5" />
                      </span>
                    )}

                    <div className="min-w-0">
                      <button
                        onClick={() => onView(project)}
                        className="block max-w-[16rem] truncate text-left text-sm font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {project.projectName}
                      </button>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {project.projectType}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {project.clientName || "—"}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                  {project.capacity || "—"}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {project.location || "—"}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(project.startDate)}
                  <span className="mx-1 text-slate-300 dark:text-slate-600">→</span>
                  {formatDate(project.completionDate)}
                </td>

                <td className="px-4 py-3">
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ProjectActionsMenu
                      onView={() => onView(project)}
                      onEdit={onEdit ? () => onEdit(project) : null}
                      onDelete={onDelete ? () => onDelete(project) : null}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  </div>
);

export default ProjectTable;
