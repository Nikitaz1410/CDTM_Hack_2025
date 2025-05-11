// src/config/api.js
import axios from 'axios';

// Base URL for Spring Boot API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9898/api';

// Create axios instance for Spring Boot backend
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
    withCredentials: false, // Don't send cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests for debugging
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => {
        console.error('[API Request Error]:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        // Log error responses
        console.error(`[API Response Error] ${error.response?.status || 'Network Error'} ${error.config?.url}:`, error.message);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            console.warn('Authentication failed. Clearing session...');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle network/connection errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.error('Cannot connect to server. Please ensure the backend is running on port 9898.');
        }

        // Handle CORS errors
        if (error.message.includes('CORS')) {
            console.error('CORS error detected. Check backend CORS configuration.');
        }

        return Promise.reject(error);
    }
);

// Helper function to check server connectivity
export const checkServerConnection = async () => {
    try {
        // Try to get current user as a health check
        await api.get('/users/me');
        return true;
    } catch (error) {
        console.warn('Server connection check failed:', error.message);
        return false;
    }
};

// Export the main API instance
export default api;