import { useEffect, useState } from "react";
import { X, Save, Star, Upload } from "lucide-react";

import * as contentApi from "../../services/contentService";

import FormField from "../ui/FormField";
import { toErrorMessage } from "../../utils/errorMessage";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import UserAvatar from "../team/UserAvatar";

const TestimonialDialog = ({ testimonial, onClose, onSaved }) => {
  const isEditing = Boolean(testimonial);

  const [form, setForm] = useState({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    company: testimonial?.company || "",
    message: testimonial?.message || "",
    rating: testimonial?.rating ?? 5,
    isActive: testimonial?.isActive ?? true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!preview) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

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

  const handleFile = (event) => {
    const chosen = event.target.files?.[0];
    if (!chosen) return;

    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      setError("A client name and their quote are both required.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (file) payload.append("avatar", file);

    try {
      const res = isEditing
        ? await contentApi.updateTestimonial(testimonial._id, payload)
        : await contentApi.createTestimonial(payload);

      onSaved(res.data.message);
      onClose();
    } catch (err) {
      setError(
        toErrorMessage(err, "Could not save the testimonial.")
      );
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

      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isEditing ? "Edit testimonial" : "New testimonial"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Shown in the testimonials carousel on the homepage.
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
          <div className="space-y-4 px-5 py-5">
            {error && <Alert variant="error">{error}</Alert>}

            {/* PHOTO — optional; initials are used when absent */}
            <div className="flex items-center gap-4">
              <UserAvatar
                name={form.name || "?"}
                src={preview || testimonial?.avatar}
                size="lg"
              />
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  <Upload className="h-4 w-4" />
                  {testimonial?.avatar || preview ? "Replace photo" : "Add photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
                <span className="mt-1.5 block text-xs text-slate-400 dark:text-slate-500">
                  Optional — initials are shown when there is no photo.
                </span>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Client name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="R. Suresh"
                required
              />
              <FormField
                label="Role / location"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Factory Owner, Coimbatore"
              />
            </div>

            <FormField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Optional"
            />

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Quote
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="What the client said about working with you."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            {/* RATING */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, rating: value }))
                    }
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className="rounded p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        value <= form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Show this testimonial on the website
              </span>
            </label>
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving} icon={Save}>
              {isEditing ? "Save changes" : "Add testimonial"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

/** Keyed on the id so each edit starts from that testimonial's values. */
const TestimonialFormModal = ({ isOpen, testimonial, ...props }) =>
  isOpen ? (
    <TestimonialDialog
      key={testimonial?._id || "new"}
      testimonial={testimonial}
      {...props}
    />
  ) : null;

export default TestimonialFormModal;
