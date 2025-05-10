// src/pages/MyFactsPage.jsx
import React from 'react';
import CategoryCard from '../components/ui/CategoryCard';
import { Heart, Activity, Droplet, Apple, BarChart2, Pill, Move } from 'lucide-react';

const MyFactsPage = () => {
  const healthCategories = [
    {
      id: 'activity',
      title: 'Activity',
      icon: { element: <Activity size={22} />, color: '#FF9500' },
      lastUpdated: 'Today',
      value: '2,345',
      unit: 'steps'
    },
    {
      id: 'heart',
      title: 'Heart',
      icon: { element: <Heart size={22} />, color: '#FF2D55' },
      lastUpdated: 'Today',
      value: '72',
      unit: 'bpm'
    },
    {
      id: 'respiratory',
      title: 'Respiratory',
      icon: { element: <Droplet size={22} />, color: '#5AC8FA' },
      lastUpdated: 'Yesterday',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: { element: <Apple size={22} />, color: '#4CD964' },
      lastUpdated: '3 days ago',
    },
    {
      id: 'bodyMeasurements',
      title: 'Body Measurements',
      icon: { element: <BarChart2 size={22} />, color: '#AF52DE' },
      lastUpdated: 'Apr 19',
      value: '24.8',
      unit: 'BMI'
    },
    {
      id: 'medications',
      title: 'Medications',
      icon: { element: <Pill size={22} />, color: '#007AFF' },
      lastUpdated: 'Last week',
    },
    {
      id: 'mobility',
      title: 'Mobility',
      icon: { element: <Move size={22} />, color: '#FF9500' },
      lastUpdated: 'Last month',
    },
  ];

  const handleCategoryClick = (category) => {
    console.log(`Clicked on ${category.title}`);
    // In a real app, this would navigate to a detailed view
  };

  return (
    <div className="p-4 pb-20"> {/* Added padding bottom for tab bar */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Health Categories</h2>
        <div>
          {healthCategories.map(category => (
            <CategoryCard
              key={category.id}
              title={category.title}
              icon={category.icon}
              lastUpdated={category.lastUpdated}
              value={category.value}
              unit={category.unit}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFactsPage;