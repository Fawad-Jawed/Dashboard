// AlbumFormScreen.js
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import Navbar from '../../Componenets/Navbar';
import Sidebar from '../../Componenets/Sidebar';
import CustomAlert from '../../Componenets/CustomAlert';
import { db } from '../../config/firebase/FirebaseConfig';

const AlbumFormScreen = () => {
  const [username, setUsername] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [photos, setPhotos] = useState([
    { imageUrl: '' },
    { imageUrl: '' },
    { imageUrl: '' },
    { imageUrl: '' },
  ]);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });

  // Handle photo input change
  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index].imageUrl = value;
    setPhotos(updatedPhotos);
  };

  // Handle form submission to add album entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that at least two photos have an image URL
    const filledPhotos = photos.filter(photo => photo.imageUrl.trim()).length;
    if (username.trim() && albumTitle.trim() && filledPhotos >= 2) {
      try {
        await addDoc(collection(db, 'albums'), {
          username,
          albumTitle,
          photos,
          timestamp: new Date(),
        });
        setAlertInfo({ message: 'Success', type: 'success', description: 'Album added successfully' });
        setUsername('');
        setAlbumTitle('');
        setPhotos([
          { imageUrl: '' },
          { imageUrl: '' },
          { imageUrl: '' },
          { imageUrl: '' },
        ]);
      } catch (error) {
        setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to add album' });
        console.error("Error adding album: ", error);
      }
    } else {
      setAlertInfo({ message: 'Error', type: 'warning', description: 'At least two photos must be added' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Add Album" onAddClick={() => window.location.href = "/albums"} text="Go Back To Albums" />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add a New Album</h2>

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
              placeholder="Album Title"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />

            {photos.map((photo, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">Photo {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={photo.imageUrl}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            ))}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Album
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlbumFormScreen;
