import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import CustomAlert from '../Componenets/CustomAlert';
import { db } from '../config/firebase/FirebaseConfig';

const CommentDisplayScreen = () => {
  const [comments, setComments] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'comments'));
        const commentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsList);
      } catch (error) {
        setAlertInfo({
          message: 'Error',
          type: 'error',
          description: 'Failed to fetch comments',
        });
        console.error("Error fetching comments: ", error);
      }
    };
    
    fetchComments();
  }, []);

  // Delete a comment
  const handleDeleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, 'comments', id));
      setComments(comments.filter(comment => comment.id !== id));
      setAlertInfo({
        message: 'Success!',
        type: 'success',
        description: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error("Error deleting comment: ", error);
      setAlertInfo({
        message: 'Error',
        type: 'error',
        description: 'Failed to delete comment',
      });
    }
  };

  // Edit a comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.comment);
  };

  // Save edited comment
  const handleSaveComment = async (id) => {
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, { comment: editedComment });
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, comment: editedComment } : comment
      ));
      setEditingCommentId(null);
      setAlertInfo({
        message: 'Success!',
        type: 'success',
        description: 'Comment updated successfully',
      });
    } catch (error) {
      console.error("Error updating comment: ", error);
      setAlertInfo({
        message: 'Error',
        type: 'error',
        description: 'Failed to update comment',
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Comments" onAddClick={() => window.location.href = "/commentsform"} text="Add Comment" />
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 bg-white rounded shadow space-y-2">
                <p className="font-semibold">{comment.username}</p>
                
                {editingCommentId === comment.id ? (
                  <div>
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleSaveComment(comment.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.comment}</p>
                )}
                <p>{new Date(comment.timestamp?.seconds * 1000).toLocaleString()}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display the alert if there is an error or success message */}
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

export default CommentDisplayScreen;
