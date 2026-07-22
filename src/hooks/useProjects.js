import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject as deleteProjectRequest,
} from "../services/projectService";
import { PROJECT_PAGE_SIZE } from "../constants/projects";

const DEFAULT_FILTERS = {
  search: "",
  projectType: "all",
  status: "all",
  sort: "createdAt:desc",
};

/**
 * Owns the project list: fetching, filtering, sorting, pagination and the
 * create/update/delete mutations.
 *
 * Filtering and paging are client-side because the API returns the whole
 * collection. Move them into query params if the dataset outgrows that.
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [requestedPage, setRequestedPage] = useState(1);

  // Every state update happens after the await, so this is safe to call
  // straight from an effect without triggering a cascading render.
  const fetchProjects = useCallback(async () => {
    try {
      const res = await getAllProjects();
      setProjects(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching projects", err);
      setError(
        err?.response?.data?.message || "Unable to load projects. Please retry."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialProjects = async () => {
      await fetchProjects();
    };

    loadInitialProjects();
  }, [fetchProjects]);

  /** Re-fetches in the background, keeping the current rows on screen. */
  const refresh = () => {
    setIsRefreshing(true);
    fetchProjects();
  };

  /* ---------------------------------------------------------------- stats */

  const stats = useMemo(
    () => ({
      total: projects.length,
      pending: projects.filter((item) => item.status === "Pending").length,
      ongoing: projects.filter((item) => item.status === "Ongoing").length,
      completed: projects.filter((item) => item.status === "Completed").length,
      // Total installed capacity, parsed leniently from free-text values
      // like "5 kW" or "12.5kw"
      capacity: projects.reduce((sum, item) => {
        const parsed = parseFloat(String(item.capacity ?? "").replace(/[^\d.]/g, ""));
        return sum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0),
    }),
    [projects]
  );

  /* ------------------------------------------------------------- filtering */

  const isFiltered = useMemo(
    () =>
      ["search", "projectType", "status"].some(
        (key) => filters[key] !== DEFAULT_FILTERS[key]
      ),
    [filters]
  );

  const filteredProjects = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const [sortKey, sortDirection] = filters.sort.split(":");

    const matches = projects.filter((project) => {
      if (query) {
        const haystack = [
          project.projectName,
          project.clientName,
          project.location,
          project.capacity,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (
        filters.projectType !== "all" &&
        project.projectType !== filters.projectType
      ) {
        return false;
      }

      if (filters.status !== "all" && project.status !== filters.status) {
        return false;
      }

      return true;
    });

    const order = sortDirection === "asc" ? 1 : -1;
    const isDateKey = ["createdAt", "startDate", "completionDate"].includes(
      sortKey
    );

    return [...matches].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];

      if (isDateKey) {
        // Missing dates sort last regardless of direction
        if (!left && !right) return 0;
        if (!left) return 1;
        if (!right) return -1;
        return (new Date(left) - new Date(right)) * order;
      }

      return (
        String(left ?? "").localeCompare(String(right ?? ""), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * order
      );
    });
  }, [projects, filters]);

  /* ------------------------------------------------------------ pagination */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECT_PAGE_SIZE)
  );

  // Derived rather than stored, so a filter that shrinks the result set
  // cannot strand us on a page that no longer exists.
  const currentPage = Math.min(requestedPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECT_PAGE_SIZE;
    return filteredProjects.slice(start, start + PROJECT_PAGE_SIZE);
  }, [filteredProjects, currentPage]);

  /* ------------------------------------------------------------- mutations */

  const saveProject = async (payload, projectId) => {
    const res = projectId
      ? await updateProject(projectId, payload)
      : await createProject(payload);

    // The API nests the document under `project`; refetch so ordering and any
    // server-side defaults are reflected exactly.
    await fetchProjects();
    return res.data?.project || res.data;
  };

  const removeProject = async (id) => {
    await deleteProjectRequest(id);
    setProjects((current) => current.filter((project) => project._id !== id));
  };

  /* ---------------------------------------------------------------- filter */

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setRequestedPage(1); // a changed filter invalidates the current page
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setRequestedPage(1);
  };

  return {
    projects,
    filteredProjects,
    paginatedProjects,
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,
    isFiltered,
    updateFilter,
    clearFilters,
    currentPage,
    totalPages,
    setCurrentPage: setRequestedPage,
    refresh,
    saveProject,
    removeProject,
  };
};

export default useProjects;
