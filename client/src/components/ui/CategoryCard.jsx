// src/components/ui/CategoryCard.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ title, icon, onClick, lastUpdated, value, unit }) => {
  return (
    <div
      className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-sm mb-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center text-white rounded-lg mr-4" style={{backgroundColor: icon.color}}>
          {icon.element}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          {lastUpdated && <p className="text-xs text-gray-500">{lastUpdated}</p>}
        </div>
      </div>
      <div className="flex items-center">
        {value && (
          <div className="text-right mr-2">
            <span className="font-semibold">{value}</span>
            {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
          </div>
        )}
        <ChevronRight className="text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default CategoryCard;