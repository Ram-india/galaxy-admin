import API from "./api";

export const getAllEnquiries = () => API.get("/enquiries");

export const getEnquiry = (id) => API.get(`/enquiries/${id}`);

// Admin panel only updates the workflow fields (status / requirement notes)
export const updateEnquiry = (id, payload) => API.put(`/enquiries/${id}`, payload);

export const updateEnquiryStatus = (id, status) =>
  API.put(`/enquiries/${id}`, { status });

export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}`);
