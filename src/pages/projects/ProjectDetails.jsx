import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  MapPin,
  Pencil,
  Sun,
  User,
  Zap,
} from "lucide-react";

import { getProjects, updateProject } from "../../services/projectService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import { formatDate, formatDateTime } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";
import ProjectFormModal from "../../components/projects/ProjectFormModal";
import { DetailsSkeleton } from "../../components/projects/ProjectSkeletons";

/** Card wrapper shared by every section. */
const Section = ({ title, icon: Icon, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header className="flex items-center gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <Icon className="h-4 w-4 text-slate-400" />
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
    </header>
    <div className="px-6 py-5">{children}</div>
  </section>
);

const Field = ({ icon: Icon, label, value }) => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
      {value || "—"}
    </p>
  </div>
);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const canUpdate = hasPermission(PERMISSIONS.PROJECT_UPDATE);

  const [project, setProject] = useState(null);
  // Errors are tagged with the id they belong to, so navigating to another
  // project automatically clears the previous failure.
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Derived instead of stored: loading until data (or an error) for this exact
  // id has arrived. Keeps the effect free of setState calls.
  const isLoading = project?._id !== id && error?.id !== id;

  // Tracks the id currently on screen so a slow response for a project we have
  // navigated away from is discarded instead of overwriting the new one.
  const latestIdRef = useRef(id);

  const loadProject = useCallback(async () => {
    try {
      const res = await getProjects(id);
      if (latestIdRef.current !== id) return;

      setProject(res.data);
      setImageIndex(0);
    } catch (err) {
      if (latestIdRef.current !== id) return;

      console.error("Error loading project", err);
      setError({
        id,
        message:
          err?.response?.status === 404
            ? "This project no longer exists."
            : "Unable to load this project. Please try again.",
      });
    }
  }, [id]);

  useEffect(() => {
    latestIdRef.current = id;

    const fetchProject = async () => {
      await loadProject();
    };

    fetchProject();
  }, [id, loadProject]);

  const handleSave = async (payload, projectId) => {
    await updateProject(projectId, payload);
    await loadProject();
  };

  if (isLoading) return <DetailsSkeleton />;

  if (error?.id === id) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {error.message}
        </p>
        <Button className="mt-5" icon={ArrowLeft} onClick={() => navigate("/projects")}>
          Back to projects
        </Button>
      </div>
    );
  }

  const images = project.images || [];
  const showPrevious = () =>
    setImageIndex((index) => (index - 1 + images.length) % images.length);
  const showNext = () =>
    setImageIndex((index) => (index + 1) % images.length);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Projects", to: "/projects" },
          { label: project.projectName },
        ]}
        title={project.projectName}
        subtitle={`Added ${formatDateTime(project.createdAt)}`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => navigate("/projects")}
            >
              <span className="hidden sm:inline">Back</span>
            </Button>

            {canUpdate && (
              <Button icon={Pencil} onClick={() => setIsFormOpen(true)}>
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------------------------- main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* GALLERY */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[imageIndex]}
                    alt={`${project.projectName} — ${imageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={showPrevious}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition-transform hover:scale-105 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={showNext}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition-transform hover:scale-105 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                        {imageIndex + 1} / {images.length}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-600">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm">No photos for this project</p>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      index === imageIndex
                        ? "border-blue-500"
                        : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <Section title="Description" icon={FileText}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {project.description || "No description was provided."}
            </p>
          </Section>
        </div>

        {/* ---------------------------------------------- sidebar column */}
        <div className="space-y-6">
          <Section title="Project details" icon={Sun}>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Status
                </p>
                <div className="mt-2">
                  <ProjectStatusBadge status={project.status} />
                </div>
              </div>

              <Field icon={User} label="Client" value={project.clientName} />
              <Field icon={Zap} label="Capacity" value={project.capacity} />
              <Field icon={Sun} label="Type" value={project.projectType} />
              <Field icon={MapPin} label="Location" value={project.location} />
            </div>
          </Section>

          <Section title="Timeline" icon={Calendar}>
            <div className="space-y-5">
              <Field
                icon={Calendar}
                label="Start date"
                value={formatDate(project.startDate)}
              />
              <Field
                icon={Calendar}
                label="Completion date"
                value={formatDate(project.completionDate)}
              />
              <Field
                icon={Calendar}
                label="Last updated"
                value={formatDateTime(project.updatedAt)}
              />
            </div>
          </Section>
        </div>
      </div>

      <ProjectFormModal
        isOpen={isFormOpen}
        project={project}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProjectDetails;
