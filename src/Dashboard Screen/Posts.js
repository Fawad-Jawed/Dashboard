import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import { db } from '../config/firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../Componenets/CustomAlert'; // Import CustomAlert

const PostScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostData, setEditedPostData] = useState({});
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' }); // For managing alerts
  const navigate = useNavigate();

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
      } catch (err) {
        setError('Error fetching posts data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Toggle post content view
  const handleToggleContent = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  // Delete a post
  const handleDeletePost = async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(post => post.id !== id)); // Remove deleted post from state
      setAlertInfo({ message: 'Success!', type: 'success', description: 'Post deleted successfully' }); // Show success alert
    } catch (err) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Error deleting post' }); // Show error alert
      console.error(err);
    }
  };

  // Handle edit button click
  const handleEditPost = (id) => {
    const postToEdit = posts.find(post => post.id === id);
    setEditedPostData({ ...postToEdit });
    setEditingPostId(id);
  };

  // Handle form change while editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPostData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update post in Firestore
  const handleUpdatePost = async () => {
    try {
      const postRef = doc(db, 'posts', editedPostData.id);
      await updateDoc(postRef, editedPostData);
      setPosts(posts.map(post => post.id === editedPostData.id ? editedPostData : post));
      setEditingPostId(null); // Hide edit form after updating
      setAlertInfo({ message: 'Success!', type: 'success', description: 'Post updated successfully' }); // Show success alert
    } catch (err) {
      setAlertInfo({ message: 'Error', type: 'error', description: 'Error updating post' }); // Show error alert
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Posts" onAddClick={() => window.location.href = "/postform"} text="Add Post" />
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                  {/* Post Thumbnail */}
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt="Post Thumbnail" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">N/A</div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">{post.title}</h3>
                    {/* <p className="text-gray-600 text-sm">{post.author}</p> */}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p><strong>Category:</strong> {post.category}</p>
                  <p><strong>Date:</strong> {new Date(post.date.seconds * 1000).toLocaleDateString()}</p>
                  <p><strong>Content:</strong>
                    {/* Show content in scrollable box when expanded */}
                    {expandedPostId === post.id ? (
                      <div className="h-32 overflow-y-auto">
                        <p>{post.content}</p>
                      </div>
                    ) : (
                      <p>{post.content.slice(0, 100)}...</p>
                    )}
                  </p>
                  {/* Toggle "See More" */}
                  {post.content.length > 100 && (
                    <button
                      onClick={() => handleToggleContent(post.id)}
                      className="text-indigo-600 hover:underline"
                    >
                      {expandedPostId === post.id ? "See Less" : "See More"}
                    </button>
                  )}
                </div>

                {/* Edit or Update Form */}
                {editingPostId === post.id ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        name="title"
                        value={editedPostData.title}
                        onChange={handleInputChange}
                        className="w-1/2 px-4 py-2 border rounded-md"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        name="category"
                        value={editedPostData.category}
                        onChange={handleInputChange}
                        className="w-1/2 px-4 py-2 border rounded-md"
                        placeholder="Category"
                      />
                    </div>
                    <div>
                      <textarea
                        name="content"
                        value={editedPostData.content}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Content"
                        rows="4"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleUpdatePost}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex space-x-4">
                    {/* Edit and Delete Buttons */}
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Display the custom alert here */}
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

export default PostScreen;
