import axios from 'axios';


//create a axios instance with base configuration 
const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
        headers: { 'Content-Type': 'application/json' }
    }
);


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//Response interceptor - handle error globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;