// src/services/healthDataService.js
import api from '../config/api';
import { sampleHealthData, sampleDocuments } from '../data/sampleData';

class HealthDataService {
    constructor() {
        this.isServerConnected = true;
        this.checkServerConnection();
    }

    // Check server connection
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
        return this.withFallback(
            () => api.get('/api/blood-tests/user/me'),
            sampleHealthData.bloodTests
        );
    }

    async addBloodTest(bloodTest) {
        return this.withFallback(
            () => api.post('/api/blood-tests/user/me', bloodTest),
            { ...bloodTest, id: Date.now() }
        );
    }

    // Vaccination Record (Impfpass)
    async getVaccinations() {
        return this.withFallback(
            () => api.get('/api/vaccinations/user/me'),
            sampleHealthData.vaccinations
        );
    }

    async addVaccination(vaccination) {
        return this.withFallback(
            () => api.post('/api/vaccinations/user/me', vaccination),
            { ...vaccination, id: Date.now() }
        );
    }

    // Medical Reports (Befunde)
    async getMedicalReports() {
        return this.withFallback(
            () => api.get('/api/medical-reports/user/me'),
            sampleHealthData.medicalReports
        );
    }

    async addMedicalReport(report) {
        return this.withFallback(
            () => api.post('/api/medical-reports/user/me', report),
            { ...report, id: Date.now() }
        );
    }

    // Medication (Medikation)
    async getMedications() {
        return this.withFallback(
            () => api.get('/api/medications/user/me'),
            sampleHealthData.medications
        );
    }

    async addMedication(medication) {
        return this.withFallback(
            () => api.post('/api/medications/user/me', medication),
            { ...medication, id: Date.now() }
        );
    }

    // Document Management
    async getDocuments() {
        return this.withFallback(
            () => api.get('/api/documents'),
            sampleDocuments
        );
    }

    async uploadDocument(formData) {
        return this.withFallback(
            () => api.post('/api/upload-document', formData),
            {
                success: true,
                message: 'Document uploaded successfully (sample data)',
                filename: formData.get('image').name,
                size: formData.get('image').size,
                analysis: { message: 'Sample analysis result' }
            }
        );
    }

    // Server connection status
    getServerStatus() {
        return this.isServerConnected;
    }
}

export default new HealthDataService();