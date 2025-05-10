// src/services/healthDataService.js
import api, { pythonApi } from '../config/api';
import { sampleHealthData, sampleDocuments } from '../data/sampleData';
import authService from './authService';

class HealthDataService {
    constructor() {
        this.isServerConnected = true;
        this.checkServerConnection();
    }

    // Get current user ID from auth service
    getCurrentUserId() {
        const user = authService.getCurrentUser();
        return user ? user.id : null;
    }

    // Check server connection for Java backend
    async checkServerConnection() {
        try {
            await api.get('/health'); // Assume there's a health check endpoint
            this.isServerConnected = true;
        } catch (error) {
            this.isServerConnected = false;
        }
        return this.isServerConnected;
    }

    // Helper method to use sample data when server is down
    async withFallback(apiCall, sampleData) {
        try {
            if (!this.isServerConnected) {
                throw new Error('Server not connected');
            }
            const response = await apiCall();
            return response.data;
        } catch (error) {
            console.warn('Using sample data:', error.message);
            // Simulate API delay for demo purposes
            await new Promise(resolve => setTimeout(resolve, 500));
            return sampleData;
        }
    }

    // Blood Test (Blutbild)
    async getBloodTests() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.get(`/blood/user/${userId}`),
            sampleHealthData.bloodTests
        );
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

        return this.withFallback(
            () => api.get(`/meds/user/${userId}`),
            sampleHealthData.medications
        );
    }

    async addMedication(medication) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('No user ID available');

        return this.withFallback(
            () => api.post(`/meds/user/${userId}`, medication),
            { ...medication, id: Date.now() }
        );
    }

    // Document Management - uploaded documents are stored by Java backend
    async getDocuments() {
        return this.withFallback(
            () => api.get('/documents'),
            sampleDocuments
        );
    }

    // Special handling for document upload - this goes to Python backend
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

            // Return the response which includes analysis
            return response.data;
        } catch (error) {
            console.warn('Document upload failed, using sample response:', error.message);
            // Return sample data for demo
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                success: true,
                message: 'Document uploaded successfully (sample data)',
                filename: formData.get('image')?.name || 'unknown.jpg',
                size: formData.get('image')?.size || 0,
                analysis: {
                    message: 'Sample analysis result',
                    status: 'normal',
                    parameters: [
                        { name: 'Sample Parameter', value: 42 }
                    ]
                }
            };
        }
    }

    // Server connection status
    getServerStatus() {
        return this.isServerConnected;
    }
}

export default new HealthDataService();