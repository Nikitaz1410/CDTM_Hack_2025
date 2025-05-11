// src/pages/detail/BloodTestDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BloodTestsDetail = ({ onBack, data = [] }) => {
    const [selectedParameter, setSelectedParameter] = useState(null);

    // Helper function to safely parse dates with fallback
    const safeDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch {
            return null;
        }
    };

    // Format date for display with fallback
    const formatDate = (dateString, format = 'short') => {
        const date = safeDate(dateString);
        if (!date) return 'Datum unbekannt';

        if (format === 'short') {
            return date.toLocaleDateString('de-DE', {
                month: 'short',
                day: 'numeric'
            });
        } else {
            return date.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    // Transform data for chart
    const getChartData = (parameter) => {
        if (!parameter) return [];

        return data
            .filter(test => test.parameters?.some(p => p.name === parameter))
            .map(test => ({
                date: formatDate(test.date, 'short'),
                value: test.parameters.find(p => p.name === parameter)?.value || 0,
                fullDate: test.date,
                sortDate: safeDate(test.date) || new Date(0)
            }))
            .sort((a, b) => a.sortDate - b.sortDate);
    };

    // Get all unique parameters from all blood tests
    const getAllParameters = () => {
        const parametersSet = new Set();
        data.forEach(test => {
            test.parameters?.forEach(param => {
                parametersSet.add(param.name);
            });
        });
        return Array.from(parametersSet);
    };

    // Get the latest test results
    const getLatestTest = () => {
        if (!data.length) return null;

        // Sort by date, handling invalid dates
        const sorted = [...data].sort((a, b) => {
            const dateA = safeDate(a.date) || new Date(0);
            const dateB = safeDate(b.date) || new Date(0);
            return dateB - dateA;
        });

        return sorted[0];
    };

    const latestTest = getLatestTest();
    const allParameters = getAllParameters();

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button onClick={onBack} className="mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Blutbild</h1>
                <button className="ml-auto">
                    <Plus size={24} />
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto pb-20">
                {/* Parameter Selection */}
                {allParameters.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Parameter auswählen</h3>
                        <div className="flex flex-wrap gap-2">
                            {allParameters.map(param => (
                                <button
                                    key={param}
                                    onClick={() => setSelectedParameter(param)}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedParameter === param
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {param}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trend Chart */}
                {selectedParameter && getChartData(selectedParameter).length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-medium mb-3">{selectedParameter} Verlauf</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getChartData(selectedParameter)}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#FF2D55"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Latest Results */}
                {latestTest && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-3">
                            Aktuellste Ergebnisse
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({formatDate(latestTest.date)})
                            </span>
                        </h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-3">
                                {latestTest.parameters?.map((param, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{param.name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {param.value} <span className="text-sm text-gray-500">mg/dL</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* All Tests History */}
                <h3 className="text-lg font-semibold mb-3">Verlauf</h3>
                <div className="space-y-2">
                    {data
                        .map(test => ({
                            ...test,
                            sortDate: safeDate(test.date) || new Date(0)
                        }))
                        .sort((a, b) => b.sortDate - a.sortDate)
                        .map((test, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium">
                                            {formatDate(test.date, 'long')}
                                        </h4>
                                        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                            test.status === 'normal' ? 'bg-green-100 text-green-700' :
                                                test.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                            {test.status || 'Standard'}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    {test.parameters?.slice(0, 4).map((param, i) => (
                                        <div key={i} className="text-sm">
                                            <span className="text-gray-500">{param.name}:</span>
                                            <span className="font-medium ml-2">{param.value}</span>
                                        </div>
                                    ))}
                                    {test.parameters?.length > 4 && (
                                        <div className="text-sm text-gray-500 col-span-2">
                                            +{test.parameters.length - 4} weitere Parameter
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty state */}
                {data.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Noch keine Blutbilder verfügbar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodTestsDetail;