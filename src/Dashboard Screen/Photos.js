// PhotosDisplayScreen.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import CustomAlert from '../Componenets/CustomAlert';
import { db } from '../config/firebase/FirebaseConfig';

const PhotosDisplayScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editedPhotoData, setEditedPhotoData] = useState({});

  // Fetch photos from Firestore
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'photos'));
        const photosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(photosList);
      } catch (error) {
        setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to fetch photos' });
        console.error("Error fetching photos: ", error);
      }
    };

    fetchPhotos();
  }, []);

  // Delete photo
  const handleDeletePhoto = async (id) => {
    try {
      await deleteDoc(doc(db, 'photos', id));
      setPhotos(photos.filter(photo => photo.id !== id));
      setAlertInfo({ message: 'Success', type: 'success', description: 'Photo deleted successfully' });
    } catch (error) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to delete photo' });
      console.error("Error deleting photo: ", error);
    }
  };

  // Enable edit mode
  const handleEditPhoto = (id) => {
    const photoToEdit = photos.find(photo => photo.id === id);
    setEditedPhotoData({ ...photoToEdit });
    setEditingPhotoId(id);
  };

  // Update photo
  const handleUpdatePhoto = async () => {
    try {
      const photoRef = doc(db, 'photos', editedPhotoData.id);
      await updateDoc(photoRef, editedPhotoData);
      setPhotos(photos.map(photo => (photo.id === editedPhotoData.id ? editedPhotoData : photo)));
      setEditingPhotoId(null);
      setAlertInfo({ message: 'Success', type: 'success', description: 'Photo updated successfully' });
    } catch (error) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to update photo' });
      console.error("Error updating photo: ", error);
    }
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPhotoData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Photos" onAddClick={() => window.location.href = "/photosform"} text="Add Photo" />

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div>
                  {/* Photo title and username */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{photo.title}</h3>
                    <p className="text-sm text-gray-600">By {photo.username}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(photo.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  </div>

                  {/* Photo image */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                </div>

                {/* Edit Mode */}
                {editingPhotoId === photo.id ? (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editedPhotoData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      name="imageUrl"
                      value={editedPhotoData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Image URL"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={handleUpdatePhoto}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPhotoId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditPhoto(photo.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Display Alert */}
        {alertInfo.message && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
            <CustomAlert
              message={alertInfo.message}
              description={alertInfo.description}
              type={alertInfo.type}
              showIcon={true}
              closable={true}
              onClose={() => setAlertInfo({ message: '', type: '', description: '' })}
              className="mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosDisplayScreen;
