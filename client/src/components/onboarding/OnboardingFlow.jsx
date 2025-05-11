// src/components/onboarding/OnboardingFlow.jsx
import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  User,
  Pill,
  Syringe,
  FileText,
  Upload,
  Check,
  Trash2,
  Plus,
  Edit,
  Camera,
  ArrowLeft,
  Droplet
} from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      first: '',
      last: '',
      weight: '',
      height: ''
    },
    medications: {
      manualData: [],
      scannedDocument: null
    },
    vaccinations: {
      manualData: [],
      scannedDocument: null
    },
    medicalReports: {
      manualData: [],
      scannedDocument: null
    },
    bloodTests: {
      manualData: [],
      scannedDocument: null
    }
  });

  const totalSteps = 7; // Welcome, Personal Info, Medications, Vaccinations, Medical Reports, Blood Tests, Complete

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
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
        return <MedicationsStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <VaccinationsStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <MedicalReportsStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <BloodTestsStep formData={formData} setFormData={setFormData} />;
      case 6:
        return <CompleteStep formData={formData} />;
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
          {currentStep === totalSteps - 1 ? 'Onboarding abschließen' : 'Weiter'}
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

// Step Components
const WelcomeStep = () => (
    <div className="text-center pt-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
        <Heart className="text-teal-600" size={40} />
      </div>
      <h1 className="text-2xl font-bold mb-4">Willkommen bei Health Tracker</h1>
      <p className="text-gray-600 mb-8">
        Lass uns Dein persönliches Gesundheitsprofil einrichten. Dies hilft uns, Dir
        die bestmögliche Betreuung zu bieten.
      </p>
      <div className="space-y-4">
        <div className="flex items-center text-left">
          <User className="text-teal-500 mr-3" size={20} />
          <span>Persönliche Informationen</span>
        </div>
        <div className="flex items-center text-left">
          <Pill className="text-teal-500 mr-3" size={20} />
          <span>Medikamente</span>
        </div>
        <div className="flex items-center text-left">
          <Syringe className="text-teal-500 mr-3" size={20} />
          <span>Impfpass</span>
        </div>
        <div className="flex items-center text-left">
          <FileText className="text-teal-500 mr-3" size={20} />
          <span>Befunde</span>
        </div>
        <div className="flex items-center text-left">
          <Droplet className="text-teal-500 mr-3" size={20} />
          <span>Blutbild</span>
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
              value={formData.personalInfo.first}
              onChange={(e) => updateFormData('personalInfo', 'first', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Max"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Nachname</label>
          <input
              type="text"
              value={formData.personalInfo.last}
              onChange={(e) => updateFormData('personalInfo', 'last', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Mustermann"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Gewicht (kg)</label>
          <input
              type="number"
              value={formData.personalInfo.weight}
              onChange={(e) => updateFormData('personalInfo', 'weight', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="75"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Größe (cm)</label>
          <input
              type="number"
              value={formData.personalInfo.height}
              onChange={(e) => updateFormData('personalInfo', 'height', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="180"
          />
        </div>
      </div>
    </div>
);

// Medical Step Template for Medications, Vaccinations, Medical Reports, and Blood Tests
const MedicalStepTemplate = ({
                               title,
                               icon,
                               itemType,
                               formData,
                               setFormData,
                               ManualFormComponent,
                               documentType
                             }) => {
  const [inputMode, setInputMode] = useState('choice'); // 'choice', 'manual', 'scan'
  const [documentPreview, setDocumentPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const document = {
        name: file.name,
        size: file.size,
        data: reader.result,
        date: new Date().toISOString().split('T')[0]
      };

      setFormData(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          scannedDocument: document
        }
      }));
      setDocumentPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setInputMode('scan');
  };

  const removeDocument = () => {
    setFormData(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        scannedDocument: null
      }
    }));
    setDocumentPreview(null);
    setInputMode('choice');
  };

  if (inputMode === 'choice') {
    return (
        <div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
              {icon}
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Wie möchtest Du Deine {title.toLowerCase()} hinzufügen?
          </p>

          <div className="space-y-4">
            <button
                onClick={() => setInputMode('manual')}
                className="w-full flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 transition-colors"
            >
              <Edit size={24} className="mr-3 text-teal-600" />
              <span className="font-medium">Manuell eingeben</span>
            </button>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 transition-colors"
            >
              <Camera size={24} className="mr-3 text-teal-600" />
              <span className="font-medium">Dokument scannen</span>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
            />
          </div>

          {formData[itemType].manualData.length > 0 || formData[itemType].scannedDocument && (
              <div className="mt-6">
                <h3 className="font-medium mb-2 text-gray-700">Bereits hinzugefügt:</h3>
                {formData[itemType].manualData.length > 0 && (
                    <div className="text-sm text-teal-600">✓ {formData[itemType].manualData.length} manuell eingetragen</div>
                )}
                {formData[itemType].scannedDocument && (
                    <div className="text-sm text-teal-600">✓ 1 Dokument gescannt</div>
                )}
              </div>
          )}
        </div>
    );
  }

  if (inputMode === 'manual') {
    return (
        <div>
          <button
              onClick={() => setInputMode('choice')}
              className="flex items-center text-teal-600 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Zurück
          </button>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
              {icon}
            </div>
            <h2 className="text-xl font-bold">{title} - Manuell</h2>
          </div>

          <ManualFormComponent
              formData={formData}
              setFormData={setFormData}
              itemType={itemType}
          />

          <div className="mt-6">
            <button
                onClick={() => setInputMode('choice')}
                className="w-full bg-teal-500 text-white py-3 rounded-lg"
            >
              Fertig
            </button>
          </div>
        </div>
    );
  }

  if (inputMode === 'scan') {
    return (
        <div>
          <button
              onClick={() => setInputMode('choice')}
              className="flex items-center text-teal-600 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Zurück
          </button>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
              {icon}
            </div>
            <h2 className="text-xl font-bold">{title} - Dokument</h2>
          </div>

          {documentPreview ? (
              <div>
                <div className="relative mb-4">
                  <img
                      src={documentPreview}
                      alt="Scanned document"
                      className="w-full h-64 object-contain rounded-lg border border-gray-200"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm">{formData[itemType].scannedDocument?.name}</span>
                  </div>
                  <button
                      onClick={removeDocument}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                    onClick={() => setInputMode('choice')}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg"
                >
                  Dokument verwenden
                </button>
              </div>
          ) : (
              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 transition-colors"
              >
                <Upload size={48} className="text-teal-500 mb-4" />
                <span className="text-center text-gray-600">Dokument hochladen</span>
                <span className="text-sm text-gray-500 mt-1">PDF, JPG, PNG bis 10MB</span>
              </button>
          )}

          <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
          />
        </div>
    );
  }
};

// Manual Form Components
const MedicationsManualForm = ({ formData, setFormData, itemType }) => {
  const [currentMedication, setCurrentMedication] = useState({
    name: '',
    dailyIntake: ''
  });

  const addMedication = () => {
    if (currentMedication.name && currentMedication.dailyIntake) {
      setFormData(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          manualData: [...prev[itemType].manualData, { ...currentMedication }]
        }
      }));
      setCurrentMedication({ name: '', dailyIntake: '' });
    }
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        manualData: prev[itemType].manualData.filter((_, i) => i !== index)
      }
    }));
  };

  return (
      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="space-y-3">
            <input
                type="text"
                value={currentMedication.name}
                onChange={(e) => setCurrentMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Medikamentenname"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
                type="text"
                value={currentMedication.dailyIntake}
                onChange={(e) => setCurrentMedication(prev => ({ ...prev, dailyIntake: e.target.value }))}
                placeholder="Dosierung (z.B. 1-0-1)"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
                onClick={addMedication}
                className="flex items-center justify-center w-full py-2 bg-teal-500 text-white rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              Medikament hinzufügen
            </button>
          </div>
        </div>

        {formData[itemType].manualData.length > 0 && (
            <div className="space-y-2">
              {formData[itemType].manualData.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-gray-500">{med.dailyIntake}</div>
                    </div>
                    <button
                        onClick={() => removeMedication(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

const VaccinationsManualForm = ({ formData, setFormData, itemType }) => {
  const [currentVaccination, setCurrentVaccination] = useState({
    name: '',
    date: '',
    disease: ''
  });

  const addVaccination = () => {
    if (currentVaccination.name && currentVaccination.date) {
      setFormData(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          manualData: [...prev[itemType].manualData, { ...currentVaccination }]
        }
      }));
      setCurrentVaccination({ name: '', date: '', disease: '' });
    }
  };

  const removeVaccination = (index) => {
    setFormData(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        manualData: prev[itemType].manualData.filter((_, i) => i !== index)
      }
    }));
  };

  return (
      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="space-y-3">
            <input
                type="text"
                value={currentVaccination.name}
                onChange={(e) => setCurrentVaccination(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Impfstoffname"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
                type="text"
                value={currentVaccination.disease}
                onChange={(e) => setCurrentVaccination(prev => ({ ...prev, disease: e.target.value }))}
                placeholder="Schutz gegen (z.B. Tetanus)"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
                type="date"
                value={currentVaccination.date}
                onChange={(e) => setCurrentVaccination(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
                onClick={addVaccination}
                className="flex items-center justify-center w-full py-2 bg-teal-500 text-white rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              Impfung hinzufügen
            </button>
          </div>
        </div>

        {formData[itemType].manualData.length > 0 && (
            <div className="space-y-2">
              {formData[itemType].manualData.map((vaccination, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{vaccination.name}</div>
                      <div className="text-sm text-gray-500">
                        {vaccination.disease} • {new Date(vaccination.date).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <button
                        onClick={() => removeVaccination(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

const MedicalReportsManualForm = ({ formData, setFormData, itemType }) => {
  const [currentReport, setCurrentReport] = useState({
    title: '',
    date: '',
    summary: ''
  });

  const addReport = () => {
    if (currentReport.title && currentReport.date) {
      setFormData(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          manualData: [...prev[itemType].manualData, { ...currentReport }]
        }
      }));
      setCurrentReport({ title: '', date: '', summary: '' });
    }
  };

  const removeReport = (index) => {
    setFormData(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        manualData: prev[itemType].manualData.filter((_, i) => i !== index)
      }
    }));
  };

  return (
      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="space-y-3">
            <input
                type="text"
                value={currentReport.title}
                onChange={(e) => setCurrentReport(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titel des Befunds"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
                type="date"
                value={currentReport.date}
                onChange={(e) => setCurrentReport(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
                value={currentReport.summary}
                onChange={(e) => setCurrentReport(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Zusammenfassung (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={3}
            />
            <button
                onClick={addReport}
                className="flex items-center justify-center w-full py-2 bg-teal-500 text-white rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              Befund hinzufügen
            </button>
          </div>
        </div>

        {formData[itemType].manualData.length > 0 && (
            <div className="space-y-2">
              {formData[itemType].manualData.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString('de-DE')}
                      </div>
                      {report.summary && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{report.summary}</div>
                      )}
                    </div>
                    <button
                        onClick={() => removeReport(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

// New Blood Tests Manual Form Component
const BloodTestsManualForm = ({ formData, setFormData, itemType }) => {
  const [currentBloodTest, setCurrentBloodTest] = useState({
    date: '',
    parameters: []
  });

  const [currentParameter, setCurrentParameter] = useState({
    name: '',
    value: ''
  });

  const addParameter = () => {
    if (currentParameter.name && currentParameter.value) {
      setCurrentBloodTest(prev => ({
        ...prev,
        parameters: [...prev.parameters, { ...currentParameter }]
      }));
      setCurrentParameter({ name: '', value: '' });
    }
  };

  const removeParameter = (index) => {
    setCurrentBloodTest(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const addBloodTest = () => {
    if (currentBloodTest.date && currentBloodTest.parameters.length > 0) {
      setFormData(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          manualData: [...prev[itemType].manualData, { ...currentBloodTest }]
        }
      }));
      setCurrentBloodTest({ date: '', parameters: [] });
    }
  };

  const removeBloodTest = (index) => {
    setFormData(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        manualData: prev[itemType].manualData.filter((_, i) => i !== index)
      }
    }));
  };

  return (
      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-3">Neues Blutbild</h3>
          <div className="space-y-3">
            <input
                type="date"
                value={currentBloodTest.date}
                onChange={(e) => setCurrentBloodTest(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Datum der Untersuchung"
            />

            <div className="border-t pt-3">
              <h4 className="text-sm text-gray-600 mb-2">Parameter hinzufügen</h4>
              <div className="space-y-2">
                <input
                    type="text"
                    value={currentParameter.name}
                    onChange={(e) => setCurrentParameter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Parameter (z.B. Hämoglobin)"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                    type="number"
                    step="0.1"
                    value={currentParameter.value}
                    onChange={(e) => setCurrentParameter(prev => ({ ...prev, value: parseFloat(e.target.value) || '' }))}
                    placeholder="Wert (z.B. 15.2)"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={addParameter}
                    className="w-full py-2 bg-teal-500 text-white rounded-lg"
                >
                  Parameter hinzufügen
                </button>
              </div>
            </div>

            {/* Current parameters for this blood test */}
            {currentBloodTest.parameters.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-sm text-gray-600 mb-2">Parameter für dieses Blutbild</h4>
                  <div className="space-y-1">
                    {currentBloodTest.parameters.map((param, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{param.name}: {param.value}</span>
                          <button
                              onClick={() => removeParameter(index)}
                              className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            <button
                onClick={addBloodTest}
                className="flex items-center justify-center w-full py-2 bg-teal-600 text-white rounded-lg"
                disabled={!currentBloodTest.date || currentBloodTest.parameters.length === 0}
            >
              <Plus size={16} className="mr-2" />
              Blutbild hinzufügen
            </button>
          </div>
        </div>

        {/* Saved blood tests */}
        {formData[itemType].manualData.length > 0 && (
            <div className="space-y-2">
              {formData[itemType].manualData.map((bloodTest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">
                        Blutbild vom {new Date(bloodTest.date).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bloodTest.parameters.length} Parameter
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {bloodTest.parameters.slice(0, 3).map(p => p.name).join(', ')}
                        {bloodTest.parameters.length > 3 && '...'}
                      </div>
                    </div>
                    <button
                        onClick={() => removeBloodTest(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

// Main Steps
const MedicationsStep = ({ formData, setFormData }) => {
  return (
      <MedicalStepTemplate
          title="Medikamente"
          icon={<Pill size={24} />}
          itemType="medications"
          formData={formData}
          setFormData={setFormData}
          ManualFormComponent={MedicationsManualForm}
          documentType="medication"
      />
  );
};

const VaccinationsStep = ({ formData, setFormData }) => {
  return (
      <MedicalStepTemplate
          title="Impfpass"
          icon={<Syringe size={24} />}
          itemType="vaccinations"
          formData={formData}
          setFormData={setFormData}
          ManualFormComponent={VaccinationsManualForm}
          documentType="vaccination"
      />
  );
};

const MedicalReportsStep = ({ formData, setFormData }) => {
  return (
      <MedicalStepTemplate
          title="Befunde"
          icon={<FileText size={24} />}
          itemType="medicalReports"
          formData={formData}
          setFormData={setFormData}
          ManualFormComponent={MedicalReportsManualForm}
          documentType="medicalReport"
      />
  );
};

// New Blood Tests Step
const BloodTestsStep = ({ formData, setFormData }) => {
  return (
      <MedicalStepTemplate
          title="Blutbild"
          icon={<Droplet size={24} />}
          itemType="bloodTests"
          formData={formData}
          setFormData={setFormData}
          ManualFormComponent={BloodTestsManualForm}
          documentType="blutbild"
      />
  );
};

// Complete Step
const CompleteStep = ({ formData }) => {
  const getItemCount = (item) => {
    return (item.manualData?.length || 0) + (item.scannedDocument ? 1 : 0);
  };

  return (
      <div className="text-center pt-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-4">Onboarding abgeschlossen!</h1>
        <p className="text-gray-600 mb-8">
          Deine Gesundheitsdaten wurden erfolgreich eingerichtet.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Pill className="text-teal-500 mr-3" size={20} />
              <span>Medikamente</span>
            </div>
            <span className="text-gray-600">{getItemCount(formData.medications)} hinzugefügt</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Syringe className="text-teal-500 mr-3" size={20} />
              <span>Impfungen</span>
            </div>
            <span className="text-gray-600">{getItemCount(formData.vaccinations)} hinzugefügt</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-teal-500 mr-3" size={20} />
              <span>Befunde</span>
            </div>
            <span className="text-gray-600">{getItemCount(formData.medicalReports)} hinzugefügt</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Droplet className="text-teal-500 mr-3" size={20} />
              <span>Blutbild</span>
            </div>
            <span className="text-gray-600">{getItemCount(formData.bloodTests)} hinzugefügt</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Du kannst jederzeit weitere Informationen in deinem Profil hinzufügen.
        </p>
      </div>
  );
};

export default OnboardingFlow;