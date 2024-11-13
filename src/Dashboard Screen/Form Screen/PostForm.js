import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Navbar from '../../Componenets/Navbar';
import Sidebar from '../../Componenets/Sidebar';
import { db, auth } from '../../config/firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../Componenets/CustomAlert'; // Import CustomAlert

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [user, setUser] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' }); // For managing alerts
  const [loading, setLoading] = useState(false); // For handling loading state

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Update user state when logged in
      } else {
        setUser(null);  // Set user to null when logged out
      }
    });

    return () => unsubscribe();  // Cleanup the listener when the component unmounts
  }, []);

  const handleAddPost = async () => {
    if (!title || !category || !content) {
      setAlertInfo({ message: 'All fields are required!', type: 'error', description: 'Please fill out all the fields.' });
      return;
    }

    if (!user) {
      setAlertInfo({ message: 'User not authenticated!', type: 'error', description: 'Please log in first.' });
      return;
    }

    try {
      setLoading(true); // Start loading when submitting
      await addDoc(collection(db, 'posts'), {
        title,
        category,
        content,
        thumbnail,
        date: Timestamp.now(),
        userId: user.uid, // Ensure userId is added
      });

      setAlertInfo({ message: 'Post added successfully!', type: 'success', description: 'Your post has been added.' });
      setTitle('');
      setCategory('');
      setContent('');
      setThumbnail('');
      setLoading(false); // Stop loading after submitting
    } catch (err) {
      setAlertInfo({ message: 'Error adding post', type: 'error', description: 'There was an error adding your post.' });
      console.error(err);
      setLoading(false); // Stop loading if error occurs
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Add New Post" onAddClick={() => window.location.href = "/posts"} text='Posts' />
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Add New Post</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  placeholder="Enter post title"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  placeholder="Enter post category"
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="block text-gray-700">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  placeholder="Enter post content"
                  rows="4"
                />
              </div>

              {/* Thumbnail */}
              <div className="mb-4">
                <label className="block text-gray-700">Thumbnail URL</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  placeholder="Enter thumbnail URL (optional)"
                />
              </div>

              {/* Author and Date (Removed Author) */}
              <div className="mb-4">
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  onClick={handleAddPost}
                  className={`w-full ${loading ? 'bg-gray-500' : 'bg-indigo-600'} text-white py-2 px-4 rounded-md hover:bg-indigo-700`}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? 'Submitting...' : 'Submit Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      {alertInfo.message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 w-80">
          <CustomAlert
            message={alertInfo.message}
            description={alertInfo.description}
            type={alertInfo.type}
            showIcon={true}
            closable={true}
            onClose={() => setAlertInfo({ message: '', type: '', description: '' })}
            className="mb-4 transition-transform transform translate-x-full"
          />
        </div>
      )}
    </div>
  );
};

export default PostForm;
