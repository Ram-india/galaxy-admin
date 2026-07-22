import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import * as contentApi from "../../services/contentService";
import { JOB_TYPES, JOB_STATUSES } from "../../constants/content";
import { toDateInput } from "../../utils/format";

import FormField from "../ui/FormField";
import { toErrorMessage } from "../../utils/errorMessage";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const JobDialog = ({ job, onClose, onSaved }) => {
  const isEditing = Boolean(job);

  const [form, setForm] = useState({
    position: job?.position || "",
    department: job?.department || "",
    experience: job?.experience || "",
    location: job?.location || "",
    type: job?.type || "Full Time",
    status: job?.status || "Active",
    description: job?.description || "",
    posted: toDateInput(job?.posted) || toDateInput(new Date()),
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.position.trim()) {
      setError("A position title is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = isEditing
        ? await contentApi.updateJob(job._id, form)
        : await contentApi.createJob(form);

      onSaved(res.data.message);
      onClose();
    } catch (err) {
      setError(toErrorMessage(err, "Could not save the job."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isEditing ? "Edit job" : "Post a job"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Open roles appear on the careers page with an Apply button.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-5">
            {error && <Alert variant="error">{error}</Alert>}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Solar Technician"
                required
                className="sm:col-span-2"
              />

              <FormField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Installation"
              />

              <FormField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Chennai"
              />

              <FormField
                label="Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="1+ Years"
              />

              <div>
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Employment type
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {JOB_TYPES.map((type) => (
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
                  {JOB_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Posted on"
                name="posted"
                type="date"
                value={form.posted}
                onChange={handleChange}
                hint="Feeds datePosted in the job schema."
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
                placeholder="What the role involves, and what you are looking for."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving} icon={Save}>
              {isEditing ? "Save changes" : "Post job"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

const JobFormModal = ({ isOpen, job, ...props }) =>
  isOpen ? <JobDialog key={job?._id || "new"} job={job} {...props} /> : null;

export default JobFormModal;
