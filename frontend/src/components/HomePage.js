import React, { useState, useEffect } from 'react';
import Header from './Header';
import config from '../config'; 

const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const [moderationResult, setModerationResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0); // Add state for total entries
  const [thresholds, setThresholds] = useState({ pass: 0, warn: 0.5, block: 0.8 });
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState(null);


  useEffect(() => {
    fetchConfig(); // Call fetchConfig to load probability limits
    fetchEntries();
  }, [currentPage]);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/config`);
      const data = await response.json();
      setThresholds({
        pass: data.passThreshold,
        warn: data.warnThreshold,
        block: data.blockThreshold,
      });
      setVersions(["v1", "v2"]); // Set versions state with available versions
      setSelectedVersion(data.apiVersion); // Set default selected version
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/ug-content/history?page=${currentPage}&limit=${entriesPerPage}`);
      const data = await response.json();
      setEntries(data.entries);
      setTotalEntries(data.totalEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const getTag = (probability) => {
    if (probability >= thresholds.block) return 'Block';
    if (probability >= thresholds.warn) return 'Warn';
    return 'Pass';
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call the moderation API with the input text
      const response = await fetch(`${config.backendUrl}/ug-content/analyse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          version: selectedVersion, // Include version in the request body
        }),
      });
      const result = await response.json();
      // Format the result object into a string
      const formattedResult = `Text: ${result.text}, Status: ${result.moderationStatus}`;
      // Set the moderation result in the state
      setModerationResult(formattedResult);
      setInputText(''); // Clear the text area
      fetchEntries(); // Reset the list
    } catch (error) {
      console.error('Error moderating text:', error);
      setModerationResult('Error moderating text');
      setIsError(true);
    }
  };

  const handleCloseClick = () => {
    setModerationResult('');
  };

  const handleFeedbackClick = (entryId) => {
    setSelectedEntryId(entryId);
    setShowFeedbackPopup(true);
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch(`${config.backendUrl}/ug-content/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: selectedEntryId, feedback: feedbackText }),
      });
      setShowFeedbackPopup(false);
      setFeedbackText('');
      fetchEntries(); // Refresh entries to reflect the feedback status
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
       <Header />
      <h1>Home Page</h1>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to moderate"
        />
        <select value={selectedVersion} onChange={handleVersionChange}>
          {versions.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
        <button className="submit" type="submit">Submit</button>
      </form>
      {moderationResult && (
        <div className={`moderation-result ${isError ? 'error' : 'success'}`}>
          <span>{moderationResult}</span>
          <button className="close-button" onClick={handleCloseClick}>
            &times;
          </button>
        </div>
      )}
      <div className="entries-list">
        <h2>Previous Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Moderation Result</th>
              <th>Probability Tag</th>
              <th>Review Status</th>
              <th>Version</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.text}</td>
                <td className={`${entry.contentModerationResult.moderationStatus}`}>
                  {entry.contentModerationResult.moderationStatus.toUpperCase()}
                </td>
                <td><span className={`tag ${getTag(entry.contentModerationResult.inappropriateProbability).toLowerCase()}`}>{getTag(entry.contentModerationResult.inappropriateProbability).toUpperCase()}</span></td>
                <td className={`status-${entry.status.toLowerCase()}`}>{entry.status}</td>
                <td>{entry.version}</td>
                <td>
                  {entry.feedbackGiven ? (
                    <div className="feedback-text">
                      Feedback <span className="tick-mark">&#10003;</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleFeedbackClick(entry._id)} 
                      disabled={entry.feedbackGiven} 
                      className={`feedback-button ${entry.feedbackGiven ? 'disabled' : ''}`}
                    >
                      Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(totalEntries / entriesPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {showFeedbackPopup && (
        <div className="feedback-popup">
          <form onSubmit={handleFeedbackSubmit}>
            <h3>Provide Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
            />
            <button type="submit">Submit Feedback</button>
            <button type="button" onClick={() => setShowFeedbackPopup(false)}>Cancel</button>
          </form>
        </div>
      )}
      </div>
  );
};

export default HomePage;