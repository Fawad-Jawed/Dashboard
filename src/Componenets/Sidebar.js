import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserOutlined, AppstoreOutlined, CommentOutlined, FileOutlined, OrderedListOutlined, PictureOutlined, LogoutOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [user, setUser] = useState(null); // Track user login state
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser); // Track user state changes
    return unsubscribe;
  }, []);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <AppstoreOutlined /> },
    { name: 'Users', path: '/users', icon: <UserOutlined /> },
    { name: 'Posts', path: '/posts', icon: <FileOutlined /> },
    { name: 'Comments', path: '/comments', icon: <CommentOutlined /> },
    { name: 'Todo', path: '/todos', icon: <CheckSquareOutlined /> },
    { name: 'Albums', path: '/albums', icon: <OrderedListOutlined /> },
    { name: 'Photos', path: '/photos', icon: <PictureOutlined /> },
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-semibold mb-8">Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          {user ? (
            // Only show these links if user is logged in
            links.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200">
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </li>
            ))
          ) : (
            // If not logged in, don't show protected links
            <p className="text-center text-white">Please log in to view the dashboard
            <br/>
            <Link to="/login" className="text-indigo-600 font-semibold"> LogIn Here</Link>
            </p>
          )}
          {/* Logout Link */}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200 w-full"
              >
                <LogoutOutlined />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
