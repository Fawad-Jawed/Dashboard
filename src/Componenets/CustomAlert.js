// src/components/CustomAlert.js
import React from 'react';
import { Alert } from 'antd';

const CustomAlert = ({ 
  message, 
  description = '', 
  type = 'info', 
  showIcon = true, 
  closable = false, 
  onClose, 
  className = '' 
}) => {
  if (!message) return null;

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon={showIcon}
      closable={closable}
      onClose={onClose}
      className={className}
    />
  );
};

export default CustomAlert;
