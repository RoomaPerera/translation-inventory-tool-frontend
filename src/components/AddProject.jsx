// src/components/AddProject.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';

const AddProject = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    languages: []
  });
  
  const [newLanguage, setNewLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    if (!formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
    }
    setNewLanguage('');
  };
  
  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // For testing without auth, use a placeholder user ID
      const projectData = {
        ...formData,
        createdBy: "662fd0f66b8b6c795ecfe25f" // Replace with a valid user ID from your DB
      };
      
        console.log('Submitting project data:', projectData);
      const result = await projectService.addProject(projectData);
      setSuccess('Project created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        languages: []
      });
      
      // Navigate to home after a delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project. Check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Project Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Languages
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.languages.map((lang, index) => (
              <div 
                key={index} 
                className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center"
              >
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language (e.g., en, fr, es)"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addLanguage}
              className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;