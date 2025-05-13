// src/components/AddProject.jsx
import React, { useState } from 'react';
import ProjectForm from './ProjectForm';

const AddProject = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Project
      </button>
      {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default AddProject;
