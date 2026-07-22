import { useEffect, useState } from "react";
import { X, Upload, Save, Trash2, ImageIcon } from "lucide-react";

import {
  EMPTY_PROJECT_FORM,
  PROJECT_STATUSES,
  PROJECT_TYPES,
} from "../../constants/projects";
import { toDateInput } from "../../utils/format";

import FormField from "../ui/FormField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const MAX_IMAGES = 10;

/** Builds the form state for an existing project, or a blank one. */
const toFormState = (project) =>
  project
    ? {
        projectName: project.projectName || "",
        clientName: project.clientName || "",
        capacity: project.capacity || "",
        location: project.location || "",
        projectType: project.projectType || "Rooftop",
        status: project.status || "Pending",
        startDate: toDateInput(project.startDate),
        completionDate: toDateInput(project.completionDate),
        description: project.description || "",
        newImages: [],
        existingImages: project.images || [],
        removedImages: [],
      }
    : { ...EMPTY_PROJECT_FORM };

const ProjectFormDialog = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState(() => toFormState(project));
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(project);

  // Object URLs are per-file allocations; release them when they change
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const room = MAX_IMAGES - (form.existingImages.length + form.newImages.length);
    if (room <= 0) {
      setError(`A project can hold at most ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const accepted = files.slice(0, room);
    setForm((current) => ({
      ...current,
      newImages: [...current.newImages, ...accepted],
    }));
    setPreviews((current) => [
      ...current,
      ...accepted.map((file) => URL.createObjectURL(file)),
    ]);

    if (accepted.length < files.length) {
      setError(`Only ${accepted.length} image(s) added — the limit is ${MAX_IMAGES}.`);
    }

    // Reset so re-picking the same file still fires a change event
    event.target.value = "";
  };

  /** Existing images are queued for deletion so the server can clean up. */
  const removeExistingImage = (url) =>
    setForm((current) => ({
      ...current,
      existingImages: current.existingImages.filter((item) => item !== url),
      removedImages: [...current.removedImages, url],
    }));

  const removeNewImage = (index) => {
    setForm((current) => ({
      ...current,
      newImages: current.newImages.filter((_, i) => i !== index),
    }));
    setPreviews((current) => {
      URL.revokeObjectURL(current[index]);
      return current.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.projectName.trim() || !form.clientName.trim()) {
      setError("Project name and client name are required.");
      return;
    }

    if (
      form.startDate &&
      form.completionDate &&
      new Date(form.completionDate) < new Date(form.startDate)
    ) {
      setError("The completion date cannot be before the start date.");
      return;
    }

    setIsSaving(true);
    setError("");

    // multipart, because new images travel with the fields
    const payload = new FormData();
    [
      "projectName",
      "clientName",
      "capacity",
      "location",
      "projectType",
      "status",
      "startDate",
      "completionDate",
      "description",
    ].forEach((key) => payload.append(key, form[key] || ""));

    form.newImages.forEach((file) => payload.append("images", file));

    // Tell the server which existing images to keep and which to delete
    if (isEditing) {
      form.existingImages.forEach((url) => payload.append("existingImages", url));
      form.removedImages.forEach((url) => payload.append("removedImages", url));
    }

    try {
      await onSave(payload, project?._id);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not save the project. Please retry."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const imageCount = form.existingImages.length + form.newImages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isEditing ? "Edit project" : "New project"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update the details or manage the photo gallery."
                : "Add a project to your portfolio."}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {error && <Alert variant="error">{error}</Alert>}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Project name"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="150 kW Rooftop — Acme Industries"
                required
              />

              <FormField
                label="Client name"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                placeholder="Acme Industries"
                required
              />

              <FormField
                label="Capacity"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="150 kW"
                hint="Include the unit, e.g. 150 kW"
              />

              <FormField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Coimbatore, Tamil Nadu"
              />

              <div>
                <label
                  htmlFor="projectType"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Project type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Start date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />

              <FormField
                label="Completion date"
                name="completionDate"
                type="date"
                value={form.completionDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Scope of work, panel and inverter details, anything worth remembering."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* GALLERY */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Photos
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {imageCount} / {MAX_IMAGES}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {/* Already uploaded */}
                {form.existingImages.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 rounded-md bg-slate-900/70 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 max-lg:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Staged for upload */}
                {previews.map((url, index) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-blue-300 dark:border-blue-500/50"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 rounded-md bg-slate-900/70 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 max-lg:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {imageCount < MAX_IMAGES && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-slate-700">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs font-medium">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {imageCount === 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <ImageIcon className="h-3.5 w-3.5" />
                  No photos yet — the first one becomes the cover image.
                </p>
              )}
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving} icon={Save}>
              {isEditing ? "Save changes" : "Create project"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

/**
 * `isOpen === false` keeps the dialog unmounted. Keying on the project id gives
 * each project a freshly initialised form instead of syncing state in an effect.
 */
const ProjectFormModal = ({ isOpen, project, ...props }) =>
  isOpen ? (
    <ProjectFormDialog key={project?._id || "new"} project={project} {...props} />
  ) : null;

export default ProjectFormModal;
