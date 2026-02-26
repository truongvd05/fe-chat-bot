import { clearUser } from "@/features/User/userSlice";
import { store } from "@/store/store";
import axios from "axios";

const httpThreads = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

httpThreads.interceptors.request.use(
    (config) => {
        if (config.skipAuth) return config;

        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err),
);

httpThreads.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Timeout error
        if (error.code === "ECONNABORTED") {
            console.error("Request timeout");
            return Promise.reject({
                message: "Request timeout",
                code: "TIMEOUT",
            });
        }
        // Network error
        if (!error.response) {
            console.error("Network error");
            return Promise.reject({
                message: "Network error",
                code: "NETWORK_ERROR",
            });
        }
        const originalRequest = error.config;
        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Nếu đang refresh, đưa vào queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] =
                            `Bearer ${token}`;
                        return httpThreads(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("NO_REFRESH_TOKEN");
                }
                // Gọi refresh API bằng axios gốc (không qua interceptor)
                const res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/auth/refresh`,
                    { refresh_token: refreshToken },
                );
                const newToken = res.data.data.access_token;
                const newRefreshToken = res.data.data.refresh_token; // Nếu backend trả về
                // Lưu token mới
                localStorage.setItem("access_token", newToken);
                if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken);
                }
                // Process queue
                processQueue(null, newToken);
                isRefreshing = false;
                // Retry original request
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return httpThreads(originalRequest);
            } catch (err) {
                console.error("Refresh token failed:", err);
                // Clear queue với error
                processQueue(err, null);
                isRefreshing = false;
                // Clear user data và redirect login
                store.dispatch(clearUser());
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                return Promise.reject(err);
            }
        }

        // Handle 403 - Forbidden (optional)
        if (error.response?.status === 403) {
            console.error("Access forbidden");
        }

        return Promise.reject(error);
    },
);

export default httpThreads;
