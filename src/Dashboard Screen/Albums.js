// AlbumsDisplayScreen.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import CustomAlert from '../Componenets/CustomAlert';
import { db } from '../config/firebase/FirebaseConfig';

const AlbumsDisplayScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editedAlbumData, setEditedAlbumData] = useState({});

  // Fetch albums from Firestore
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'albums'));
        const albumsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(albumsList);
      } catch (error) {
        setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to fetch albums' });
        console.error("Error fetching albums: ", error);
      }
    };

    fetchAlbums();
  }, []);

  // Delete album
  const handleDeleteAlbum = async (id) => {
    try {
      await deleteDoc(doc(db, 'albums', id));
      setAlbums(albums.filter(album => album.id !== id));
      setAlertInfo({ message: 'Success', type: 'success', description: 'Album deleted successfully' });
    } catch (error) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to delete album' });
      console.error("Error deleting album: ", error);
    }
  };

  // Enable edit mode
  const handleEditAlbum = (id) => {
    const albumToEdit = albums.find(album => album.id === id);
    setEditedAlbumData({ ...albumToEdit });
    setEditingAlbumId(id);
  };

  // Update album
  const handleUpdateAlbum = async () => {
    try {
      const albumRef = doc(db, 'albums', editedAlbumData.id);
      await updateDoc(albumRef, editedAlbumData);
      setAlbums(albums.map(album => (album.id === editedAlbumData.id ? editedAlbumData : album)));
      setEditingAlbumId(null);
      setAlertInfo({ message: 'Success', type: 'success', description: 'Album updated successfully' });
    } catch (error) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Failed to update album' });
      console.error("Error updating album: ", error);
    }
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAlbumData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Albums" onAddClick={() => window.location.href = "/albumsform"} text="Add Album" />

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div>
                  {/* Album title and username */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{album.albumTitle}</h3>
                    <p className="text-sm text-gray-600">By {album.username}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(album.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  </div>

                  {/* Display photos in the album */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {album.photos.slice(0, 4).map((photo, index) => (
                      <div key={index} className="w-full">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-center mt-2">{photo.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Mode */}
                {editingAlbumId === album.id ? (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      name="albumTitle"
                      value={editedAlbumData.albumTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Album Title"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={handleUpdateAlbum}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAlbumId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditAlbum(album.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
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

export default AlbumsDisplayScreen;
