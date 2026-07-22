import API from "./api";

export const getTeamMembers = (params = {}) => API.get("/team", { params });

export const getRoles = () => API.get("/team/roles");

export const inviteMember = (payload) => API.post("/team/invite", payload);

export const resendInvite = (id) => API.post(`/team/${id}/resend-invite`);

export const updateMemberRole = (id, role) =>
  API.patch(`/team/${id}/role`, { role });

export const updateMemberStatus = (id, status) =>
  API.patch(`/team/${id}/status`, { status });

export const removeMember = (id) => API.delete(`/team/${id}`);
