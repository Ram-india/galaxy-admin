import API from "./api";

/* ----------------------------------------------------------- hero slides */

export const getSlides = () => API.get("/content/slides");

export const createSlide = (formData) => API.post("/content/slides", formData);

export const updateSlide = (id, formData) =>
  API.put(`/content/slides/${id}`, formData);

/** `ids` in the order they should appear. */
export const reorderSlides = (ids) =>
  API.patch("/content/slides/reorder", { ids });

export const deleteSlide = (id) => API.delete(`/content/slides/${id}`);

/* ------------------------------------------------------------------ jobs */

export const getJobs = () => API.get("/content/jobs");

export const createJob = (payload) => API.post("/content/jobs", payload);

export const updateJob = (id, payload) => API.put(`/content/jobs/${id}`, payload);

export const deleteJob = (id) => API.delete(`/content/jobs/${id}`);

/* ---------------------------------------------------------- testimonials */

export const getTestimonials = () => API.get("/content/testimonials");

export const createTestimonial = (formData) =>
  API.post("/content/testimonials", formData);

export const updateTestimonial = (id, formData) =>
  API.put(`/content/testimonials/${id}`, formData);

export const reorderTestimonials = (ids) =>
  API.patch("/content/testimonials/reorder", { ids });

export const deleteTestimonial = (id) =>
  API.delete(`/content/testimonials/${id}`);

/* ---------------------------------------------------------------- clients */

export const getClients = () => API.get("/content/clients");

export const createClient = (formData) => API.post("/content/clients", formData);

export const updateClient = (id, formData) =>
  API.put(`/content/clients/${id}`, formData);

export const reorderClients = (ids) =>
  API.patch("/content/clients/reorder", { ids });

export const deleteClient = (id) => API.delete(`/content/clients/${id}`);
