import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css'; // Import the CSS file

function NotFoundPage({ requestedUrl }) {
  const navigate = useNavigate();

  const goBackHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 Page Not Found</h1>
      <p className="not-found-message">
        Sorry, the page <span className="url">"{requestedUrl}"</span> you are looking for does not exist.
      </p>
      <p className="not-found-message">Click the Home button to go back to the Homepage.</p>
      <button className="not-found-button" onClick={goBackHome}>
        Take me back to home page
      </button>
    </div>
  );
}

export default NotFoundPage;
