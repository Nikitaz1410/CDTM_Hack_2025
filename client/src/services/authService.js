// src/services/authService.js
import api from '../config/api';

const authService = {
    // Login user
    async login(username, password) {
        try {
            const response = await api.post('/api/users/login', {
                username,
                password
            });

            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // Register user
    async register(userData) {
        try {
            const response = await api.post('/api/users/register', userData);

            // After successful registration, automatically log in
            const loginResponse = await this.login(userData.username, userData.password);

            return loginResponse;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('hasCompletedOnboarding');
        window.location.href = '/login';
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    // Get auth token
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Save onboarding data to backend
    async saveOnboardingData(onboardingData) {
        try {
            // Update user profile with onboarding data
            const response = await api.put('/api/users/me', {
                ...onboardingData.personalInfo
            });

            // You can extend this to save other data like medications, medical history, etc.
            // For now, we'll just mark onboarding as complete
            localStorage.setItem('hasCompletedOnboarding', 'true');

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to save onboarding data');
        }
    }
};

export default authService;