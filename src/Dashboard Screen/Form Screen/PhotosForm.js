// PhotoFormScreen.js
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import Navbar from '../../Componenets/Navbar';
import Sidebar from '../../Componenets/Sidebar';
import CustomAlert from '../../Componenets/CustomAlert';
import { db } from '../../config/firebase/FirebaseConfig';

const PhotoFormScreen = () => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });

  // Handle form submission to add photo entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && title.trim() && imageUrl.trim()) {
      try {
        await addDoc(collection(db, 'photos'), {
          username,
          title,
          imageUrl,
          timestamp: new Date(),
        });
        setAlertInfo({ message: 'Success', type: 'success', description: 'Photo added successfully' });
        setUsername('');
        setTitle('');
        setImageUrl('');
      } catch (error) {
        setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to add photo' });
        console.error("Error adding photo: ", error);
      }
    } else {
      setAlertInfo({ message: 'Error', type: 'warning', description: 'All fields are required' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Add Photo" onAddClick={() => window.location.href = "/photos"} text="Go Back To Photos" />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add a New Photo</h2>
          
          {alertInfo.message && (
            <div className="mb-4">
              <CustomAlert
                message={alertInfo.message}
                description={alertInfo.description}
                type={alertInfo.type}
                showIcon={true}
                closable={true}
                onClose={() => setAlertInfo({ message: '', type: '', description: '' })}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Photo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoFormScreen;
