// src/components/Header.js
import React from 'react';
import CustomButton from './CustomButton';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 flex justify-between items-center shadow-md">
      <h1 className="text-3xl font-extrabold tracking-wide">MyDashboard</h1>
      <div className="flex space-x-4">
        <Link to="/login">
          <CustomButton text="Log In" color="bg-gradient-to-r from-purple-500 to-indigo-500" />
        </Link>
        <Link to="/signup">
          <CustomButton text="Sign Up" color="bg-gradient-to-r from-yellow-400 to-orange-500" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
