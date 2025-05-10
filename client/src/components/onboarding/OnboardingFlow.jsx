// src/components/onboarding/OnboardingFlow.jsx
import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Smartphone,
  User,
  Calendar,
  Check,
  X,
  Pill,
  Activity,
  AlertTriangle,
  FileText,
  Apple,
  Watch
} from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      bloodType: ''
    },
    medications: [],
    medicalHistory: {
      painLocation: null,
      painDuration: '',
      painTriggers: '',
      previousTreatments: '',
      accompaniedComplaints: [],
      wantsSickLeave: null
    },
    deviceIntegration: {
      appleHealth: false,
      appleWatch: false,
      googleFit: false
    }
  });

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Call the onComplete function with formData
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleMedication = (medication) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.includes(medication)
          ? prev.medications.filter(m => m !== medication)
          : [...prev.medications, medication]
    }));
  };

  const toggleComplaint = (complaint) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        accompaniedComplaints: prev.medicalHistory.accompaniedComplaints.includes(complaint)
            ? prev.medicalHistory.accompaniedComplaints.filter(c => c !== complaint)
            : [...prev.medicalHistory.accompaniedComplaints, complaint]
      }
    }));
  };

  const renderProgressBar = () => (
      <div className="flex justify-center space-x-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-teal-500' : 'bg-gray-300'
                }`}
            />
        ))}
      </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <MedicationsStep formData={formData} toggleMedication={toggleMedication} />;
      case 3:
        return <HealthHistoryStep
            formData={formData}
            updateFormData={updateFormData}
            toggleComplaint={toggleComplaint}
        />;
      case 4:
        return <DeviceIntegrationStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const renderButtons = () => (
      <div className="flex justify-between mt-8">
        <button
            onClick={prevStep}
            className={`flex items-center px-4 py-2 text-teal-600 ${
                currentStep === 0 ? 'invisible' : ''
            }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Zurück
        </button>

        <button
            onClick={nextStep}
            className={`flex items-center px-6 py-2 bg-teal-500 text-white rounded-full ${
                currentStep === totalSteps - 1 ? 'px-8' : ''
            }`}
        >
          {currentStep === totalSteps - 1 ? 'App starten' : 'Weiter'}
          {currentStep !== totalSteps - 1 && <ChevronRight size={20} className="ml-1" />}
        </button>
      </div>
  );

  return (
      <div className="max-w-md mx-auto h-screen bg-white overflow-y-auto">
        <div className="p-6">
          {currentStep > 0 && renderProgressBar()}

          {renderStepContent()}
          {renderButtons()}
        </div>
      </div>
  );
};

// Step Components (rest of the components remain the same)
const WelcomeStep = () => (
    <div className="text-center pt-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
        <Heart className="text-teal-600" size={40} />
      </div>
      <h1 className="text-2xl font-bold mb-4">Willkommen bei Health Tracker</h1>
      <p className="text-gray-600 mb-8">
        In wenigen Schritten richten wir Ihr persönliches Gesundheitsprofil ein,
        damit Ihr Arzt Sie bestmöglich betreuen kann.
      </p>
      <div className="space-y-4">
        <div className="flex items-center text-left">
          <User className="text-teal-500 mr-3" size={20} />
          <span>Persönliche Informationen</span>
        </div>
        <div className="flex items-center text-left">
          <Pill className="text-teal-500 mr-3" size={20} />
          <span>Aktuelle Medikamente</span>
        </div>
        <div className="flex items-center text-left">
          <FileText className="text-teal-500 mr-3" size={20} />
          <span>Gesundheitsverlauf</span>
        </div>
        <div className="flex items-center text-left">
          <Activity className="text-teal-500 mr-3" size={20} />
          <span>Geräte-Integration</span>
        </div>
      </div>
    </div>
);

