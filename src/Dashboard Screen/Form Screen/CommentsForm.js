import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import Navbar from '../../Componenets/Navbar';
import Sidebar from '../../Componenets/Sidebar';
import CustomAlert from '../../Componenets/CustomAlert';
import { db } from '../../config/firebase/FirebaseConfig';

const CommentsForm = () => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && comment.trim()) {
      try {
        await addDoc(collection(db, 'comments'), {
          username,
          comment,
          timestamp: new Date(),
        });
        setAlertInfo({
          message: "Success!",
          type: "success",
          description: "Comment added successfully!",
        });
        setUsername('');
        setComment('');
      } catch (error) {
        console.error("Error adding comment: ", error);
        setAlertInfo({
          message: "Error",
          type: "error",
          description: "Error adding comment. Please try again.",
        });
      }
    } else {
      setAlertInfo({
        message: "Warning",
        type: "warning",
        description: "Both fields are required.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Add Comment" onAddClick={() => {window.location.href = "/comments"}} text="Back to Comments" />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Comment
            </button>
          </form>
        </div>

        {/* Custom Alert component for notifications */}
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

export default CommentsForm;
