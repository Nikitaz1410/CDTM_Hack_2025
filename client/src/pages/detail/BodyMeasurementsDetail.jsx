// src/pages/detail/BodyMeasurementsDetail.jsx
import React from 'react';
import { ArrowLeft, BarChart2, Plus, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import authService from '../../services/authService';

const BodyMeasurementsDetail = ({ onBack, onEdit }) => {
  // Get user data
  const user = authService.getCurrentUser();

  // Calculate BMI
  const calculateBMI = () => {
    if (user?.weight && user?.height) {
      const weightInKg = parseFloat(user.weight);
      const heightInM = parseFloat(user.height) / 100; // Convert cm to m
      const bmi = weightInKg / (heightInM * heightInM);
      return bmi.toFixed(1);
    }
    return null;
  };

  // Mock data for BMI trend (you can replace with real data when available)
  const bmiData = [
    { date: 'Jan', value: parseFloat(calculateBMI()) || 24.2 },
    { date: 'Feb', value: parseFloat(calculateBMI()) || 24.5 },
    { date: 'Mar', value: parseFloat(calculateBMI()) || 24.7 },
    { date: 'Apr', value: parseFloat(calculateBMI()) || 24.8 },
  ];

  // Calculate body fat percentage (placeholder - would need actual data)
  const calculateBodyFat = () => {
    // Using Deurenberg formula as an estimate (not very accurate)
    const bmi = calculateBMI();
    if (!bmi) return null;

    // Assuming male, age 30 (you'd need actual age and gender)
    const bodyFat = (1.20 * parseFloat(bmi)) + (0.23 * 30) - 16.2;
    return Math.max(0, bodyFat).toFixed(1);
  };

  // Calculate lean body mass
  const calculateLeanMass = () => {
    if (!user?.weight) return null;
    const bodyFat = calculateBodyFat();
    if (!bodyFat) return null;

    const weight = parseFloat(user.weight);
    const fatMass = weight * (parseFloat(bodyFat) / 100);
    return (weight - fatMass).toFixed(1);
  };

  const measurements = [
    {
      id: 'bmi',
      title: 'Body Mass Index',
      value: calculateBMI() || '—',
      unit: 'kg/m²',
      lastUpdated: 'Heute',
      status: 'normal'
    },
    {
      id: 'weight',
      title: 'Gewicht',
      value: user?.weight || '—',
      unit: 'kg',
      lastUpdated: 'Heute',
      status: 'normal'
    },
    {
      id: 'height',
      title: 'Größe',
      value: user?.height || '—',
      unit: 'cm',
      lastUpdated: 'Heute',
      status: 'normal'
    },
    {
      id: 'bodyFat',
      title: 'Körperfettanteil (geschätzt)',
      value: calculateBodyFat() || '—',
      unit: '%',
      lastUpdated: 'Heute',
      status: 'normal'
    },
    {
      id: 'leanMass',
      title: 'Magermasse (geschätzt)',
      value: calculateLeanMass() || '—',
      unit: 'kg',
      lastUpdated: 'Heute',
      status: 'normal'
    },
  ];

  return (
      <div className="h-full flex flex-col">
        <header className="flex items-center p-4 border-b border-gray-200 bg-white">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Körpermesswerte</h1>
          <button onClick={onEdit} className="ml-auto">
            <Edit size={24} />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto pb-20">
          {/* BMI Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 mr-2">
                <BarChart2 size={18} />
              </div>
              <h2 className="text-lg font-medium">BMI Verlauf</h2>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Measurements */}
          <h3 className="text-lg font-semibold mb-3">Messwerte</h3>
          <div className="space-y-2">
            {measurements.map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <h4 className="font-medium">{metric.title}</h4>
                    <p className="text-xs text-gray-500">Zuletzt aktualisiert: {metric.lastUpdated}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {metric.value} <span className="text-sm text-gray-500">{metric.unit}</span>
                    </div>
                    <div className={`text-xs ${
                        metric.status === 'normal' ? 'text-green-500' :
                            metric.status === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {metric.status === 'normal' ? 'Normal' : metric.status}
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              * Körperfettanteil und Magermasse sind Schätzungen basierend auf BMI, Alter und Geschlecht.
              Für genauere Werte empfehlen wir eine professionelle Körperzusammensetzungsmessung.
            </p>
          </div>
        </div>
      </div>
  );
};

export default BodyMeasurementsDetail;