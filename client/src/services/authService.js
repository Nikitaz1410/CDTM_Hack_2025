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
            // Expected endpoint: PUT /api/users/me/complete-onboarding
            await api.put('/api/users/me/complete-onboarding', {
                ...onboardingData.personalInfo
            });

            // 2. Save medications
            // Expected endpoint: POST /api/meds/user/{userId}
            if (onboardingData.medications.manualData?.length > 0) {
                for (const medication of onboardingData.medications.manualData) {
                    await api.post(`/api/meds/user/${user.id}`, medication);
                }
            }

            // 3. Handle vaccination data
            // Expected endpoints:
            // - POST /api/vaccinations/user/{userId} for manual entries
            // - POST /api/upload-document for scanned documents
            if (onboardingData.vaccinations.manualData?.length > 0) {
                for (const vaccination of onboardingData.vaccinations.manualData) {
                    // Transform manual vaccination data to match backend format
                    const vaccinationData = {
                        status: "current",
                        impfungen: [{
                            Impfstoffname: vaccination.name,
                            Krankheit: [vaccination.disease],
                            Impfdatum: vaccination.date
                        }]
                    };
                    await api.post(`/api/vaccinations/user/${user.id}`, vaccinationData);
                }
            }

            // 4. Handle medical reports data
            // Expected endpoints:
            // - POST /api/medical-reports/user/{userId} for manual entries
            // - POST /api/upload-document for scanned documents
            if (onboardingData.medicalReports.manualData?.length > 0) {
                for (const report of onboardingData.medicalReports.manualData) {
                    const reportData = {
                        status: "normal",
                        date: report.date,
                        summary: report.summary || report.title,
                        paragraphs: [{
                            caption: "Befund",
                            full_text: report.summary || "Befund aus Onboarding"
                        }]
                    };
                    await api.post(`/api/medical-reports/user/${user.id}`, reportData);
                }
            }

            // 5. Upload scanned documents
            // Process all scanned documents from all sections
            const allDocuments = [
                onboardingData.medications.scannedDocument,
                onboardingData.vaccinations.scannedDocument,
                onboardingData.medicalReports.scannedDocument
            ].filter(doc => doc !== null);

            for (const document of allDocuments) {
                // Convert base64 to blob for FormData
                const response = await fetch(document.data);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append('image', blob, document.name);
                formData.append('timestamp', document.date);
                formData.append('userId', user.id);

                // Determine document type based on section
                let documentType = 'other';
                if (onboardingData.medications.scannedDocument === document) documentType = 'medication';
                if (onboardingData.vaccinations.scannedDocument === document) documentType = 'vaccination';
                if (onboardingData.medicalReports.scannedDocument === document) documentType = 'medicalReport';

                formData.append('document', documentType);

                await api.post('/api/upload-document', formData);
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