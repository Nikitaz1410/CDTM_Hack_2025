// src/pages/detail/BodyMeasurementsDetail.jsx
import React from 'react';
import { ArrowLeft, BarChart2, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BodyMeasurementsDetail = ({ onBack }) => {
  // Mock data for the chart
  const bmiData = [
    { date: 'Jan', value: 24.2 },
    { date: 'Feb', value: 24.5 },
    { date: 'Mar', value: 24.7 },
    { date: 'Apr', value: 24.8 },
  ];

  const measurements = [
    {
      id: 'bmi',
      title: 'Body Mass Index',
      value: '24.8',
      unit: 'kg/m²',
      lastUpdated: 'Apr 19',
      status: 'normal'
    },
    {
      id: 'weight',
      title: 'Weight',
      value: '83.8',
      unit: 'kg',
      lastUpdated: 'Apr 19',
      status: 'normal'
    },
    {
      id: 'bodyFat',
      title: 'Body Fat Percentage',
      value: '23.2',
      unit: '%',
      lastUpdated: 'Apr 19',
      status: 'normal'
    },
    {
      id: 'leanMass',
      title: 'Lean Body Mass',
      value: '64.3',
      unit: 'kg',
      lastUpdated: 'Apr 19',
      status: 'normal'
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Body Measurements</h1>
        <button className="ml-auto">
          <Plus size={24} />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto pb-20">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 mr-2">
              <BarChart2 size={18} />
            </div>
            <h2 className="text-lg font-medium">BMI Trend</h2>
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

        <h3 className="text-lg font-semibold mb-3">Measurements</h3>
        <div className="space-y-2">
          {measurements.map(metric => (
            <div key={metric.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div>
                <h4 className="font-medium">{metric.title}</h4>
                <p className="text-xs text-gray-500">Last updated: {metric.lastUpdated}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">
                  {metric.value} <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                <div className={`text-xs ${
                  metric.status === 'normal' ? 'text-green-500' : 
                  metric.status === 'high' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurementsDetail;