// src/pages/detail/VaccinationsDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

const VaccinationsDetail = ({ onBack, data = [] }) => {
    const [expandedCard, setExpandedCard] = useState(null);

    // Get all vaccinations from all records
    const getAllVaccinations = () => {
        return data.flatMap(record =>
            record.impfungen?.map(impfung => ({
                ...impfung,
                recordStatus: record.status,
                recordDate: record.date || new Date().toISOString()
            })) || []
        ).sort((a, b) => new Date(b.Impfdatum) - new Date(a.Impfdatum));
    };

    const allVaccinations = getAllVaccinations();

    // Group vaccinations by disease
    const getVaccinationsByDisease = () => {
        const groupedVaccinations = {};
        allVaccinations.forEach(vaccination => {
            vaccination.Krankheit?.forEach(disease => {
                if (!groupedVaccinations[disease]) {
                    groupedVaccinations[disease] = [];
                }
                groupedVaccinations[disease].push(vaccination);
            });
        });
        return groupedVaccinations;
    };

    const vaccinationsByDisease = getVaccinationsByDisease();

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button onClick={onBack} className="mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Impfpass</h1>
                <button className="ml-auto">
                    <Plus size={24} />
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto pb-20">
                {/* Summary Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{allVaccinations.length}</div>
                        <div className="text-sm text-gray-600">Impfungen gesamt</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{Object.keys(vaccinationsByDisease).length}</div>
                        <div className="text-sm text-gray-600">Geschützte Krankheiten</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {allVaccinations.length > 0 ? new Date().getFullYear() - new Date(allVaccinations[0].Impfdatum).getFullYear() : 0}
                        </div>
                        <div className="text-sm text-gray-600">Jahre aktiv</div>
                    </div>
                </div>

                {/* Vaccinations by Disease */}
                <h3 className="text-lg font-semibold mb-3">Impfungen nach Krankheit</h3>
                <div className="space-y-3 mb-6">
                    {Object.entries(vaccinationsByDisease).map(([disease, vaccinations]) => (
                        <div key={disease} className="bg-white rounded-lg shadow-sm">
                            <button
                                onClick={() => setExpandedCard(expandedCard === disease ? null : disease)}
                                className="w-full p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{disease}</h4>
                                        <p className="text-sm text-gray-500">{vaccinations.length} Impfungen</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {expandedCard === disease ? '▼' : '▶'}
                                </div>
                            </button>

                            {expandedCard === disease && (
                                <div className="px-4 pb-4 border-t border-gray-100">
                                    <div className="space-y-2 mt-3">
                                        {vaccinations.map((vaccination, index) => (
                                            <div key={index} className="flex items-center justify-between py-2">
                                                <div>
                                                    <div className="font-medium text-sm">{vaccination.Impfstoffname}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(vaccination.Impfdatum).toLocaleDateString('de-DE')}
                                                    </div>
                                                </div>
                                                <div className="text-green-600">
                                                    <CheckCircle size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <h3 className="text-lg font-semibold mb-3">Impfverlauf</h3>
                <div className="space-y-3">
                    {allVaccinations.map((vaccination, index) => (
                        <div key={index} className="flex items-start space-x-3 relative">
                            {/* Timeline line */}
                            {index !== allVaccinations.length - 1 && (
                                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                            )}

                            {/* Timeline dot */}
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle size={20} />
                                </div>
                            </div>

                            {/* Vaccination details */}
                            <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{vaccination.Impfstoffname}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Schutz gegen: {vaccination.Krankheit?.join(', ')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">
                                            {new Date(vaccination.Impfdatum).toLocaleDateString('de-DE')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VaccinationsDetail;