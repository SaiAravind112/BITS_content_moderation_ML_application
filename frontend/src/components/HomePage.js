import React, { useState, useEffect } from 'react';
import config from '../config'; 

const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const [moderationResult, setModerationResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0); // Add state for total entries


  useEffect(() => {
    fetchEntries();
  }, [currentPage]);

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
        body: JSON.stringify({ text: inputText }),
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
    // Handle feedback logic here
    console.log(`Feedback for entry ${entryId}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Home Page</h1>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to moderate"
        />
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
              <th>Status</th>
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
                <td className={`status-${entry.status.toLowerCase()}`}>{entry.status}</td>
                <td>
                  {entry.feedbackGiven ? (
                    <div className="feedback-text">
                      Feedback <span className="tick-mark">&#10003;</span>
                    </div>
                  ) : (
                    <button onClick={() => handleFeedbackClick(entry._id)}>Feedback</button>
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
      </div>
  );
};

export default HomePage;