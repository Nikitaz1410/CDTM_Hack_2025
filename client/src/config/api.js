// src/config/api.js
import axios from 'axios';

// Base URL for API - using HTTPS for localhost testing
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const PYTHON_API_BASE_URL = process.env.REACT_APP_PYTHON_API_URL || '/api-img';

// Create axios instance for Java backend (default)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create axios instance for Python backend (document upload)
const pythonApi = axios.create({
    baseURL: PYTHON_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token for Java API
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors for Java API
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, clear storage and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Python API doesn't need auth, but we can add logging or other interceptors if needed
pythonApi.interceptors.request.use(
    (config) => {
        console.log('Python API request:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { pythonApi };