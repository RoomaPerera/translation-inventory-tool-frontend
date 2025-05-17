import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProjectForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    languages: initialData.languages || [],
    createdBy: initialData.createdBy || user?._id
  });
  
  // For new language input
  const [newLanguage, setNewLanguage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Update form when initialData or user changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        createdBy: initialData.createdBy || user?._id
      });
    }
  }, [initialData, user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Add a language to the list
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

  // Remove a language from the list
  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Call the onSubmit prop with form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            formErrors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <p className="mt-1 text-sm text-gray-500">
          Add languages that will be used in this project
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;