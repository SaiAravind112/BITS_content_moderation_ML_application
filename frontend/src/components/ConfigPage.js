import React, { useState, useEffect } from 'react';
import Header from './Header';
import config from '../config';

const ConfigPage = () => {
  // States for threshold values
  const [blockThreshold, setBlockThreshold] = useState(0.7);
  const [warnThreshold, setWarnThreshold] = useState(0.1);
  const [passThreshold, setPassThreshold] = useState(0);
  
  // State for API version
  const [apiVersion, setApiVersion] = useState('v1');

  // Fetch initial configuration settings
  useEffect(() => {
    fetchConfigSettings();
  }, []);

  const fetchConfigSettings = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/config`);
      const data = await response.json();
      setBlockThreshold(data.blockThreshold);
      setWarnThreshold(data.warnThreshold);
      setPassThreshold(data.passThreshold);
      setApiVersion(data.apiVersion);
    } catch (error) {
      console.error('Error fetching config settings:', error);
    }
  };

  // Handle threshold update submission
  const handleConfigSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch(`${config.backendUrl}/config/update-thresholds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockThreshold,
          warnThreshold,
          passThreshold,
        }),
      });
      alert('Thresholds updated successfully!');
    } catch (error) {
      console.error('Error updating thresholds:', error);
      alert('Failed to update thresholds');
    }
  };

  // Handle API version update
  const handleApiVersionChange = async (version) => {
    setApiVersion(version);
    try {
      await fetch(`${config.backendUrl}/config/update-api-version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiVersion: version }),
      });
      alert(`API version set to ${version}`);
    } catch (error) {
      console.error('Error updating API version:', error);
      alert('Failed to update API version');
    }
  };

  return (
    <div className="container">
      <Header />
      <h1>Configuration Page</h1>
      
      <div className="configuration-section">
        <h2>Set Thresholds</h2>
        <form onSubmit={handleConfigSubmit}>
          <div>
            <label>Block Threshold:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={blockThreshold}
              onChange={(e) => setBlockThreshold(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label>Warn Threshold:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={warnThreshold}
              onChange={(e) => setWarnThreshold(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label>Pass Threshold:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={passThreshold}
              onChange={(e) => setPassThreshold(parseFloat(e.target.value))}
            />
          </div>
          <button type="submit">Update Thresholds</button>
        </form>

        <div className="api-version-section">
          <h3>Select API Version</h3>
          <label>
            <input
              type="radio"
              value="v1"
              checked={apiVersion === 'v1'}
              onChange={() => handleApiVersionChange('v1')}
            />
            v1
          </label>
          <label>
            <input
              type="radio"
              value="v2"
              checked={apiVersion === 'v2'}
              onChange={() => handleApiVersionChange('v2')}
            />
            v2
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
