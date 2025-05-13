// src/components/ProjectForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const ProjectForm = ({ onClose }) => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [languages, setLanguages] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      name,
      description,
      languages: languages.split(',').map(lang => lang.trim()),
      createdBy: user?._id
    };

    try {
      await axios.post('http://localhost:5000/api/projects', projectData);
      setMessage('✅ Project added successfully!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error adding project');
    }
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 border-l border-gray-200">
      <button className="text-red-500 float-right" onClick={onClose}>✖</button>
      <h2 className="text-xl font-bold mb-4">Add New Project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Languages (comma-separated)"
          value={languages}
          onChange={e => setLanguages(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default ProjectForm;
