import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null); // Track if we are editing

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Documentation: PUT route to update full task details
        await axios.put(`http://localhost:5000/api/tasks/${editingId}`, { title, description });
        setEditingId(null);
      } else {
        // Documentation: POST route to create a new task
        await axios.post('http://localhost:5000/api/tasks', { title, description });
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error("Save Error:", err.message);
    }
  };

  // Set form for editing
  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Documentation: PATCH route to toggle completion
  const toggleComplete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      console.error("Toggle Error:", err.message);
    }
  };

  // Documentation: DELETE route to remove task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Delete Error:", err.message);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-5 text-center">Task Manager</h1>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-3 bg-gray-100 p-5 rounded-lg shadow">
        <input 
          type="text" 
          placeholder="Task Title" 
          className="w-full p-2 border rounded"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          className="w-full p-2 border rounded"
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className={`w-full p-2 text-white rounded font-bold ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}>
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Task List Section */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task._id} className="flex justify-between items-center p-4 border rounded shadow-sm">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task._id)}
                className="w-5 h-5"
              />
              <div>
                <h3 className={`font-bold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(task)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;