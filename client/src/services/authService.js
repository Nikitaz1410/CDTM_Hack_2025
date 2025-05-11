// src/services/authService.js
import api from '../config/api';

const authService = {
    // Login user
    async login(username, password) {
        try {
            const response = await api.post('/users/login', {
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
            const response = await api.post('/users/register', userData);

            // After successful registration, automatically log in
            // Since registration sets username = email, we use email for login
            const loginResponse = await this.login(userData.email, userData.password);

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

    // Save onboarding data to backend (Spring Boot only)
    async saveOnboardingData(onboardingData) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('No user found');

            // 1. Update user profile with personal information
            try {
                await api.put('/users/me/personal-info', {
                    first: onboardingData.personalInfo.first,
                    last: onboardingData.personalInfo.last,
                    weight: onboardingData.personalInfo.weight,
                    height: onboardingData.personalInfo.height
                });
            } catch (error) {
                console.warn('Failed to update personal info:', error);
                throw error; // Re-throw to stop the onboarding process if this fails
            }

            // 2. Save medications
            if (onboardingData.medications.manualData?.length > 0) {
                for (const medication of onboardingData.medications.manualData) {
                    try {
                        await api.post(`/meds/user/${user.id}`, {
                            name: medication.name,
                            dailyIntake: parseInt(medication.dailyIntake) || 1
                        });
                    } catch (error) {
                        console.warn('Failed to save medication:', error);
                    }
                }
            }

            // 3. Handle vaccination data
            if (onboardingData.vaccinations.manualData?.length > 0) {
                for (const vaccination of onboardingData.vaccinations.manualData) {
                    try {
                        await api.post(`/vaccinations/user/${user.id}`, {
                            name: vaccination.name,
                            disease: vaccination.disease,
                            date: vaccination.date
                        });
                    } catch (error) {
                        console.warn('Failed to save vaccination:', error);
                    }
                }
            }

            // 4. Handle medical reports data
            if (onboardingData.medicalReports.manualData?.length > 0) {
                for (const report of onboardingData.medicalReports.manualData) {
                    try {
                        await api.post(`/reports/user/${user.id}`, {
                            date: report.date,
                            summary: report.summary || report.title,
                            text: report.summary || "Befund aus Onboarding"
                        });
                    } catch (error) {
                        console.warn('Failed to save medical report:', error);
                    }
                }
            }

            // 5. Handle scanned documents (temporarily disabled)
            // Since we're not using Python API, we'll skip document uploading for now
            // You can implement this later when you add document upload to Spring Boot
            if (onboardingData.medications.scannedDocument ||
                onboardingData.vaccinations.scannedDocument ||
                onboardingData.medicalReports.scannedDocument) {
                console.warn('Document upload is temporarily disabled. Scanned documents were not uploaded.');
            }

            // Mark onboarding as complete
            localStorage.setItem('hasCompletedOnboarding', 'true');

            return true;
        } catch (error) {
            console.error('Failed to save onboarding data:', error);
            throw new Error(error.response?.data?.message || 'Failed to save onboarding data');
        }
    }
};

export default authService;