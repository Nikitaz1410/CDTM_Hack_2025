// src/pages/detail/MedicalReportsDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

const MedicalReportsDetail = ({ onBack, data = [] }) => {
    const [expandedReport, setExpandedReport] = useState(null);
    const [expandedParagraphs, setExpandedParagraphs] = useState({});

    // Toggle paragraph expansion
    const toggleParagraph = (reportIndex, paragraphIndex) => {
        const key = `${reportIndex}-${paragraphIndex}`;
        setExpandedParagraphs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'normal':
                return 'bg-green-100 text-green-700';
            case 'warning':
                return 'bg-yellow-100 text-yellow-700';
            case 'critical':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Sort reports by date (newest first)
    const sortedReports = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button onClick={onBack} className="mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Befunde</h1>
                <button className="ml-auto">
                    <Plus size={24} />
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto pb-20">
                {/* Summary Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                        <div className="text-sm text-gray-600">Befunde gesamt</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {data.filter(r => r.status === 'normal').length}
                        </div>
                        <div className="text-sm text-gray-600">Normal</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {data.filter(r => r.status === 'critical').length}
                        </div>
                        <div className="text-sm text-gray-600">Kritisch</div>
                    </div>
                </div>

                {/* Reports List */}
                <h3 className="text-lg font-semibold mb-3">Befunde</h3>
                <div className="space-y-3">
                    {sortedReports.map((report, reportIndex) => (
                        <div key={reportIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpandedReport(expandedReport === reportIndex ? null : reportIndex)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">
                                                Befund vom {new Date(report.date).toLocaleDateString('de-DE')}
                                            </h4>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {report.summary}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {expandedReport === reportIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            {expandedReport === reportIndex && (
                                <div className="border-t border-gray-100">
                                    {/* Summary Section */}
                                    <div className="p-4 bg-gray-50">
                                        <h5 className="font-medium mb-2 flex items-center">
                                            <Info size={16} className="mr-2 text-gray-400" />
                                            Zusammenfassung
                                        </h5>
                                        <p className="text-gray-700">{report.summary}</p>
                                    </div>

                                    {/* Paragraphs */}
                                    {report.paragraphs?.map((paragraph, paragraphIndex) => (
                                        <div key={paragraphIndex} className="border-t border-gray-100">
                                            <button
                                                onClick={() => toggleParagraph(reportIndex, paragraphIndex)}
                                                className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-center"
                                            >
                                                <h5 className="font-medium">{paragraph.caption}</h5>
                                                <div className="text-gray-400">
                                                    {expandedParagraphs[`${reportIndex}-${paragraphIndex}`]
                                                        ? <ChevronUp size={16} />
                                                        : <ChevronDown size={16} />}
                                                </div>
                                            </button>

                                            {expandedParagraphs[`${reportIndex}-${paragraphIndex}`] && (
                                                <div className="px-4 pb-4 text-gray-700 whitespace-pre-wrap">
                                                    {paragraph.full_text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicalReportsDetail;