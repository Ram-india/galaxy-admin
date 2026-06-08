
import API from './api';

export const getAllProjects = () => API.get('/projects');

export const getProjects = (id) => API.get(`/projects/${id}`);

export const createProject = (data) => API.post("/projects", data);

export const updateProject = (id, data) => API.put(`/projects/${id}`, data);

export const deleteProject = (id) => API.delete(`/projects/${id}`);