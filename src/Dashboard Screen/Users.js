import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import { db } from '../config/firebase/FirebaseConfig';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersList);
      } catch (err) {
        setError('Error fetching users data');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    console.log("Add User Clicked");
  };

  const renderInitials = (firstName, lastName) => {
    return (
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
        {firstName.charAt(0).toUpperCase()}
        {lastName.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Users" onAddClick={handleAddUser} text="Add User"/>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.uid} className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center space-x-4">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User Profile" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    renderInitials(user.firstName, user.lastName) // Show initials if no photo
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>DOB:</strong> {user.dob}</p>
                  <p><strong>LinkedIn:</strong>
                    <a
                      href={`https://www.linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {user.linkedin}
                    </a>
                  </p>
                  <p><strong>GitHub:</strong>
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {user.github}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserScreen;
