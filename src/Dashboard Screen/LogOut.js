import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase/FirebaseConfig';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/login'); // Redirect to login page after logout
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Logging out...</h2>
      </div>
    </div>
  );
};

export default Logout;
