import API from "./api";

export const getSiteSettings = () => API.get("/site-settings");

export const updateSiteSettings = (payload) => API.put("/site-settings", payload);

/** `kind` is "logo" or "og". */
export const uploadBrandingImage = (kind, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return API.put(`/site-settings/image/${kind}`, formData);
};

export const updateIntegration = (platform, payload) =>
  API.put(`/site-settings/integrations/${platform}`, payload);

export const getShareHistory = (limit = 20) =>
  API.get("/site-settings/shares", { params: { limit } });

export const shareBlogNow = (blogId, platforms) =>
  API.post(`/site-settings/shares/${blogId}`, { platforms });
