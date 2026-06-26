import axios from 'axios';

// Create an instance of axios with our API's base URL
const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});

// Interceptor: This runs BEFORE every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // If we have a token, add it to the 'Authorization' header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh automatically on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                const res = await axios.post('http://localhost:8000/api/auth/login/refresh/', {
                    refresh: refreshToken
                });
                if (res.status === 200) {
                    localStorage.setItem('access_token', res.data.access);
                    if (res.data.refresh) {
                        localStorage.setItem('refresh_token', res.data.refresh);
                    }
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is invalid or expired, log out the user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
