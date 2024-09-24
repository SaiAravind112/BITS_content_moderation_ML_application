import React, { useState, useEffect } from 'react';
import config from '../config'; 

const AdminPage = () => {
  const [reviewEntries, setReviewEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0); // Add state for total entries


  useEffect(() => {
    fetchReviewEntries();
  }, [currentPage]);

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Admin Page</h1>
      <div className="configuration-section">
        <h2>Configuration</h2>
        {/* Add your configuration settings here */}
      </div>
      <div className="review-section entries-list">
        <h2>Content Review</h2>
        <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Moderation Result</th>
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