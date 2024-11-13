// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 p-4 text-center mt-auto shadow-inner">
      &copy; {new Date().getFullYear()} MyDashboard. Crafted with passion.
    </footer>
  );
};

export default Footer;
