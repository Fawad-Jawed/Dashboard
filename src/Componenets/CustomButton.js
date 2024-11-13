// src/components/Button.js
import React from 'react';
import { Button } from 'antd';

const CustomButton = ({ text, onClick, type = "primary", color = "bg-gradient-to-r from-green-400 to-blue-500" }) => {
  return (
    <Button 
      type={type} 
      onClick={onClick} 
      className={`${color} text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-200`}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
