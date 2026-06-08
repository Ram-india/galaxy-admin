const ProjectModal = ({
  show,
  onClose,
  onSave,
  formData,
  setFormData,
  editingProject,
}) => {
  if (!show) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/60
        backdrop-blur-sm
        flex items-center
        justify-center
        z-50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-3xl
          shadow-2xl
          w-full
          max-w-2xl
          p-8
          max-h-[90vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="
            text-3xl
            font-bold
            mb-8
            text-slate-900
            dark:text-white
          "
        >
          {editingProject ? "Edit Project" : "New Project"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectName: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <input
            type="text"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({
                ...formData,
                clientName: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <input
            type="text"
            placeholder="Capacity (kW)"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                capacity: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <select
            value={formData.projectType}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectType: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option>Rooftop</option>
            <option>Ground Mounted</option>
            <option>Industrial</option>
            <option>Residential</option>
          </select>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option>Pending</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <input
            type="date"
            value={formData.completionDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                completionDate: e.target.value,
              })
            }
            className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <div className="md:col-span-2">
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              rows={4}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Project Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const image = e.target.files?.[0] || null;
                setFormData({
                  ...formData,
                  image,
                  imagePreview: image
                    ? URL.createObjectURL(image)
                    : formData.imagePreview,
                });
              }}
              className="border border-slate-200 dark:border-slate-700 p-3 rounded-2xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            {formData.imagePreview && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl hover:from-blue-700 hover:to-violet-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            {editingProject ? " Update" : " Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;