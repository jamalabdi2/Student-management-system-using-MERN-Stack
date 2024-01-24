import React from 'react';
import { Link } from 'react-router-dom';
import './sucessPage.css'; // Import your CSS file for styling

function SuccessPage() {
  return (
    <div className="success-container">
      <h2>Registration Successful!</h2>
      <p>Your account has been successfully registered.</p>
      <p>Please check your email for a verification link.</p>

      <Link to="/loginStudent" className="login-link">
        Login Now
      </Link>
    </div>
  );
}

export default SuccessPage;
