import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, FolderOpen, FilterX } from "lucide-react";

import useProjects from "../../hooks/useProjects";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import { PROJECT_PAGE_SIZE } from "../../constants/projects";

import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import ProjectStats from "../../components/projects/ProjectStats";
import ProjectFilters from "../../components/projects/ProjectFilters";
import ProjectGrid from "../../components/projects/ProjectGrid";
import ProjectTable from "../../components/projects/ProjectTable";
import ProjectFormModal from "../../components/projects/ProjectFormModal";

const VIEW_KEY = "projects:view";

const ProjectList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasPermission } = useAuth();

  // Read-only roles see the portfolio without the write actions
  const canCreate = hasPermission(PERMISSIONS.PROJECT_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.PROJECT_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.PROJECT_DELETE);

  const {
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
    setCurrentPage,
    refresh,
    saveProject,
    removeProject,
  } = useProjects();

  // The chosen view outlives a reload — it is a preference, not page state
  const [view, setView] = useState(
    () => localStorage.getItem(VIEW_KEY) || "grid"
  );
  const [editing, setEditing] = useState(null); // project being edited
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const changeView = (next) => {
    setView(next);
    localStorage.setItem(VIEW_KEY, next);
  };

  // The create form is driven by ?new=1 so the header button works even when
  // this page is already mounted, and the form survives a deep link.
  const isCreateOpen = canCreate && searchParams.get("new") === "1";
  const isFormOpen = isCreateOpen || Boolean(editing);

  const handleView = (project) => navigate(`/projects/${project._id}`);

  const openCreate = () => {
    setEditing(null);
    setSearchParams({ new: "1" });
  };

  const openEdit = (project) => setEditing(project);

  const closeForm = () => {
    setEditing(null);

    if (isCreateOpen) {
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleSave = async (payload, projectId) => {
    await saveProject(payload, projectId);
    setNotice(projectId ? "Project updated." : "Project created.");
    setActionError("");
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.projectName}"? Its photos will be removed too. This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await removeProject(project._id);
      setNotice("Project deleted.");
      setActionError("");
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Could not delete that project."
      );
    }
  };

  // Props shared by both views
  const listProps = {
    projects: paginatedProjects,
    isLoading,
    onView: handleView,
    onEdit: canUpdate ? openEdit : null,
    onDelete: canDelete ? handleDelete : null,
  };

  const isEmpty = !isLoading && paginatedProjects.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Projects" },
        ]}
        title="Projects"
        subtitle="Every installation in your portfolio, from enquiry to commissioning."
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        actions={
          canCreate && (
            <Button icon={Plus} onClick={openCreate}>
              <span className="hidden sm:inline">New project</span>
            </Button>
          )
        }
      />

      {error && <Alert variant="error">{error}</Alert>}
      {actionError && (
        <Alert variant="error" onDismiss={() => setActionError("")}>
          {actionError}
        </Alert>
      )}
      {notice && (
        <Alert variant="success" onDismiss={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <ProjectStats stats={stats} />

      <ProjectFilters
        filters={filters}
        onChange={updateFilter}
        onClear={clearFilters}
        isFiltered={isFiltered}
        view={view}
        onViewChange={changeView}
      />

      {isEmpty ? (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            icon={isFiltered ? FilterX : FolderOpen}
            title={isFiltered ? "No matching projects" : "No projects yet"}
            description={
              isFiltered
                ? "No projects match your current search and filters. Try adjusting them."
                : "Add your first installation to start building the portfolio."
            }
            action={
              isFiltered ? (
                <Button variant="secondary" icon={FilterX} onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                canCreate && (
                  <Button icon={Plus} onClick={openCreate}>
                    New project
                  </Button>
                )
              )
            }
          />
        </div>
      ) : (
        <>
          {/* The table is desktop-only; the grid covers every breakpoint */}
          {view === "list" ? (
            <>
              <ProjectTable {...listProps} />
              <ProjectGrid {...listProps} className="lg:hidden" />
            </>
          ) : (
            <ProjectGrid {...listProps} />
          )}
        </>
      )}

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProjects.length}
          pageSize={PROJECT_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      <ProjectFormModal
        isOpen={isFormOpen}
        project={editing}
        onClose={closeForm}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProjectList;
