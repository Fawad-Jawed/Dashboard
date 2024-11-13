import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase/FirebaseConfig';
import CustomInput from '../Componenets/CustomInput';
import Navbar from '../Componenets/Navbar';
import Sidebar from '../Componenets/Sidebar';
import CustomAlert from '../Componenets/CustomAlert';
import { CheckOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [alertInfo, setAlertInfo] = useState({ message: '', type: '', description: '' });

  const todosCollectionRef = collection(db, 'todos');

  const fetchTodos = async () => {
    const data = await getDocs(todosCollectionRef);
    setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      await addDoc(todosCollectionRef, { text: newTodo, completed: false });
      setNewTodo('');
      fetchTodos();
      showAlert('Todo added!', 'success', 'Your new todo has been added.');
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async (id) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { text: editingText });
    setEditingId(null);
    setEditingText('');
    fetchTodos();
    showAlert('Todo updated!', 'success', 'Your todo has been updated.');
  };

  const deleteTodo = async (id) => {
    const todoDoc = doc(db, 'todos', id);
    await deleteDoc(todoDoc);
    fetchTodos();
    showAlert('Todo deleted!', 'error', 'The todo has been deleted.');
  };

  const toggleComplete = async (id, currentStatus) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !currentStatus });
    fetchTodos();
    showAlert('Todo status updated!', 'info', 'The completion status has been toggled.');
  };

  const copyTodo = async (text) => {
    await navigator.clipboard.writeText(text);
    showAlert('Todo copied!', 'success', 'Todo text has been copied to clipboard.');
  };

  const showAlert = (message, type, description) => {
    setAlertInfo({ message, type, description });
    setTimeout(() => setAlertInfo({ message: '', type: '', description: '' }), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Todo List" onAddClick={addTodo} text="Add Todo" />
        
        <div className="p-8">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <CustomInput
              placeholder="Enter new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onPressEnter={addTodo}
            />
            <ul className="mt-4 space-y-2">
              {todos.map((todo) => (
                <li key={todo.id} className="flex justify-between items-center p-2 border-b">
                  {editingId === todo.id ? (
                    <CustomInput
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onPressEnter={() => saveEdit(todo.id)}
                    />
                  ) : (
                    <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.text}</span>
                  )}
                  <div className="space-x-2">
                    <CheckOutlined 
                      className={`cursor-pointer ${todo.completed ? "text-green-500" : ""}`} 
                      onClick={() => toggleComplete(todo.id, todo.completed)} 
                    />
                    {editingId === todo.id ? (
                      <CheckOutlined onClick={() => saveEdit(todo.id)} />
                    ) : (
                      <>
                        <EditOutlined onClick={() => startEditing(todo.id, todo.text)} />
                        <CopyOutlined onClick={() => copyTodo(todo.text)} />
                        <DeleteOutlined onClick={() => deleteTodo(todo.id)} />
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
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

export default Todo;
