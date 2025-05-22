import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
