// src/components/CustomInput.js
import React from 'react';
import { Input } from 'antd';

const CustomInput = ({ 
  placeholder, 
  type = 'text', 
  icon, 
  value, 
  onChange, 
  onPressEnter,
  className = '' 
}) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      prefix={icon}
      value={value}
      onChange={onChange}
      onPressEnter={onPressEnter}
      className={`rounded-lg p-3 ${className}`}
    />
  );
};

export default CustomInput;
