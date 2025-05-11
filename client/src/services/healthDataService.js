// src/services/healthDataService.js
import api, { pythonApi } from '../config/api';
import { sampleHealthData, sampleDocuments } from '../data/sampleData';
import authService from './authService';

class HealthDataService {
    constructor() {
        this.isServerConnected = true;
        this.isPythonServerConnected = true;
    }

    // Get current user ID from auth service
    getCurrentUserId() {
        const user = authService.getCurrentUser();
        return user ? user.id : null;
    }

    // Helper method to use sample data when server is down
    async withFallback(apiCall, sampleData) {
        try {
            const response = await apiCall();
            this.isServerConnected = true;
            return response.data;
        } catch (error) {
            console.warn('Using sample data:', error.message);
            this.isServerConnected = false;
            // Simulate API delay for demo purposes
            await new Promise(resolve => setTimeout(resolve, 500));
            return sampleData;
        }
    }

    // Blood Test (Blutbild)
    async getBloodTests() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        try {
            const response = await api.get(`/blood/user/${userId}`);
            this.isServerConnected = true;

            // Transform the data to match the expected format
            if (response.data && response.data.length > 0) {
                // Group blood tests by date and transform them
                const groupedTests = response.data.reduce((acc, blood) => {
                    // Handle empty date strings by using today's date
                    let date = blood.date;
                    if (!date || date === "" || date === '""') {
                        date = new Date().toISOString().split('T')[0];
                    }

                    // Ensure date is valid
                    try {
                        const testDate = new Date(date);
                        if (isNaN(testDate.getTime())) {
                            date = new Date().toISOString().split('T')[0];
                        }
                    } catch (e) {
                        date = new Date().toISOString().split('T')[0];
                    }

                    if (!acc[date]) {
                        acc[date] = {
                            status: 'normal',
                            date: date,
                            parameters: []
                        };
                    }

                    acc[date].parameters.push({
                        name: blood.metric,
                        value: blood.value
                    });

                    return acc;
                }, {});

                // Convert to array and sort by date
                return Object.values(groupedTests).sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });
            } else {
                // Return empty blood tests in expected format
                return [];
            }
        } catch (error) {
            console.warn('Using sample data for blood tests:', error.message);
            this.isServerConnected = false;
            await new Promise(resolve => setTimeout(resolve, 500));
            return sampleHealthData.bloodTests;
        }
    }

    async addBloodTest(bloodTest) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.post(`/blood/user/${userId}`, bloodTest),
            { ...bloodTest, id: Date.now() }
        );
    }

    // Vaccination Record (Impfpass)
    async getVaccinations() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.get(`/vaccinations/user/${userId}`),
            sampleHealthData.vaccinations
        );
    }

    async addVaccination(vaccination) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.post(`/vaccinations/user/${userId}`, vaccination),
            { ...vaccination, id: Date.now() }
        );
    }

    // Medical Reports (Befunde)
    async getMedicalReports() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.get(`/reports/user/${userId}`),
            sampleHealthData.medicalReports
        );
    }

    async addMedicalReport(report) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.post(`/reports/user/${userId}`, report),
            { ...report, id: Date.now() }
        );
    }

    // Medication (Medikation)
    async getMedications() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        try {
            // Get the raw medications from API
            const medications = await api.get(`/meds/user/${userId}`);
            this.isServerConnected = true;

            // Transform the data to match the expected format
            if (medications.data && medications.data.length > 0) {
                // Convert flat array to expected format
                const transformedData = [{
                    status: 'current',
                    date: new Date().toISOString().split('T')[0],
                    medikamente: {}
                }];

                // Convert each medication to the expected format
                medications.data.forEach(med => {
                    transformedData[0].medikamente[med.name] = {
                        morning: Math.floor(med.dailyIntake / 3) || 0,
                        noon: Math.floor(med.dailyIntake / 3) || 0,
                        night: med.dailyIntake - (Math.floor(med.dailyIntake / 3) * 2) || 0,
                        comment: med.comment || `${med.dailyIntake} Tabletten täglich`
                    };
                });

                return transformedData;
            } else {
                // Return empty medications in expected format
                return [{
                    status: 'current',
                    date: new Date().toISOString().split('T')[0],
                    medikamente: {}
                }];
            }
        } catch (error) {
            console.warn('Using sample data for medications:', error.message);
            this.isServerConnected = false;
            await new Promise(resolve => setTimeout(resolve, 500));
            return sampleHealthData.medications;
        }
    }

    async addMedication(medication) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        // Transform medication data before sending
        const medicationData = {
            name: medication.name,
            dailyIntake: medication.dailyIntake || 1,
            comment: medication.comment || ''
        };

        return this.withFallback(
            () => api.post(`/meds/user/${userId}`, medicationData),
            { ...medicationData, id: Date.now() }
        );
    }

    // Document Management - using Java backend
    async getDocuments() {
        // This could be implemented to fetch from Java backend in the future
        // For now, return sample documents
        return sampleDocuments;
    }

    // Document upload - using Python backend for analysis
    async uploadDocument(formData) {
        try {
            // Ensure userId is included in the form data
            const userId = this.getCurrentUserId();
            if (!userId) {
                throw new Error('No user ID available');
            }

            // Update the userId in formData if it's not already set correctly
            formData.set('userId', userId);

            // Upload to Python backend for analysis
            const response = await pythonApi.post('/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            this.isPythonServerConnected = true;

            // Return the response which includes analysis
            return response.data;
        } catch (error) {
            console.warn('Document upload failed:', error.message);
            this.isPythonServerConnected = false;

            // Return error response
            throw new Error(error.response?.data?.detail || 'Failed to upload document');
        }
    }

    // Server connection status
    getServerStatus() {
        return this.isServerConnected;
    }

    getPythonServerStatus() {
        return this.isPythonServerConnected;
    }

    // Check server connection - implementation matches api.js
    async checkServerConnection() {
        try {
            await api.get('/users/me');
            this.isServerConnected = true;
            return true;
        } catch (error) {
            this.isServerConnected = false;
            return false;
        }
    }

    // Check Python server connection
    async checkPythonServerConnection() {
        try {
            // Try to hit Python server
            const response = await pythonApi.get('/health').catch(() => {
                // If no health endpoint, try a simple request
                return pythonApi.get('/').catch(() => ({ status: 200 }));
            });
            this.isPythonServerConnected = response.status === 200;
            return this.isPythonServerConnected;
        } catch (error) {
            this.isPythonServerConnected = false;
            return false;
        }
    }
}

export default new HealthDataService();