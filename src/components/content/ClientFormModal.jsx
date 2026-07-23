import { useEffect, useState } from "react";
import { X, Save, Upload, ImageIcon } from "lucide-react";

import * as contentApi from "../../services/contentService";
import { toErrorMessage } from "../../utils/errorMessage";

import FormField from "../ui/FormField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ClientDialog = ({ client, onClose, onSaved }) => {
  const isEditing = Boolean(client);

  const [form, setForm] = useState({
    name: client?.name || "",
    website: client?.website || "",
    isActive: client?.isActive ?? true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Release the object URL when the chosen file changes or on unmount
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

    if (!form.name.trim()) {
      setError("A client name is required.");
      return;
    }

    if (!isEditing && !file) {
      setError("Upload the client's logo.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (file) payload.append("logo", file);

    try {
      const res = isEditing
        ? await contentApi.updateClient(client._id, payload)
        : await contentApi.createClient(payload);

      onSaved(res.data.message);
      onClose();
    } catch (err) {
      setError(toErrorMessage(err, "Could not save the client."));
    } finally {
      setIsSaving(false);
    }
  };

  const shownLogo = preview || client?.logo;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {isEditing ? "Edit client" : "New client"}
          </h2>
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

            {/* LOGO — a light checkerboard-free panel, since most logos are
                transparent PNGs meant to sit on white */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Logo
              </label>

              {shownLogo ? (
                <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                  <img
                    src={shownLogo}
                    alt=""
                    className="h-32 w-full object-contain p-4"
                  />
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/50 group-hover:opacity-100">
                    <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">
                      Replace
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-slate-700">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Choose a logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              )}

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <ImageIcon className="h-3 w-3" />
                A transparent PNG or SVG on a light background looks best. Max 2 MB.
              </p>
            </div>

            <FormField
              label="Client name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tata Group"
              required
            />

            <FormField
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://www.tata.com"
              hint="Optional — makes the logo a link."
            />

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
                Show this client on the website
              </span>
            </label>
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving} icon={Save}>
              {isEditing ? "Save changes" : "Add client"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

/** Keyed on the client id so each edit starts from that client's values. */
const ClientFormModal = ({ isOpen, client, ...props }) =>
  isOpen ? (
    <ClientDialog key={client?._id || "new"} client={client} {...props} />
  ) : null;

export default ClientFormModal;
