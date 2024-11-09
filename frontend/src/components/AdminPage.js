import React, { useState, useEffect } from 'react';
import Header from './Header';
import config from '../config'; 

const AdminPage = () => {
  const [reviewEntries, setReviewEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0); // Add state for total entries
  const [thresholds, setThresholds] = useState({ pass: 0, warn: 0.5, block: 0.8 });
  const [isExporting, setIsExporting] = useState(false); // Loading state for export



  useEffect(() => {
    fetchConfig(); // Call fetchConfig to load probability limits
    fetchReviewEntries();
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
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const fetchReviewEntries = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/ug-content/review?page=${currentPage}&limit=${entriesPerPage}`);
      const data = await response.json();
      setReviewEntries(data.entries);
      setTotalEntries(data.totalEntries);
    } catch (error) {
      console.error('Error fetching review entries:', error);
    }
  };

  const handleExportRetrainEntries = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${config.backendUrl}/export/retrain-entries`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('CSV file created successfully in the temp directory.');
      } else {
        console.error('Failed to create CSV file');
        alert('Failed to create CSV file. Please try again.');
      }
    } catch (error) {
      console.error('Error exporting retrain entries:', error);
      alert('An error occurred while exporting retrain entries.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReviewAction = async (entryId, action) => {
    try {
      const response = await fetch(`${config.backendUrl}/ug-content/review/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId, status: action }),
      });
      if (response.ok) {
        // Update the review entries state to reflect the change
        setReviewEntries((prevEntries) =>
          prevEntries.filter((entry) => entry._id !== entryId)
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTag = (probability) => {
    if (probability >= thresholds.block) return 'Block';
    if (probability >= thresholds.warn) return 'Warn';
    return 'Pass';
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
       <Header />
      <h1>Admin Page</h1>

      <div className="configuration-section">
        <h2>Re-Train with Feedback</h2>
        {/* Add your configuration settings here */}
        <button
        className="export-button"
        onClick={handleExportRetrainEntries}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Submit for Retrain'}
      </button>
      </div>
      <div className="review-section entries-list">
        <h2>Content Review</h2>
        <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Moderation Result</th>
              <th>Probability Tag</th>
              <th>Status</th>
              <th>Version</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviewEntries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.text}</td>
                <td className={`${entry.contentModerationResult.moderationStatus}`}>
                  {entry.contentModerationResult.moderationStatus.toUpperCase()}
                </td>
                <td><span className={`tag ${getTag(entry.contentModerationResult.inappropriateProbability).toLowerCase()}`}>{getTag(entry.contentModerationResult.inappropriateProbability).toUpperCase()}</span></td>
                <td>{entry.status}</td>
                <td>{entry.version}</td>
                <td>{entry.expectedResult?.text || 'No feedback'}</td>
                <td>
                  <button
                    className="review-button approve-button"
                    onClick={() => handleReviewAction(entry._id, 'APPROVED')}
                  >
                    <span className="icon">&#10003;</span>
                  </button>
                  <button
                    className="review-button reject-button"
                    onClick={() => handleReviewAction(entry._id, 'REJECTED')}
                  >
                    <span className="icon">&#10007;</span>
                  </button>
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
    </div>
  );
};

export default AdminPage;