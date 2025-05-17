import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDeleteProject = async (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      try {
        setDeleteInProgress(true);
        await projectService.deleteProject(projectId);
        
        // Update projects state after successful deletion
        setProjects(projects.filter(p => p._id !== projectId));
        setSuccessMessage(`Project "${projectName}" has been deleted.`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete project');
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
          <Link 
            to="/settings" 
            className="inline-block bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Return to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link 
          to="/projects/add" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Project
        </Link>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6 flex justify-between items-center">
          <p>{successMessage}</p>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 hover:text-green-900"
          >
            &times;
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Link 
            to="/projects/add" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'No description'}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.languages && project.languages.length > 0 ? (
                  project.languages.map((lang, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-700 text-sm px-2 py-1 rounded-md">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No languages added</span>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/projects/${project._id}`} 
                    className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    View
                  </Link>
                  
                  <Link 
                    to={`/projects/edit/${project._id}`} 
                    className="text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
                  >
                    Edit
                  </Link>
                  
                  <button 
                    onClick={() => handleDeleteProject(project._id, project.name)}
                    disabled={deleteInProgress}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;