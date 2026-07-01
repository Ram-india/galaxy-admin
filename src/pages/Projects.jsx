import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../services/projectService";

import ProjectTable from "../components/projects/ProjectTable";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectModal from "../components/projects/ProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
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
    images: [],
    imagePreviews: [],
    removedImages: [],
  });

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data);
    } catch (error) {
      console.log("Error fetching projects", error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let items = [...projects];

    if (search.trim()) {
      items = items.filter((project) => {
        const query = search.toLowerCase();
        return (
          project.projectName?.toLowerCase().includes(query) ||
          project.clientName?.toLowerCase().includes(query) ||
          project.location?.toLowerCase().includes(query) ||
          project.projectType?.toLowerCase().includes(query)
        );
      });
    }

    if (sortConfig?.key) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        const order = sortConfig.direction === "asc" ? 1 : -1;

        if (sortConfig.key === "startDate" || sortConfig.key === "completionDate") {
          const dateA = aValue ? new Date(aValue) : new Date(0);
          const dateB = bValue ? new Date(bValue) : new Date(0);
          return (dateA - dateB) * order;
        }

        return aValue.toString().localeCompare(bValue.toString(), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * order;
      });
    }

    return items;
  }, [projects, search, sortConfig]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmDelete) {
      try {
        await deleteProject(id);
        fetchProjects();
        alert("Project deleted successfully");
      } catch (error) {
        console.log("Error deleting project", error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName || "",
      clientName: project.clientName || "",
      capacity: project.capacity || "",
      projectType: project.projectType || "Rooftop",
      status: project.status || "Pending",
      location: project.location || "",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      completionDate: project.completionDate
        ? project.completionDate.slice(0, 10)
        : "",
      description: project.description || "",
      images: [],
      imagePreviews: project.images || [],
      removedImages: [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (isSaving) return; // prevent duplicate submissions
    setIsSaving(true);
    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((file) => {
              if (file instanceof File) payload.append("images", file);
            });
          }
        } else if (key !== "imagePreviews") {
          payload.append(key, value || "");
        }
      });

      // When editing, include existing remote images to preserve them
      if (editingProject && formData.imagePreviews && formData.imagePreviews.length) {
        const existing = formData.imagePreviews.filter(
          (src) => typeof src === "string" && /^https?:\/\//.test(src)
        );
        existing.forEach((url) => payload.append("existingImages", url));
      }

      // Include any images the user removed so backend can delete them
      if (editingProject && formData.removedImages && formData.removedImages.length) {
        formData.removedImages.forEach((url) => payload.append("removedImages", url));
      }

      if (editingProject) {
        await updateProject(editingProject._id, payload);
        alert("Project updated successfully");
      } else {
        await createProject(payload);
        alert("Project created successfully");
      }

      setShowModal(false);
      setEditingProject(null);
      setFormData({
        projectName: "",
        clientName: "",
        capacity: "",
        location: "",
        projectType: "Rooftop",
        status: "Pending",
        startDate: "",
        completionDate: "",
        description: "",
        images: [],
        imagePreviews: [],
      });
      fetchProjects();
    } catch (error) {
      console.log("Error saving project", error);
      alert("Error saving project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="space-y-8">
    

      <div className="space-y-6">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col gap-6">
          

          <ProjectFilters
            search={search}
            setSearch={setSearch}
            openModal={() => setShowModal(true)}
          />
        </div>

        <ProjectTable
          projects={filteredProjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>

      <ProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        editingProject={editingProject}
      />
    </div>
  );
};

export default Projects;