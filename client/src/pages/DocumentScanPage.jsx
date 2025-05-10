// src/pages/DocumentScanPage.jsx
import React from 'react';
import { Camera, Upload, FileText } from 'lucide-react';

const DocumentScanPage = () => {
  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-4">Scan Documents</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="flex flex-col items-center justify-center h-32 bg-white rounded-lg shadow-sm p-4">
          <Camera size={32} className="text-blue-500 mb-2" />
          <span className="text-center">Scan with Camera</span>
        </button>

        <button className="flex flex-col items-center justify-center h-32 bg-white rounded-lg shadow-sm p-4">
          <Upload size={32} className="text-blue-500 mb-2" />
          <span className="text-center">Upload Document</span>
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-3">Recent Documents</h3>
      <div className="space-y-2">
        {[
          { id: 1, name: 'Blood Test Results', date: 'May 5, 2025' },
          { id: 2, name: 'Prescription', date: 'April 28, 2025' },
          { id: 3, name: 'Medical Certificate', date: 'April 15, 2025' }
        ].map(doc => (
          <div key={doc.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{doc.name}</h4>
              <p className="text-xs text-gray-500">{doc.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentScanPage;