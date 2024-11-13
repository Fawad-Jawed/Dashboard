import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const BackButton = ({ color = "text-indigo-600", hover }) => {  // Default color is indigo
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center ${color} ${hover} `} // Apply dynamic color here
    >
      <ArrowLeftOutlined className="mr-2" />
      Back
    </button>
  );
};

export default BackButton;
