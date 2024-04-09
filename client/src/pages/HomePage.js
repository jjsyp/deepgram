import React from 'react';
import Navbar from '../components/Navbar/Navbar';

/**
 * HomePage component which contains a welcome message and a Login with Google button.
 * @returns {React.Element} The rendered React element which displays the welcome 
 * message and a Login with Google button.
 */
const HomePage = () => {
  /**
   * This function handles the login process by redirecting the user to the 
   * Google Sign-In page.
   */
  const loginHandler = () => {
    window.location.href = process.env.REACT_APP_API_URL + '/api/auth/signin-google';
  };

  return (
  <>
    <Navbar />
    <div className="welcome-container">
        <div className ="welcome-message">
            <h1>Welcome to our site</h1>
        </div>
        <div className="container">
            <button onClick={loginHandler}>Login with Google</button>
        </div>
    </div>
  </>
  );
};

export default HomePage;