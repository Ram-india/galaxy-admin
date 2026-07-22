import axios from "axios";

const API = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * A 401 means the token is expired, revoked, or the account is gone. Announce
 * it so AuthProvider can clear the session and the router can bounce to /login.
 *
 * The auth endpoints are excluded: a failed sign-in or an expired reset link
 * should surface its own message on the form, not wipe an unrelated session.
 */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || "";
        const isAuthEndpoint = url.includes("/auth/login")
            || url.includes("/auth/register")
            || url.includes("/auth/forgot-password")
            || url.includes("/auth/reset-password")
            || url.includes("/auth/invite");

        if (status === 401 && !isAuthEndpoint) {
            window.dispatchEvent(new Event("auth:unauthorized"));
        }

        return Promise.reject(error);
    }
);

export default API;
