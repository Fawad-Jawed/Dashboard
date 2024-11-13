// src/pages/HomePage.js
import React from 'react';
import Header from '../Componenets/Header';
import Footer from '../Componenets/Footer';
import { Button } from 'antd';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-bold mb-4 text-indigo-900 tracking-wide">
          Welcome to Your Personalized Dashboard
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          Unlock powerful insights, manage your tasks, and stay on top of your goals. Get started to elevate your productivity.
        </p>
        <Button 
          type="primary" 
          size="large" 
          className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110 duration-200"
        >
          Get Started
        </Button>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
