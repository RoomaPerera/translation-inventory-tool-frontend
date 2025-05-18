 // Test API connection function
  const testApiConnection = async () => {
    setIsTestingApi(true);
    setTestResult(null);

    try {
      const result = await projectService.testConnection();
      setTestResult({
        success: true,
        message: 'API connection successful!',
        data: result
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `API connection failed: ${error.message}`,
        error: error
      });
    } finally {
      setIsTestingApi(false);
    }
  };import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import projectService from '../services/projectService';
import languageService from '../services/languageService';
import { useAuthContext } from '../hooks/useAuthContext'; 

const Settings = () => {
  const [activeTab, setActiveTab] = useState('projects'); // Toggle between 'projects' and 'languages'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddLanguageForm, setShowAddLanguageForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const { user } = useAuthContext(); // Get the current user
  const modalRef = useRef(null);

  // Click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddForm(false);
        setShowAddLanguageForm(false);
      }
    }
    
    if (showAddForm || showAddLanguageForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddForm, showAddLanguageForm]);

  // Fetch languages when component mounts
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const languagesData = await languageService.getLanguages();
        setLanguages(languagesData);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };
    
    fetchLanguages();
  }, []);
  
  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Delete project function
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(projectId);
        // Update projects list after deletion
        setProjects(projects.filter(project => project._id !== projectId));
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };
  
  // Edit project function
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditForm(true);
    setShowAddForm(false);
    setShowAddLanguageForm(false);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddForm || showAddLanguageForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddForm, showAddLanguageForm]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* App content - no blur effect */}
      <div className="transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`py-3 px-6 font-medium text-base mr-2 rounded-t-lg border-b-2 focus:outline-none transition-colors ${
              activeTab === 'projects'
                ? 'text-indigo-700 border-indigo-700 bg-white'
                : 'text-gray-500 border-transparent hover:text-indigo-600 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Project Management
          </button>
          <button
            className={`py-3 px-6 font-medium text-base mr-2 rounded-t-lg border-b-2 focus:outline-none transition-colors ${
              activeTab === 'languages'
                ? 'text-indigo-700 border-indigo-700 bg-white'
                : 'text-gray-500 border-transparent hover:text-indigo-600 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('languages')}
          >
            Language Management
          </button>
        </div>
        
        {/* Project Management Section */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Project Management</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Manage your translation projects from here. Add new projects, view existing ones, 
                and keep track of all your translation work.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setShowAddForm(true);
                    setShowAddLanguageForm(false);
                    setShowEditForm(false);
                    setSelectedProject(null);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Project
                </button>
                
                {/* Test API Connection button */}
                <button 
                  onClick={testApiConnection}
                  disabled={isTestingApi}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {isTestingApi ? 'Testing...' : 'Test API Connection'}
                </button>
              </div>
              
              {/* Display test results if available */}
              {testResult && (
                <div className={`mt-4 p-3 rounded-md ${testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <p className="font-medium">{testResult.message}</p>
                  {testResult.success && testResult.data && (
                    <pre className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  )}
                  {!testResult.success && (
                    <div className="mt-2">
                      <p className="text-sm">Tips to fix this issue:</p>
                      <ul className="list-disc list-inside text-sm mt-1">
                        <li>Check if your backend server is running</li>
                        <li>Verify the API URL in projectService.js (currently: {projectService.API_URL || 'http://localhost:5000/api'})</li>
                        <li>Check for CORS issues in your browser console</li>
                        <li>Ensure your MongoDB is connected properly</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Projects List */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Your Projects</h3>
                {isLoadingProjects ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Languages
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{project.name}</div>
                              {project.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {project.languages && project.languages.map((lang, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {lang}
                                  </span>
                                ))}
                                {(!project.languages || project.languages.length === 0) && (
                                  <span className="text-gray-500 text-sm italic">No languages</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditProject(project)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-md p-4 text-center">
                    <p className="text-gray-500">No projects yet. Create your first project!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Language Management Section */}
        {activeTab === 'languages' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Language Management</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Manage languages available for translation in your projects. Add new languages
                that can be assigned to projects and translators.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setShowAddLanguageForm(true);
                    setShowAddForm(false);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Language
                </button>
              </div>
              
              {/* Display existing languages */}
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Available Languages</h3>
                {isLoadingLanguages ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map((language) => (
                      <div 
                        key={language._id} 
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md flex items-center"
                      >
                        <span className="font-medium">{language.code}</span>
                        {language.name && <span className="ml-1 text-sm">- {language.name}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No languages available. Add your first language.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Admin Controls Section (Only visible to Admin users) */}
        {user && user.role === 'Admin' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Manage system users and assign languages to translators.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Link 
                  to="/translator-management"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Manage Translators
                </Link>
                
                <Link 
                  to="/pending-users"
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Approve Pending Users
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal Overlay - using a darker overlay with no blur effect */}
      {(showAddForm || showAddLanguageForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-modal-appear"
            style={{ maxHeight: '90vh', overflow: 'auto' }}
          >
            {/* Modal Header */}
            <div className="bg-indigo-600 p-4 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {showAddForm 
                    ? 'Add New Project' 
                    : showEditForm 
                      ? 'Edit Project' 
                      : 'Add New Language'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setShowAddLanguageForm(false);
                    setShowEditForm(false);
                    setSelectedProject(null);
                  }}
                  className="text-white hover:text-indigo-100 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              {showAddForm && (
                <AddProjectForm 
                  onSuccess={() => {
                    setShowAddForm(false);
                    // Refresh projects list
                    projectService.getProjects().then(data => setProjects(data));
                  }} 
                  availableLanguages={languages}
                />
              )}
              
              {showEditForm && selectedProject && (
                <EditProjectForm 
                  project={selectedProject}
                  onSuccess={() => {
                    setShowEditForm(false);
                    setSelectedProject(null);
                    // Refresh projects list
                    projectService.getProjects().then(data => setProjects(data));
                  }} 
                  availableLanguages={languages}
                />
              )}
              
              {showAddLanguageForm && (
                <AddLanguageForm 
                  onSuccess={() => {
                    setShowAddLanguageForm(false);
                    // Refresh languages list
                    languageService.getLanguages().then(data => setLanguages(data));
                  }}
                  existingLanguages={languages}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add animation keyframes for modal */}
      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modalAppear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Add Language Form Component
const AddLanguageForm = ({ onSuccess, existingLanguages = [] }) => {
  // Form component implementation (unchanged)
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Convert language code to uppercase
    const codeUppercase = formData.code.toUpperCase();
    
    // Validate language code format (e.g., EN, FR, ES)
    const codeRegex = /^[A-Z]{2,3}$/;
    if (!codeRegex.test(formData.code)) {
      setError('Language code must be 2-3 uppercase letters (e.g., EN, FR, ES)');
      setIsSubmitting(false);
      return;
    }
    
    // Check if language already exists
    const languageExists = existingLanguages.some(
      lang => lang.code.toLowerCase() === formData.code.toLowerCase() || 
              lang.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    if (languageExists) {
      setError(`Language with this name or code already exists`);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await languageService.addLanguage(formData);
      setSuccess('Language added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        code: ''
      });
      
      // Notify parent component after a delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error adding language:', err);
      setError(err.message || 'Failed to add language');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
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
            Language Name* <span className="text-sm text-gray-500">(e.g., English, French, Spanish)</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="English"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="code">
            Language Code* <span className="text-sm text-gray-500">(e.g., EN, FR, ES)</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="EN"
            maxLength={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            style={{ textTransform: 'uppercase' }}
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be 2-3 uppercase letters, unique for each language.
          </p>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Adding...' : 'Add Language'}
          </button>
        </div>
      </form>
    </>
  );
};

// Project Form Component
const AddProjectForm = ({ onSuccess, availableLanguages = [] }) => {
  // Form component implementation (unchanged)
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
  
  // Modified addLanguage function to handle comma-separated languages
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    // Process the input to handle multiple languages separated by commas
    const languagesToAdd = newLanguage
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang !== '');
    
    // Add each language if it doesn't already exist in the array
    const updatedLanguages = [...formData.languages];
    
    languagesToAdd.forEach(lang => {
      if (!updatedLanguages.includes(lang)) {
        updatedLanguages.push(lang);
      }
    });
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
    
    setNewLanguage('');
  };
  
  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  // Add Language directly from available languages
  const toggleLanguage = (langCode) => {
    if (formData.languages.includes(langCode)) {
      // Remove language if already selected
      setFormData({
        ...formData,
        languages: formData.languages.filter(code => code !== langCode)
      });
    } else {
      // Add language if not selected
      setFormData({
        ...formData,
        languages: [...formData.languages, langCode]
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // For testing without auth, using a user ID
      const projectData = {
        ...formData,
        createdBy: "648cf2a43120913ba3c1eff3" 
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
      
      // Notify parent component after a delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project. Check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          
          {/* Available Languages Section */}
          {availableLanguages.length > 0 && (
            <div className="mb-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
              <p className="font-medium text-indigo-700 mb-2">Available Languages</p>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map(lang => (
                  <span 
                    key={lang._id}
                    className={`inline-block px-3 py-1.5 rounded cursor-pointer transition-colors
                      ${formData.languages.includes(lang.code) 
                        ? 'bg-indigo-200 text-indigo-800 border border-indigo-400' 
                        : 'bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    <span className="font-medium">{lang.code}</span>
                    <span className="ml-1 text-sm">- {lang.name}</span>
                    {formData.languages.includes(lang.code) && 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    }
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-indigo-600">
                Click on a language to select or deselect it
              </p>
            </div>
          )}
          
          {/* Selected Languages Display */}
          {formData.languages.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-gray-700 mb-2">Selected Languages:</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Manual Language Entry */}
          <div className="flex">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add languages (e.g., EN, FR, ES)"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLanguage();
                }
              }}
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
            Add custom languages by typing codes separated by commas (e.g., EN, FR, ES)
          </p>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
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
    </>
  );
};

// Edit Project Form Component
const EditProjectForm = ({ project, onSuccess, availableLanguages = [] }) => {
  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    languages: project.languages || []
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
  
  // Modified addLanguage function to handle comma-separated languages
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    // Process the input to handle multiple languages separated by commas
    const languagesToAdd = newLanguage
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang !== '');
    
    // Add each language if it doesn't already exist in the array
    const updatedLanguages = [...formData.languages];
    
    languagesToAdd.forEach(lang => {
      if (!updatedLanguages.includes(lang)) {
        updatedLanguages.push(lang);
      }
    });
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
    
    setNewLanguage('');
  };
  
  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  // Add Language directly from available languages
  const toggleLanguage = (langCode) => {
    if (formData.languages.includes(langCode)) {
      // Remove language if already selected
      setFormData({
        ...formData,
        languages: formData.languages.filter(code => code !== langCode)
      });
    } else {
      // Add language if not selected
      setFormData({
        ...formData,
        languages: [...formData.languages, langCode]
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const projectData = {
        ...formData,
        _id: project._id // Ensure we keep the project ID
      };
      
      console.log('Updating project data:', projectData);
      const result = await projectService.updateProject(project._id, projectData);
      setSuccess('Project updated successfully!');
      
      // Notify parent component after a delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project. Check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          
          {/* Available Languages Section */}
          {availableLanguages.length > 0 && (
            <div className="mb-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
              <p className="font-medium text-indigo-700 mb-2">Available Languages</p>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map(lang => (
                  <span 
                    key={lang._id}
                    className={`inline-block px-3 py-1.5 rounded cursor-pointer transition-colors
                      ${formData.languages.includes(lang.code) 
                        ? 'bg-indigo-200 text-indigo-800 border border-indigo-400' 
                        : 'bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    <span className="font-medium">{lang.code}</span>
                    <span className="ml-1 text-sm">- {lang.name}</span>
                    {formData.languages.includes(lang.code) && 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    }
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-indigo-600">
                Click on a language to select or deselect it
              </p>
            </div>
          )}
          
          {/* Selected Languages Display */}
          {formData.languages.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-gray-700 mb-2">Selected Languages:</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Manual Language Entry */}
          <div className="flex">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add languages (e.g., EN, FR, ES)"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLanguage();
                }
              }}
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
            Add custom languages by typing codes separated by commas (e.g., EN, FR, ES)
          </p>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </>
  );
};

export default Settings;