import API from "./api";

/* ------------------------------------------------------------------ public */

export const getRegistrationStatus = () => API.get("/auth/registration-status");

export const register = (payload) => API.post("/auth/register", payload);

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const verifyResetToken = (token) =>
  API.get(`/auth/reset-password/${token}`);

export const resetPassword = (token, password) =>
  API.post(`/auth/reset-password/${token}`, { password });

export const verifyInviteToken = (token) => API.get(`/auth/invite/${token}`);

export const acceptInvite = (token, payload) =>
  API.post(`/auth/invite/${token}`, payload);

/* --------------------------------------------------------------- protected */

export const getMe = () => API.get("/auth/me");

export const updateProfile = (payload) => API.put("/auth/profile", payload);

export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return API.put("/auth/profile/avatar", formData);
};

export const changePassword = (currentPassword, newPassword) =>
  API.put("/auth/password", { currentPassword, newPassword });
