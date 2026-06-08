import {
  Eye,
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,

  
} from "lucide-react";
import { Link } from "react-router-dom";

const statusColor = {
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Ongoing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Pending: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const ProjectTable = ({ projects, onEdit, onDelete, sortConfig, onSort }) => {
  const renderSortIcon = (field) => (
    <span className="inline-flex items-center ml-2">
      {sortConfig?.key === field ? (
        sortConfig.direction === "asc" ? (
          <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )
      ) : (
        <ChevronDown className="w-4 h-4 opacity-30" />
      )}
    </span>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
      <div className="overflow-x-auto">
        <table className="w-full text-slate-900 dark:text-slate-100">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 text-slate-700 dark:text-slate-200">
            <tr>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("projectName")}
              >
                <div className="flex items-center gap-2">
                  Project
                  {renderSortIcon("projectName")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("clientName")}
              >
                <div className="flex items-center gap-2">
                  Client
                  {renderSortIcon("clientName")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("capacity")}
              >
                <div className="flex items-center gap-2">
                  Capacity
                  {renderSortIcon("capacity")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("projectType")}
              >
                <div className="flex items-center gap-2">
                  Type
                  {renderSortIcon("projectType")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("location")}
              >
                <div className="flex items-center gap-2">
                  Location
                  {renderSortIcon("location")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("startDate")}
              >
                <div className="flex items-center gap-2">
                  Start Date
                  {renderSortIcon("startDate")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("completionDate")}
              >
                <div className="flex items-center gap-2">
                  End Date
                  {renderSortIcon("completionDate")}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {renderSortIcon("status")}
                </div>
              </th>
              <th className="p-4 text-left font-semibold text-slate-700 dark:text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {projects.map((project) => (
              <tr
                key={project._id || project.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 flex items-center gap-3">
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.projectName}
                      className="w-16 h-16 object-cover rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                      No img
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{project.projectName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {project.location || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-200 font-medium">{project.clientName}</td>
                <td className="p-4 text-slate-700 dark:text-slate-200">{project.capacity}</td>
                <td className="p-4 text-slate-700 dark:text-slate-200">{project.projectType}</td>
                <td className="p-4 text-slate-700 dark:text-slate-200">{project.location}</td>
                <td className="p-4 text-slate-700 dark:text-slate-200">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-200">
                  {project.completionDate
                    ? new Date(project.completionDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[project.status]}`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Link to={`/projects/${project._id}`}>
                      <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </Link>
                    </button>
                    <button onClick={() => onEdit(project)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button onClick={() => onDelete(project._id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;