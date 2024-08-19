import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true, // Important for cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if response status is 401 and retry flag is not set
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new token using the refresh endpoint
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
