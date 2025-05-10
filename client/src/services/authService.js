// src/services/authService.js
import api, { pythonApi } from '../config/api';

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

    // Save onboarding data to backend
    async saveOnboardingData(onboardingData) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('No user found');

            // 1. Update user profile with personal information
            try {
                await api.put('/users/me', {
                    ...onboardingData.personalInfo
                });
            } catch (error) {
                console.warn('Failed to update personal info:', error);
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

            // 5. Upload scanned documents to Python backend
            // Process all scanned documents from all sections
            const allDocuments = [
                onboardingData.medications.scannedDocument,
                onboardingData.vaccinations.scannedDocument,
                onboardingData.medicalReports.scannedDocument
            ].filter(doc => doc !== null);

            for (const document of allDocuments) {
                try {
                    // Convert base64 to blob for FormData
                    const response = await fetch(document.data);
                    const blob = await response.blob();

                    const formData = new FormData();
                    formData.append('image', blob, document.name);
                    formData.append('userId', user.id);

                    // Determine document type based on section
                    let documentType = 'other';
                    if (onboardingData.medications.scannedDocument === document) documentType = 'medikation';
                    if (onboardingData.vaccinations.scannedDocument === document) documentType = 'impfpass';
                    if (onboardingData.medicalReports.scannedDocument === document) documentType = 'befund';

                    formData.append('document', documentType);

                    // Upload to Python backend for analysis (which will then save to database)
                    await pythonApi.post('/upload-document', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                } catch (error) {
                    console.warn('Failed to upload document:', error);
                }
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