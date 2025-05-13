import React from 'react';
import AddProject from '../components/AddProject';

const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <AddProject />
      {/* Add your project list here */}
    </div>
  );
};

export default Settings;
