// src/pages/MyFactsPage.jsx
import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/ui/CategoryCard';
import ServerStatusIndicator from '../components/ui/ServerStatusIndicator';
import { Droplet, Syringe, FileText, Pill, Plus } from 'lucide-react';
import healthDataService from '../services/healthDataService';
import BloodTestsDetail from './detail/BloodTestDetail';
import VaccinationsDetail from './detail/VaccinationDetail';
import MedicalReportsDetail from './detail/MedicalReportDetail';
import MedicationsDetail from './detail/MedicationsDetail';

const MyFactsPage = () => {
  const [activeDetail, setActiveDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState({
    bloodTests: [],
    vaccinations: [],
    medicalReports: [],
    medications: []
  });

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all health data in parallel
      const [bloodTests, vaccinations, medicalReports, medications] = await Promise.all([
        healthDataService.getBloodTests(),
        healthDataService.getVaccinations(),
        healthDataService.getMedicalReports(),
        healthDataService.getMedications()
      ]);

      setHealthData({
        bloodTests,
        vaccinations,
        medicalReports,
        medications
      });
    } catch (error) {
      console.error('Failed to load health data:', error);
      setError('Fehler beim Laden der Gesundheitsdaten. Sample-Daten werden verwendet.');
    } finally {
      setLoading(false);
    }
  };

  // Get most recent data for display
  const getRecentData = (data) => {
    if (!data || data.length === 0) return null;

    // Sort by date and return the most recent
    const sortedData = [...data].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    return sortedData[0];
  };

  // Count medications properly
  const getMedicationCount = () => {
    if (!healthData.medications || healthData.medications.length === 0) return 0;

    let count = 0;
    healthData.medications.forEach(record => {
      if (record.medikamente) {
        count += Object.keys(record.medikamente).length;
      }
    });
    return count;
  };

  const healthCategories = [
    {
      id: 'bloodTests',
      title: 'Blutbild',
      icon: { element: <Droplet size={22} />, color: '#FF2D55' },
      lastUpdated: getRecentData(healthData.bloodTests)?.date
          ? new Date(getRecentData(healthData.bloodTests).date).toLocaleDateString('de-DE')
          : 'Noch keine Daten',
      value: healthData.bloodTests?.length || 0,
      unit: healthData.bloodTests?.length === 1 ? 'Test' : 'Tests'
    },
    {
      id: 'vaccinations',
      title: 'Impfpass',
      icon: { element: <Syringe size={22} />, color: '#4CD964' },
      lastUpdated: getRecentData(healthData.vaccinations)?.impfungen?.[0]?.Impfdatum
          ? new Date(getRecentData(healthData.vaccinations).impfungen[0].Impfdatum).toLocaleDateString('de-DE')
          : 'Noch keine Daten',
      value: healthData.vaccinations?.reduce((total, record) => total + (record.impfungen?.length || 0), 0) || 0,
      unit: 'Impfungen'
    },
    {
      id: 'medicalReports',
      title: 'Befunde',
      icon: { element: <FileText size={22} />, color: '#007AFF' },
      lastUpdated: getRecentData(healthData.medicalReports)?.date
          ? new Date(getRecentData(healthData.medicalReports).date).toLocaleDateString('de-DE')
          : 'Noch keine Daten',
      value: healthData.medicalReports?.length || 0,
      unit: healthData.medicalReports?.length === 1 ? 'Befund' : 'Befunde'
    },
    {
      id: 'medications',
      title: 'Medikation',
      icon: { element: <Pill size={22} />, color: '#AF52DE' },
      lastUpdated: getRecentData(healthData.medications)?.date
          ? new Date(getRecentData(healthData.medications).date).toLocaleDateString('de-DE')
          : 'Noch keine Daten',
      value: getMedicationCount(),
      unit: 'Medikamente'
    },
  ];

  const handleCategoryClick = (category) => {
    setActiveDetail(category.id);
  };

  const handleBack = () => {
    setActiveDetail(null);
    // Reload data when returning from detail view
    loadHealthData();
  };

  // Render detail view
  if (activeDetail) {
    switch (activeDetail) {
      case 'bloodTests':
        return <BloodTestsDetail onBack={handleBack} data={healthData.bloodTests} />;
      case 'vaccinations':
        return <VaccinationsDetail onBack={handleBack} data={healthData.vaccinations} />;
      case 'medicalReports':
        return <MedicalReportsDetail onBack={handleBack} data={healthData.medicalReports} />;
      case 'medications':
        return <MedicationsDetail onBack={handleBack} data={healthData.medications} />;
      default:
        return null;
    }
  }

  // Main overview
  return (
      <div className="p-4 pb-20">
        <div className="mb-4">
          <ServerStatusIndicator position="content" />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Gesundheitsdaten</h2>
          {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
          ) : (
              <div>
                {error && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
                      {error}
                    </div>
                )}
                {healthCategories.map(category => (
                    <CategoryCard
                        key={category.id}
                        title={category.title}
                        icon={category.icon}
                        lastUpdated={category.lastUpdated !== 'Noch keine Daten' ? `Zuletzt: ${category.lastUpdated}` : category.lastUpdated}
                        value={category.value}
                        unit={category.unit}
                        onClick={() => handleCategoryClick(category)}
                    />
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default MyFactsPage;