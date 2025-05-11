// src/config/api.js
import axios from 'axios';

// Base URL for Spring Boot API
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
// Base URL for Python API (document scanning)
const PYTHON_API_BASE_URL = process.env.REACT_APP_PYTHON_API_URL || '/api-img';

// Create axios instance for Spring Boot backend
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
    withCredentials: false, // Don't send cookies
});

// Create axios instance for Python backend (document upload)
const pythonApi = axios.create({
    baseURL: PYTHON_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for file uploads
    withCredentials: false,
});

// Request interceptor to add auth token for Java API
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests for debugging
        console.log(`[Java API Request] ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => {
        console.error('[Java API Request Error]:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors for Java API
api.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log(`[Java API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        // Log error responses
        console.error(`[Java API Response Error] ${error.response?.status || 'Network Error'} ${error.config?.url}:`, error.message);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            console.warn('Authentication failed. Clearing session...');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle network/connection errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.error('Cannot connect to Java server. Please ensure the backend is running on port 9898.');
        }

        // Handle CORS errors
        if (error.message.includes('CORS')) {
            console.error('CORS error detected. Check backend CORS configuration.');
        }

        return Promise.reject(error);
    }
);

// Python API doesn't need auth, but we can add logging
pythonApi.interceptors.request.use(
    (config) => {
        console.log(`[Python API Request] ${config.method?.toUpperCase()} ${config.url}`);

        // For file uploads, we need to handle different content type
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        console.error('[Python API Request Error]:', error);
        return Promise.reject(error);
    }
);

pythonApi.interceptors.response.use(
    (response) => {
        console.log(`[Python API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`[Python API Response Error] ${error.response?.status || 'Network Error'} ${error.config?.url}:`, error.message);

        // Add specific error handling for connection issues
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.warn('Python backend server appears to be down. Check if it\'s running on port 5000.');
        }

        return Promise.reject(error);
    }
);

// Helper function to check server connectivity
export const checkServerConnection = async () => {
    try {
        // Try to hit a simple endpoint to check if server is running
        await api.get('/users/me');
        return true;
    } catch (error) {
        return false;
    }
};

// Helper function to check Python server connectivity
export const checkPythonServerConnection = async () => {
    try {
        // Try to hit Python server
        const response = await pythonApi.get('/health').catch(() => {
            // If no health endpoint, try a simple get that might return 404
            return pythonApi.get('/').catch(() => ({ status: 200 }));
        });
        return response.status === 200;
    } catch (error) {
        console.warn('Python server check failed:', error.message);
        return false;
    }
};

// Export the main API instance and Python API
export default api;
export { pythonApi };