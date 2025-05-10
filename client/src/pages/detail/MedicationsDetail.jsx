// src/pages/detail/MedicationsDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, Pill, Sun, Sunrise, Moon, Clock, Info } from 'lucide-react';

const MedicationsDetail = ({ onBack, data = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Get the most recent medication record
    const getRecentMedication = () => {
        if (!data.length) return null;
        return [...data].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    // Get medication schedule for today
    const getTodaySchedule = () => {
        const recent = getRecentMedication();
        if (!recent) return [];

        const schedule = [];
        Object.entries(recent.medikamente || {}).forEach(([name, dosage]) => {
            if (dosage.morning > 0) {
                schedule.push({
                    medication: name,
                    time: 'Morgens',
                    icon: <Sunrise size={16} />,
                    dose: dosage.morning,
                    comment: dosage.comment
                });
            }
            if (dosage.noon > 0) {
                schedule.push({
                    medication: name,
                    time: 'Mittags',
                    icon: <Sun size={16} />,
                    dose: dosage.noon,
                    comment: dosage.comment
                });
            }
            if (dosage.night > 0) {
                schedule.push({
                    medication: name,
                    time: 'Abends',
                    icon: <Moon size={16} />,
                    dose: dosage.night,
                    comment: dosage.comment
                });
            }
        });

        return schedule.sort((a, b) => {
            const order = { 'Morgens': 0, 'Mittags': 1, 'Abends': 2 };
            return order[a.time] - order[b.time];
        });
    };

    const todaySchedule = getTodaySchedule();
    const recentMedication = getRecentMedication();

    // Get all medications from recent record
    const getAllMedications = () => {
        if (!recentMedication) return [];
        return Object.entries(recentMedication.medikamente || {}).map(([name, dosage]) => ({
            name,
            ...dosage,
            totalDaily: dosage.morning + dosage.noon + dosage.night
        }));
    };

    const allMedications = getAllMedications();

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button onClick={onBack} className="mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Medikation</h1>
                <button className="ml-auto">
                    <Plus size={24} />
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto pb-20">
                {/* Today's Schedule */}
                {todaySchedule.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Einnahmeplan heute</h3>
                        <div className="space-y-2">
                            {todaySchedule.map((item, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{item.medication}</h4>
                                                <p className="text-sm text-gray-500">{item.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{item.dose}</div>
                                            <div className="text-xs text-gray-500">Tabletten</div>
                                        </div>
                                    </div>
                                    {item.comment && (
                                        <div className="mt-3 text-sm text-gray-600 flex items-start">
                                            <Info size={14} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                            <span>{item.comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Medications Overview */}
                <h3 className="text-lg font-semibold mb-3">Alle Medikamente</h3>
                <div className="space-y-3 mb-6">
                    {allMedications.map((medication, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium">{medication.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Gesamt: {medication.totalDaily} Tabletten täglich
                                    </p>
                                </div>
                                <div className="flex space-x-4 text-sm text-gray-600">
                                    {medication.morning > 0 && (
                                        <div className="flex items-center">
                                            <Sunrise size={14} className="mr-1" />
                                            {medication.morning}
                                        </div>
                                    )}
                                    {medication.noon > 0 && (
                                        <div className="flex items-center">
                                            <Sun size={14} className="mr-1" />
                                            {medication.noon}
                                        </div>
                                    )}
                                    {medication.night > 0 && (
                                        <div className="flex items-center">
                                            <Moon size={14} className="mr-1" />
                                            {medication.night}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {medication.comment && (
                                <div className="mt-3 text-sm text-gray-600">
                                    <Info size={14} className="inline mr-2 text-gray-400" />
                                    {medication.comment}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Medication History */}
                <h3 className="text-lg font-semibold mb-3">Medikationshistorie</h3>
                <div className="space-y-3">
                    {data.sort((a, b) => new Date(b.date) - new Date(a.date)).map((record, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-medium">
                                        {new Date(record.date).toLocaleDateString('de-DE', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h4>
                                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                        record.status === 'current' ? 'bg-green-100 text-green-700' :
                                            record.status === 'previous' ? 'bg-gray-100 text-gray-700' :
                                                'bg-blue-100 text-blue-700'
                                    }`}>
                    {record.status}
                  </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(record.medikamente || {}).map(([name, dosage]) => (
                                    <div key={name} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{name}</span>
                                        <span className="text-gray-900">
                      {dosage.morning}-{dosage.noon}-{dosage.night}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicationsDetail;