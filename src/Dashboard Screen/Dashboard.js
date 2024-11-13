import React, { useState, useEffect } from 'react';
import Sidebar from '../Componenets/Sidebar';
import DashboardGrid from '../Componenets/DashboardGrid';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase/FirebaseConfig';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    albums: 0,
    todos: 0,
    photos: 0,
  });

  // Function to fetch the count of items in each collection
  const getCountForSection = async () => {
    const collections = ['users', 'posts', 'comments', 'albums', 'todos', 'photos'];
    const counts = {};

    for (const col of collections) {
      const snapshot = await getDocs(collection(db, col));
      counts[col] = snapshot.size; // Get the count for each collection
    }

    return counts;
  };

  // Fetch counts when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      const newCounts = await getCountForSection();
      setCounts(newCounts);
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-indigo-900 ">Dashboard Screen</h1>
        <DashboardGrid counts={counts} />
      </div>
    </div>
  );
};

export default Dashboard;
