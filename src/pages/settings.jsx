// src/pages/settings.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import projectService from '../services/projectService';
import languageService from '../services/languageService';
import { useAuthContext } from '../hooks/useAuthContext'; // Assuming you have this hook

const Settings = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddLanguageForm, setShowAddLanguageForm] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const { user } = useAuthContext(); // Get the current user

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
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {/* Main content and sidebar layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content area (on left) */}
        <div className={`w-full ${(showAddForm || showAddLanguageForm) ? 'md:w-2/3 lg:w-2/3' : 'w-full'}`}>
          {/* Project Management Section */}
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
                    setShowAddForm(!showAddForm);
                    setShowAddLanguageForm(false); // Close other form if open
                  }}
                  className={`inline-flex items-center px-4 py-2 ${showAddForm 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'} 
                    rounded-md transition-colors`}
                >
                  {showAddForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Project
                    </>
                  )}
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
            </div>
          </div>
          
          {/* Language Management Section */}
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
                    setShowAddLanguageForm(!showAddLanguageForm);
                    setShowAddForm(false); // Close other form if open
                  }}
                  className={`inline-flex items-center px-4 py-2 ${showAddLanguageForm 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'} 
                    rounded-md transition-colors`}
                >
                  {showAddLanguageForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Language
                    </>
                  )}
                </button>
              </div>
              
              {/* Display existing languages */}
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Available Languages</h3>
                {isLoadingLanguages ? (
                  <p>Loading languages...</p>
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
          
          {/* NEW SECTION: Admin Controls Section (Only visible to Admin users) */}
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
        
        {/* Right sidebar for forms when visible */}
        {(showAddForm || showAddLanguageForm) && (
          <div className="w-full md:w-1/3 lg:w-1/3">
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                <AddProjectForm 
                  onSuccess={() => setShowAddForm(false)} 
                  availableLanguages={languages}
                />
              </div>
            )}
            
            {showAddLanguageForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Language</h2>
                <AddLanguageForm 
                  onSuccess={() => {
                    setShowAddLanguageForm(false);
                    // Refresh languages list
                    languageService.getLanguages().then(data => setLanguages(data));
                  }}
                  existingLanguages={languages}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add Language Form Component
const AddLanguageForm = ({ onSuccess, existingLanguages = [] }) => {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // For testing without auth, use a placeholder user ID
      const projectData = {
        ...formData,
        createdBy: "648cf2a43120913ba3c1eff3" // Replace with a valid user ID from your DB
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
        if (onSuccess) onSuccess();
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
          {availableLanguages.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Available languages:</p>
              <div className="flex flex-wrap gap-1">
                {availableLanguages.map(lang => (
                  <span 
                    key={lang._id}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      if (!formData.languages.includes(lang.code)) {
                        setFormData({
                          ...formData,
                          languages: [...formData.languages, lang.code]
                        });
                      }
                    }}
                  >
                    {lang.code} - {lang.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Add languages that will be used in this project. Separate multiple languages with commas (e.g., EN, FR, ES)
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

export default Settings;