// src/pages/DocumentScanPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Trash2, Server } from 'lucide-react';
import healthDataService from '../services/healthDataService';
import ServerStatusIndicator from '../components/ui/ServerStatusIndicator';

const DocumentScanPage = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [uploadError, setUploadError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState('other');
  const [pythonServerStatus, setPythonServerStatus] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocuments();
    checkServers();
  }, []);

  const checkServers = async () => {
    const javaStatus = await healthDataService.checkServerConnection();
    const pythonStatus = await healthDataService.checkPythonServerConnection();
    setPythonServerStatus(pythonStatus);

    console.log('Server Status:', { java: javaStatus, python: pythonStatus });
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await healthDataService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send image to server
  const sendImageToServer = async () => {
    if (!capturedImage) return;

    setUploadStatus('uploading');
    setUploadError('');
    setAnalysisResult(null);

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('image', blob, 'scanned-document.jpg');
      formData.append('timestamp', new Date().toISOString());
      formData.append('document', documentType);

      // Send POST request to Python server
      const result = await healthDataService.uploadDocument(formData);

      if (result.success) {
        setUploadStatus('success');
        setAnalysisResult(result);

        // Reload documents list
        loadDocuments();

        // Reset after 5 seconds to show results
        setTimeout(() => {
          setCapturedImage(null);
          setUploadStatus(null);
          setDocumentType('other');
          setAnalysisResult(null);
        }, 5000);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message);
      setUploadStatus('error');
    }
  };

  // Get document type icon
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'bloodTest':
        return '🩸';
      case 'vaccination':
        return '💉';
      case 'medicalReport':
        return '📋';
      case 'medication':
        return '💊';
      default:
        return '📄';
    }
  };

  // Get document type color
  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'bloodTest':
        return 'text-red-500 bg-red-50';
      case 'vaccination':
        return 'text-green-500 bg-green-50';
      case 'medicalReport':
        return 'text-blue-500 bg-blue-50';
      case 'medication':
        return 'text-purple-500 bg-purple-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
      <div className="p-4 pb-20">
        <h2 className="text-2xl font-bold mb-4">Dokumente scannen</h2>

        <div className="mb-4 space-y-2">
          <ServerStatusIndicator position="content" />

          {/* Python Server Status */}
          <div className={`${
              pythonServerStatus
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
          } border rounded-lg p-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <Server size={20} className={pythonServerStatus ? 'text-green-600' : 'text-red-600'} />
              <div>
                <div className="font-medium">
                  Dokument-Analyse {pythonServerStatus ? 'verfügbar' : 'nicht verfügbar'}
                </div>
                <div className="text-sm opacity-75">
                  {pythonServerStatus
                      ? 'KI-Analyse und OCR aktiviert'
                      : 'Dokumentanalyse temporär deaktiviert'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Options */}
        {!capturedImage && (
            <div>
              <div className="mb-4">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!pythonServerStatus}
                    className={`w-full flex flex-col items-center justify-center h-32 rounded-lg shadow-sm p-4 border-2 border-dashed transition-colors ${
                        pythonServerStatus
                            ? 'bg-white border-gray-300 hover:border-blue-500'
                            : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    }`}
                >
                  <Upload size={32} className={pythonServerStatus ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="text-center">
                    {pythonServerStatus ? 'Dokument hochladen' : 'Dokumentanalyse nicht verfügbar'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {pythonServerStatus ? 'PDF, JPG, PNG bis 10MB' : 'Python-Server nicht erreichbar'}
                  </span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={!pythonServerStatus}
              />
            </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && !uploadStatus && (
            <div className="space-y-4">
              <div className="relative">
                <img
                    src={capturedImage}
                    alt="Selected document"
                    className="w-full h-96 object-contain rounded-lg border border-gray-200"
                />
              </div>

              {/* Document Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dokumenttyp wählen
                </label>
                <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="other">Sonstiges</option>
                  <option value="blutbild">Blutbild</option>
                  <option value="impfpass">Impfpass</option>
                  <option value="befund">Arztbefund</option>
                  <option value="medikation">Medikationsplan</option>
                </select>
              </div>

              {/* Upload Buttons */}
              <div className="flex space-x-4">
                <button
                    onClick={sendImageToServer}
                    disabled={uploadStatus === 'uploading' || !pythonServerStatus}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  {uploadStatus === 'uploading' ? (
                      <>
                        <Loader className="animate-spin mr-2" size={20} />
                        Wird analysiert...
                      </>
                  ) : (
                      <>
                        <Upload className="mr-2" size={20} />
                        Dokument analysieren
                      </>
                  )}
                </button>

                <button
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg"
                >
                  <Trash2 className="mr-2 inline" size={20} />
                  Abbrechen
                </button>
              </div>
            </div>
        )}

        {/* Upload Status */}
        {uploadStatus && (
            <div className="mb-6">
              {uploadStatus === 'success' && analysisResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-600 mb-4">
                      <CheckCircle className="mr-2" size={20} />
                      <h3 className="font-semibold">Dokument erfolgreich analysiert!</h3>
                    </div>

                    {/* Analysis Results */}
                    {analysisResult.analysis && (
                        <div className="text-sm space-y-2">
                          <p><strong>Status:</strong> {analysisResult.analysis.status || 'Analysiert'}</p>
                          <p><strong>Erkannte Daten:</strong></p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(analysisResult.analysis, null, 2)}
                          </pre>
                        </div>
                    )}
                  </div>
              )}

              {uploadStatus === 'error' && (
                  <div className="flex items-center justify-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="mr-2" size={20} />
                    <span>Fehler: {uploadError}</span>
                  </div>
              )}
            </div>
        )}

        {/* Recent Documents */}
        <h3 className="text-lg font-semibold mb-3 mt-8">Ihre Dokumente</h3>

        {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        ) : documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map(doc => (
                  <div key={doc.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDocumentTypeColor(doc.type)} mr-3`}>
                      <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{(doc.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <FileText size={16} className="text-gray-400" />
                    </button>
                  </div>
              ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 py-8">
              Noch keine Dokumente hochgeladen
            </div>
        )}
      </div>
  );
};

export default DocumentScanPage;