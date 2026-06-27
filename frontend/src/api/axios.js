import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const path = config.url || "";
  const token = path.startsWith("/owner") || path.includes("/orders/owner")
    ? localStorage.getItem("ownerToken")
    : path.startsWith("/delivery")
      ? localStorage.getItem("deliveryToken")
      : localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      const accountType = pathname.startsWith("/owner")
        ? "owner"
        : pathname.startsWith("/delivery") ? "delivery" : "customer";
      const tokenKey = accountType === "owner" ? "ownerToken" : accountType === "delivery" ? "deliveryToken" : "token";
      localStorage.removeItem(tokenKey);

      if (!window.location.pathname.includes("/login")) {
        window.location.href = `/${accountType}/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

