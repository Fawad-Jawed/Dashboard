import React from 'react';
import CustomButton from './CustomButton';
import BackButton from './BackButton';

const Navbar = ({ title, onAddClick, text }) => {
  return (
    <div className="flex justify-between items-center py-3 px-5 bg-black shadow-lg mt-5 mx-8">
      <div className="flex items-center space-x-3">
        {/* Pass custom color to BackButton */}
        <BackButton color="text-white hover:text-white"/> <hr className='text-white'/> {/* White color for the Back button */}
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
      </div>
      {/* Custom Button with blue color */}
      <CustomButton 
        text={text} 
        onClick={onAddClick} 
        color="bg-blue-500 hover:bg-blue-600"
      />
    </div>
  );
};

export default Navbar;
