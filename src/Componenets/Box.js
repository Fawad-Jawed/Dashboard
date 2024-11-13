import React from 'react';

const Box = ({ title, icon, count }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-indigo-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center">
      <div className="text-4xl text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-indigo-800">{title}</h3>
      <p className="text-2xl font-bold text-indigo-900">{count}</p>
    </div>
  );
};

export default Box;
