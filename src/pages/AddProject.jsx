

import { useState } from "react";
import { createProject } from "../services/projectService";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    capacity: "",
    location: "",
    projectType: "Rooftop",
    status: "Pending",
    startDate: "",
    completionDate: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const image = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image,
      imagePreview: image ? URL.createObjectURL(image) : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image") {
        if (value instanceof File) {
          payload.append("images", value);
        }
      } else if (key !== "imagePreview") {
        payload.append(key, value || "");
      }
    });

    try {
      await createProject(payload);
      alert("Project created successfully");
      navigate("/projects");
    } catch (error) {
      console.log("Error creating project", error);
      alert("Error creating project");
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold">Add Project</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={formData.projectName}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <input
          type="text"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <option value="Rooftop">Rooftop</option>
          <option value="Ground Mounted">Ground Mounted</option>
          <option value="Industrial">Industrial</option>
          <option value="Residential">Residential</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <input
          type="date"
          name="completionDate"
          value={formData.completionDate}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 md:col-span-2"
          rows={4}
        />

        <div className="md:col-span-2 space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />

          {formData.imagePreview && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={formData.imagePreview}
                alt="Project Preview"
                className="w-full h-52 object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-md md:col-span-2 transition-colors"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;