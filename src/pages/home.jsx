// src/pages/home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState('json');
  
  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        // Select first project by default if available
        if (data.length > 0) {
          setSelectedProject(data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sample translation data 
  useEffect(() => {
    // Simulating translation data 
    const sampleTranslations = [
      { id: 1, key: 'ABOUT', language: 'EN', translation: 'About' },
      { id: 2, key: 'ABOUT', language: 'AR', translation: 'حول' },
    ];
    
    setTranslations(sampleTranslations);
  }, [selectedProject]); // Refetch when selected project changes
  
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    // would fetch translations for the selected project here
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-indigo-800">GTN Portal</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex">
            <select 
              className="border border-gray-300 rounded-l px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedProject}
              onChange={handleProjectChange}
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
              {projects.length === 0 && <option value="">No projects</option>}
            </select>
            
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search..." 
                className="border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Keys | Words
              </span>
            </div>
          </div>
          
          <Link to="/settings" className="text-indigo-600 hover:text-indigo-800">
            Settings
          </Link>
          
          <button className="bg-indigo-700 text-white px-3 py-1.5 rounded flex items-center">
            <span className="mr-1">+</span> Assign New Language
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Home;