const PersonalInfoStep = ({ formData, updateFormData }) => (
    <div>
      <h2 className="text-xl font-bold mb-4">Persönliche Informationen</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Vorname</label>
          <input
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Max"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Nachname</label>
          <input
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Mustermann"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Geburtsdatum</label>
          <input
              type="date"
              value={formData.personalInfo.birthDate}
              onChange={(e) => updateFormData('personalInfo', 'birthDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Geschlecht</label>
          <select
              value={formData.personalInfo.gender}
              onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Bitte wählen</option>
            <option value="male">Männlich</option>
            <option value="female">Weiblich</option>
            <option value="diverse">Divers</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Blutgruppe (optional)</label>
          <select
              value={formData.personalInfo.bloodType}
              onChange={(e) => updateFormData('personalInfo', 'bloodType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Bitte wählen</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>
    </div>
);

const MedicationsStep = ({ formData, toggleMedication }) => {
  const commonMedications = [
    'Ibuprofen',
    'Paracetamol',
    'Aspirin',
    'Blutdrucksenker',
    'Insulin',
    'Blutverdünner',
    'Antidepressiva',
    'Cholesterinsenker',
    'Antibiotika',
    'Andere'
  ];

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Aktuelle Medikamente</h2>
        <p className="text-gray-600 mb-6">
          Welche Medikamente nehmen Sie derzeit regelmäßig ein?
        </p>

        <div className="space-y-3">
          {commonMedications.map((medication) => (
              <label key={medication} className="flex items-center">
                <input
                    type="checkbox"
                    checked={formData.medications.includes(medication)}
                    onChange={() => toggleMedication(medication)}
                    className="mr-3 w-5 h-5 text-teal-600"
                />
                <span>{medication}</span>
              </label>
          ))}
        </div>

        {formData.medications.includes('Andere') && (
            <div className="mt-4">
              <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Bitte angeben..."
              />
            </div>
        )}
      </div>
  );
};

const HealthHistoryStep = ({ formData, updateFormData, toggleComplaint }) => {
  const painLocations = [
    { id: 'head', label: 'Stirn, Schläfen und/oder Nacken' },
    { id: 'back', label: 'Hinterkopf' },
    { id: 'face', label: 'Im Gesicht' },
    { id: 'eye', label: 'Um das Auge' },
    { id: 'side', label: 'Eine Seite des Kopfes' }
  ];

  const complaints = [
    'Sehstörungen',
    'Nackensteife',
    'Schwindel',
    'Kribbeln- oder Taubheitsgefühl',
    'Krämpfe',
    'Übelkeit',
    'Erbrechen'
  ];

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Anamnese</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Schmerzlokalisation</label>
            <div className="space-y-2">
              {painLocations.map((location) => (
                  <label key={location.id} className="flex items-center">
                    <input
                        type="radio"
                        checked={formData.medicalHistory.painLocation === location.id}
                        onChange={() => updateFormData('medicalHistory', 'painLocation', location.id)}
                        className="mr-3 w-4 h-4 text-teal-600"
                    />
                    <span>{location.label}</span>
                  </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dauer</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                    type="radio"
                    checked={formData.medicalHistory.painDuration === 'weekly'}
                    onChange={() => updateFormData('medicalHistory', 'painDuration', 'weekly')}
                    className="mr-2 w-4 h-4 text-teal-600"
                />
                <span>Mehrmals die Woche</span>
              </label>
              <label className="flex items-center">
                <input
                    type="radio"
                    checked={formData.medicalHistory.painDuration === 'weeksAgo'}
                    onChange={() => updateFormData('medicalHistory', 'painDuration', 'weeksAgo')}
                    className="mr-2 w-4 h-4 text-teal-600"
                />
                <span>Seit einigen Wochen</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Weitere Beschwerden</label>
            <div className="space-y-2">
              {complaints.map((complaint) => (
                  <label key={complaint} className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.medicalHistory.accompaniedComplaints.includes(complaint)}
                        onChange={() => toggleComplaint(complaint)}
                        className="mr-3 w-5 h-5 text-teal-600"
                    />
                    <span>{complaint}</span>
                  </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Krankschreibungswunsch</label>
            <div className="flex space-x-8">
              <label className="flex items-center">
                <input
                    type="radio"
                    checked={formData.medicalHistory.wantsSickLeave === true}
                    onChange={() => updateFormData('medicalHistory', 'wantsSickLeave', true)}
                    className="mr-2 w-4 h-4 text-teal-600"
                />
                <span>Ja</span>
              </label>
              <label className="flex items-center">
                <input
                    type="radio"
                    checked={formData.medicalHistory.wantsSickLeave === false}
                    onChange={() => updateFormData('medicalHistory', 'wantsSickLeave', false)}
                    className="mr-2 w-4 h-4 text-teal-600"
                />
                <span>Nein</span>
              </label>
            </div>
          </div>
        </div>
      </div>
  );
};

const DeviceIntegrationStep = ({ formData, updateFormData }) => {
  const devices = [
    {
      id: 'appleHealth',
      name: 'Apple Health',
      icon: <Apple size={24} />,
      description: 'Synchronisieren Sie Ihre Gesundheitsdaten'
    },
    {
      id: 'appleWatch',
      name: 'Apple Watch',
      icon: <Watch size={24} />,
      description: 'Aktivitäts- und Herzfrequenzdaten importieren'
    },
    {
      id: 'googleFit',
      name: 'Google Fit',
      icon: <Activity size={24} />,
      description: 'Fitness- und Aktivitätsdaten synchronisieren'
    }
  ];

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Geräte-Integration</h2>
        <p className="text-gray-600 mb-6">
          Verbinden Sie Ihre Gesundheitsgeräte für automatische Datenerfassung
        </p>

        <div className="space-y-4">
          {devices.map((device) => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                      {device.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-sm text-gray-500">{device.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.deviceIntegration[device.id]}
                        onChange={(e) => updateFormData('deviceIntegration', device.id, e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-teal-700">
            <AlertTriangle className="inline mr-2" size={16} />
            Diese Integrationen sind derzeit in der Testphase. Sie können diese später in den Einstellungen anpassen.
          </p>
        </div>
      </div>
  );
};

export default OnboardingFlow;