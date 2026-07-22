import API from "./api";

export const getBlogs = (params = {}) => API.get("/blogs", { params });

export const getBlog = (id) => API.get(`/blogs/${id}`);

/** Create and update send multipart, because the cover image travels along. */
export const createBlog = (formData) => API.post("/blogs", formData);

export const updateBlog = (id, formData) => API.put(`/blogs/${id}`, formData);

export const updateBlogStatus = (id, status) =>
  API.patch(`/blogs/${id}/status`, { status });

export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
