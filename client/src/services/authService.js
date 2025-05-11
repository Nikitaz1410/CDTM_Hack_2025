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

            // 1. Update user profile with personal information using the new endpoint
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

            // 5. Handle blood test data
            if (onboardingData.bloodTests.manualData?.length > 0) {
                for (const bloodTest of onboardingData.bloodTests.manualData) {
                    try {
                        // Create each parameter as a separate blood test entry
                        for (const parameter of bloodTest.parameters) {
                            await api.post(`/blood/user/${user.id}`, {
                                date: bloodTest.date,
                                metric: parameter.name,
                                value: parameter.value
                            });
                        }
                    } catch (error) {
                        console.warn('Failed to save blood test:', error);
                    }
                }
            }

            // 6. Upload scanned documents to Python backend
            // Process all scanned documents from all sections
            const allDocuments = [
                { data: onboardingData.medications.scannedDocument, type: 'medikation' },
                { data: onboardingData.vaccinations.scannedDocument, type: 'impfpass' },
                { data: onboardingData.medicalReports.scannedDocument, type: 'befund' },
                { data: onboardingData.bloodTests.scannedDocument, type: 'blutbild' }
            ].filter(doc => doc.data !== null);

            //TODO This is the problematic code, should be brought to other button
            for (const document of allDocuments) {
                try {
                    // Convert base64 to blob for FormData
                    const response = await fetch(document.data.data);
                    const blob = await response.blob();

                    const formData = new FormData();
                    formData.append('image', blob, document.data.name);
                    formData.append('userId', user.id);
                    formData.append('document', document.type);

                    // Upload to Python backend for analysis (which will then save to database)
                    await pythonApi.post('/upload-document', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                } catch (error) {
                    console.warn('Failed to upload document:', error);
                    // Don't throw error, just continue without uploading this document
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